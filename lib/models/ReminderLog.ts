import mongoose, { Schema, models, model } from 'mongoose';

export interface IReminderLog {
  date: string;
  prayer: string;
  kind: string;
  sentAt: Date;
}

const ReminderLogSchema = new Schema<IReminderLog>(
  {
    date: { type: String, required: true, index: true },
    prayer: { type: String, required: true },
    kind: { type: String, required: true },
    sentAt: { type: Date, default: Date.now },
  },
  { collection: 'reminder_logs' }
);

ReminderLogSchema.index({ date: 1, prayer: 1, kind: 1 }, { unique: true });

export default models.ReminderLog ||
  model<IReminderLog>('ReminderLog', ReminderLogSchema);