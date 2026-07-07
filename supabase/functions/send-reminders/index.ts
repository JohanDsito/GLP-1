import webpush from 'npm:web-push@3.6.7';
import { createClient } from 'npm:@supabase/supabase-js@2.57.2';

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY') ?? '';
const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY') ?? '';
const vapidSubject = Deno.env.get('VAPID_SUBJECT') ?? 'mailto:admin@example.com';

interface ReminderRow {
  user_id: string;
  dose_reminder_enabled: boolean;
  dose_reminder_time: string;
  checkin_reminder_enabled: boolean;
  checkin_reminder_time: string;
  timezone: string;
  last_dose_reminded_on: string | null;
  last_checkin_reminded_on: string | null;
}

interface PushRow {
  endpoint: string;
  p256dh: string;
  auth: string;
}

// Returns { date: 'YYYY-MM-DD', minutes: number } for the given timezone "now".
function localNow(timezone: string): { date: string; minutes: number } {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '00';
  const date = `${get('year')}-${get('month')}-${get('day')}`;
  const minutes = Number(get('hour')) * 60 + Number(get('minute'));
  return { date, minutes };
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':');
  return Number(h) * 60 + Number(m);
}

// A reminder is "due" if the local time is within this window past the target.
const DUE_WINDOW_MINUTES = 20;

const messages: Record<'en' | 'es' | 'pt', Record<'dose' | 'checkin', { title: string; body: string }>> = {
  en: {
    dose: { title: 'Time for your dose', body: 'Open GLP-1 Guide to log your dose.' },
    checkin: { title: 'Daily check-in', body: 'How are you feeling today? Log your check-in and symptoms.' },
  },
  es: {
    dose: { title: 'Es hora de tu dosis', body: 'Abre GLP-1 Guide para registrar tu dosis.' },
    checkin: { title: 'Registro diario', body: 'Como te sientes hoy? Registra tu estado y tus sintomas.' },
  },
  pt: {
    dose: { title: 'Hora da sua dose', body: 'Abra o GLP-1 Guide para registrar sua dose.' },
    checkin: { title: 'Registro diario', body: 'Como voce esta hoje? Registre seu estado e seus sintomas.' },
  },
};

Deno.serve(async () => {
  if (!supabaseUrl || !supabaseServiceRoleKey || !vapidPublicKey || !vapidPrivateKey) {
    return new Response('Missing environment variables', { status: 500 });
  }

  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false },
  });

  const { data: prefs, error } = await supabase
    .from('reminder_preferences')
    .select('*')
    .or('dose_reminder_enabled.eq.true,checkin_reminder_enabled.eq.true');

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  let sent = 0;

  for (const pref of (prefs ?? []) as ReminderRow[]) {
    const { date, minutes } = localNow(pref.timezone || 'UTC');

    const doseDue =
      pref.dose_reminder_enabled &&
      pref.last_dose_reminded_on !== date &&
      minutes >= timeToMinutes(pref.dose_reminder_time) &&
      minutes < timeToMinutes(pref.dose_reminder_time) + DUE_WINDOW_MINUTES;

    const checkinDue =
      pref.checkin_reminder_enabled &&
      pref.last_checkin_reminded_on !== date &&
      minutes >= timeToMinutes(pref.checkin_reminder_time) &&
      minutes < timeToMinutes(pref.checkin_reminder_time) + DUE_WINDOW_MINUTES;

    if (!doseDue && !checkinDue) {
      continue;
    }

    const kind = doseDue ? 'dose' : 'checkin';

    // Localize the notification to the user's app language.
    const { data: langRow } = await supabase
      .from('treatment_profiles')
      .select('language')
      .eq('user_id', pref.user_id)
      .maybeSingle();
    const lang = (langRow?.language as 'en' | 'es' | 'pt' | undefined) ?? 'es';

    const { title, body } = messages[lang][kind];
    const url = '/dose-tracker';

    // In-app notification (always-works layer)
    await supabase.from('notifications').insert({
      user_id: pref.user_id,
      type: `reminder_${kind}`,
      title,
      body,
      channel: 'push',
      sent_at: new Date().toISOString(),
    });

    // Web push to all of the user's subscriptions
    const { data: subs } = await supabase
      .from('push_subscriptions')
      .select('endpoint, p256dh, auth')
      .eq('user_id', pref.user_id);

    for (const sub of (subs ?? []) as PushRow[]) {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          JSON.stringify({ title, body, url }),
        );
        sent += 1;
      } catch (pushError) {
        // Drop subscriptions that Stripe/push service rejects (410 Gone).
        const statusCode = (pushError as { statusCode?: number }).statusCode;
        if (statusCode === 404 || statusCode === 410) {
          await supabase.from('push_subscriptions').delete().eq('endpoint', sub.endpoint);
        }
      }
    }

    await supabase
      .from('reminder_preferences')
      .update(
        kind === 'dose' ? { last_dose_reminded_on: date } : { last_checkin_reminded_on: date },
      )
      .eq('user_id', pref.user_id);
  }

  return new Response(JSON.stringify({ ok: true, sent }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
