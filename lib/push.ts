import webpush from 'web-push';
import { connectDB } from './mongodb';
import PushSubscription from './models/PushSubscription';

let initialized = false;

function init() {
  if (initialized) return;
  const pub = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  const subj = process.env.VAPID_SUBJECT;
  if (!pub || !priv || !subj) {
    console.warn('⚠️ VAPID keys missing — push disabled');
    return;
  }
  webpush.setVapidDetails(subj, pub, priv);
  initialized = true;
}

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
  tag?: string;
}

export async function sendToAll(payload: PushPayload) {
  init();
  if (!initialized) return { sent: 0, failed: 0 };

  await connectDB();
  const subs = await PushSubscription.find().lean();
  let sent = 0;
  let failed = 0;

  await Promise.all(
    subs.map(async (s: any) => {
      try {
        await webpush.sendNotification(
          { endpoint: s.endpoint, keys: s.keys },
          JSON.stringify(payload)
        );
        sent++;
      } catch (e: any) {
        failed++;
        if (e?.statusCode === 404 || e?.statusCode === 410) {
          await PushSubscription.deleteOne({ endpoint: s.endpoint });
        }
      }
    })
  );

  return { sent, failed, total: subs.length };
}