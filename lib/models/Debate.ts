import mongoose, { Schema, models, model } from 'mongoose';

export interface IDebateResponse {
  responderName: string;
  responderContact?: string;
  type: 'accept' | 'counter';
  message: string;
  counterTime?: string;
  counterTopic?: string;
  counterVenue?: string;
  createdAt: Date;
}

export interface IDebate {
  proposerName: string;
  proposerContact: string;
  topic: string;
  proposedTime: string;
  venue: string;
  description: string;
  status: 'open' | 'negotiating' | 'confirmed' | 'closed';
  responses: IDebateResponse[];
  createdAt: Date;
}

const ResponseSchema = new Schema<IDebateResponse>(
  {
    responderName: { type: String, required: true },
    responderContact: String,
    type: { type: String, enum: ['accept', 'counter'], required: true },
    message: { type: String, default: '' },
    counterTime: String,
    counterTopic: String,
    counterVenue: String,
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const DebateSchema = new Schema<IDebate>(
  {
    proposerName: { type: String, required: true },
    proposerContact: { type: String, required: true },
    topic: { type: String, required: true },
    proposedTime: { type: String, required: true },
    venue: { type: String, default: 'Masjid Al-Hamzah' },
    description: { type: String, default: '' },
    status: {
      type: String,
      enum: ['open', 'negotiating', 'confirmed', 'closed'],
      default: 'open',
    },
    responses: { type: [ResponseSchema], default: [] },
    createdAt: { type: Date, default: Date.now },
  },
  {
    collection: 'debates',
    strict: false,
  }
);

if (models.Debate) {
  delete (models as any).Debate;
}

export default model<IDebate>('Debate', DebateSchema);