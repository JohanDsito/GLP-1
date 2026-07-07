# Push & Reminders Setup

## Overview

Two-layer notifications:

1. **In-app feed** (`notifications` table) — always works, shown via the bell in the topbar and `/notifications`.
2. **Web Push** — reaches the device even when the app is closed. On iPhone it only works if the user "installs" the PWA to the home screen (iOS 16.4+).

## 1. Generate VAPID keys (once)

```bash
npx web-push generate-vapid-keys
```

This prints a public and private key.

## 2. Frontend env

Add the **public** key to the frontend `.env`:

```
VITE_VAPID_PUBLIC_KEY=<public key>
```

## 3. Edge Function secrets

```bash
supabase secrets set VAPID_PUBLIC_KEY=<public key>
supabase secrets set VAPID_PRIVATE_KEY=<private key>
supabase secrets set VAPID_SUBJECT=mailto:you@yourdomain.com
```

(`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` already exist from the Stripe setup.)

## 4. Apply migration & deploy functions

```bash
supabase db push
supabase functions deploy save-push-subscription
supabase functions deploy send-reminders --no-verify-jwt
```

## 5. Schedule send-reminders (every 15 min)

Run once in the Supabase SQL Editor (enables pg_cron + pg_net and schedules the call).
Replace `<PROJECT_REF>` and `<SERVICE_ROLE_KEY>`:

```sql
create extension if not exists pg_cron;
create extension if not exists pg_net;

select cron.schedule(
  'send-reminders-every-15-min',
  '*/15 * * * *',
  $$
  select net.http_post(
    url := 'https://<PROJECT_REF>.supabase.co/functions/v1/send-reminders',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer <SERVICE_ROLE_KEY>'
    ),
    body := '{}'::jsonb
  );
  $$
);
```

To unschedule: `select cron.unschedule('send-reminders-every-15-min');`

## 6. Test

- In Settings → Reminders, enable a reminder, set its time to ~1 minute from now, and enable push (grant permission). Confirm a row appears in `push_subscriptions`.
- Trigger the function manually: `supabase functions invoke send-reminders --no-verify-jwt` (or wait for the cron). Confirm a push notification arrives and a row is inserted in `notifications`.

## Notes

- `send-reminders` uses `npm:web-push`. If the Deno edge runtime rejects it, swap for a Deno-native web push implementation.
- Reminders respect the user's stored `timezone`; times are compared in local time with a 20-minute due window, and `last_*_reminded_on` prevents duplicates the same day.
- Production Web Push requires the frontend served over HTTPS (localhost is allowed for dev).
