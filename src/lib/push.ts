import { supabase } from './supabase/client';

const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY as string | undefined;

export const isPushSupported =
  typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window && Boolean(vapidPublicKey);

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const buffer = new ArrayBuffer(rawData.length);
  const outputArray = new Uint8Array(buffer);
  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

type EnablePushResult =
  | { ok: true }
  | { ok: false; reason: 'unsupported' | 'denied' | 'error'; message?: string };

export async function enablePush(): Promise<EnablePushResult> {
  if (!isPushSupported || !vapidPublicKey || !supabase) {
    return { ok: false, reason: 'unsupported' };
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    return { ok: false, reason: 'denied' };
  }

  // Step 1: subscribe in the browser. Fails if the VAPID public key is invalid.
  let subscription: PushSubscription;
  try {
    const registration = await navigator.serviceWorker.ready;
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });
  } catch (err) {
    console.error('[push] subscribe failed — likely an invalid VITE_VAPID_PUBLIC_KEY', err);
    return {
      ok: false,
      reason: 'error',
      message: 'Browser could not subscribe. Check that VITE_VAPID_PUBLIC_KEY is a valid VAPID key.',
    };
  }

  // Step 2: store the subscription via the Edge Function.
  const json = subscription.toJSON();
  try {
    const { error } = await supabase.functions.invoke('save-push-subscription', {
      method: 'POST',
      body: {
        endpoint: json.endpoint,
        p256dh: json.keys?.p256dh,
        auth: json.keys?.auth,
        userAgent: navigator.userAgent,
      },
    });

    if (error) {
      console.error('[push] save-push-subscription failed — is the function deployed?', error);
      return {
        ok: false,
        reason: 'error',
        message: 'Could not save the subscription. Make sure the save-push-subscription function is deployed.',
      };
    }
  } catch (err) {
    console.error('[push] save-push-subscription threw', err);
    return { ok: false, reason: 'error', message: err instanceof Error ? err.message : String(err) };
  }

  return { ok: true };
}
