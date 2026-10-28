import mongoose, { Schema, models, model } from 'mongoose';

export interface IPushSubscription {
  userId?: string;
  endpoint: string;
  keys: { p256dh: string; auth: string };
  createdAt: Date;
  lastSeen: Date;
}

const PushSubSchema = new Schema<IPushSubscription>(
  {
    userId: { type: String, index: true },
    endpoint: { type: String, required: true, unique: true },
    keys: {
      p256dh: { type: String, required: true },
      auth: { type: String, required: true },
    },
    createdAt: { type: Date, default: Date.now },
    lastSeen: { type: Date, default: Date.now },
  },
  { collection: 'push_subscriptions' }
);

export default models.PushSubscription ||
  model<IPushSubscription>('PushSubscription', PushSubSchema);