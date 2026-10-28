import mongoose, { Schema, models, model } from 'mongoose';

export interface IPrayerLog {
  userId: string;
  date: string;
  checked: Record<string, boolean>;
  fardCount: number;
  pointsEarned: number;
  allFardBonus: boolean;
}

const PrayerLogSchema = new Schema<IPrayerLog>(
  {
    userId: { type: String, required: true, index: true },
    date: { type: String, required: true, index: true },
    checked: { type: Schema.Types.Mixed, default: {} },
    fardCount: { type: Number, default: 0 },
    pointsEarned: { type: Number, default: 0 },
    allFardBonus: { type: Boolean, default: false },
  },
  { collection: 'prayer_logs' }
);

PrayerLogSchema.index({ userId: 1, date: 1 }, { unique: true });

export default models.PrayerLog ||
  model<IPrayerLog>('PrayerLog', PrayerLogSchema);