import mongoose, { Schema, models, model } from 'mongoose';

export interface ITasbeehLog {
  userId: string;
  date: string;
  counts: Record<string, number>;
  totalPoints: number;
}

const TasbeehLogSchema = new Schema<ITasbeehLog>(
  {
    userId: { type: String, required: true, index: true },
    date: { type: String, required: true, index: true },
    counts: { type: Schema.Types.Mixed, default: {} },
    totalPoints: { type: Number, default: 0 },
  },
  { collection: 'tasbeeh_logs' }
);

TasbeehLogSchema.index({ userId: 1, date: 1 }, { unique: true });

export default models.TasbeehLog ||
  model<ITasbeehLog>('TasbeehLog', TasbeehLogSchema);