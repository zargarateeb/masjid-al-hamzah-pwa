import mongoose, { Schema, models, model } from 'mongoose';

export interface ICommitteeMember {
  _id?: string;
  role: string;
  name: string;
  phone?: string;
  email?: string;
}

export interface ICommittee {
  _key: string;
  masjidName: string;
  location: string;
  committee: ICommitteeMember[];
  members: ICommitteeMember[];
  about?: string;
  updatedAt: Date;
}

const MemberSchema = new Schema<ICommitteeMember>(
  {
    role: { type: String, required: true },
    name: { type: String, default: '' },
    phone: String,
    email: String,
  },
  { _id: true }
);

const CommitteeSchema = new Schema<ICommittee>(
  {
    _key: { type: String, default: 'main', unique: true },
    masjidName: { type: String, default: 'Masjid Al-Hamzah' },
    location: { type: String, default: 'HajiBagh, Buchpora, Srinagar' },
    committee: { type: [MemberSchema], default: [] },
    members: { type: [MemberSchema], default: [] },
    about: { type: String, default: '' },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    collection: 'committee',
    strict: false,
  }
);

if (models.Committee) {
  delete (models as any).Committee;
}

export default model<ICommittee>('Committee', CommitteeSchema);