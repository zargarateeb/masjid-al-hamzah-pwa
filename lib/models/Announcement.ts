import mongoose, { Schema, models, model } from 'mongoose';

export interface IAnnouncementComment {
  _id?: string;
  authorName: string;
  authorEmail?: string;
  message: string;
  createdAt: Date;
}

export interface IAnnouncement {
  title: string;
  content: string;
  isUrgent: boolean;
  comments: IAnnouncementComment[];
  createdAt: Date;
}

const CommentSchema = new Schema<IAnnouncementComment>(
  {
    authorName: { type: String, required: true },
    authorEmail: String,
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const AnnouncementSchema = new Schema<IAnnouncement>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    isUrgent: { type: Boolean, default: false },
    comments: { type: [CommentSchema], default: [] },
    createdAt: { type: Date, default: Date.now },
  },
  {
    collection: 'announcements',
    strict: false,
  }
);

// Force-register the schema in dev so hot-reload doesn't reuse the stale one
if (models.Announcement) {
  delete (models as any).Announcement;
}

export default model<IAnnouncement>('Announcement', AnnouncementSchema);