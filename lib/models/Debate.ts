import mongoose, { Schema, models, model } from 'mongoose';

export interface IDebateResponse {
  _id?: string;
  responderName: string;
  responderEmail?: string;
  responderUserId?: string;
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
  proposerUserId?: string;
  proposerEmail?: string;
  topic: string;
  proposedTime: string;
  venue: string;
  description: string;
  status: 'open' | 'negotiating' | 'confirmed' | 'closed';
  responses: IDebateResponse[];
  createdAt: Date;
  updatedAt?: Date;
}

const ResponseSchema = new Schema<IDebateResponse>(
  {
    responderName: { type: String, required: true },
    responderEmail: String,
    responderUserId: String,
    type: { type: String, enum: ['accept', 'counter'], required: true },
    message: { type: String, default: '' },
    counterTime: String,
    counterTopic: String,
    counterVenue: String,
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const DebateSchema = new Schema<IDebate>(
  {
    proposerName: { type: String, required: true },
    proposerContact: { type: String, required: true },
    proposerUserId: String,
    proposerEmail: String,
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
    updatedAt: { type: Date, default: Date.now },
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