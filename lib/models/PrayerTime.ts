import mongoose, { Schema, models, model } from 'mongoose';

export interface IPrayerTime {
  date: string;
  fajr: string;
  zuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  jummah: string;
  updatedAt: Date;
}

const PrayerTimeSchema = new Schema<IPrayerTime>(
  {
    date: { type: String, required: true, unique: true },
    fajr: { type: String, default: '' },
    zuhr: { type: String, default: '' },
    asr: { type: String, default: '' },
    maghrib: { type: String, default: '' },
    isha: { type: String, default: '' },
    jummah: { type: String, default: '' },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: 'prayer_times' }
);

export default models.PrayerTime ||
  model<IPrayerTime>('PrayerTime', PrayerTimeSchema);