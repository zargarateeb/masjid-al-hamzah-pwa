import mongoose, { Schema, models, model } from 'mongoose';

export interface IUser {
  email: string;
  name: string;
  image?: string;
  phone?: string;
  city?: string;
  bio?: string;
  isAdmin: boolean;
  pushSubscription?: object;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    image: String,
    phone: String,
    city: String,
    bio: String,
    isAdmin: { type: Boolean, default: false },
    pushSubscription: { type: Schema.Types.Mixed, default: null },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: 'users' }
);

export default models.User || model<IUser>('User', UserSchema);