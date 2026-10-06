import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { connectDB } from './mongodb';
import User from './models/User';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/' },
  callbacks: {
    async signIn({ user }) {
      try {
        await connectDB();
        const existing = await User.findOne({ email: user.email });
        if (!existing) {
          await User.create({
            email: user.email,
            name: user.name || 'Guest',
            image: user.image,
            isAdmin: false,
          });
        }
        return true;
      } catch (e) {
        console.error('SignIn error:', e);
        return false;
      }
    },
    async jwt({ token, user, trigger }) {
      // Always refresh uid from DB so profile changes are picked up
      if (token.email) {
        try {
          await connectDB();
          const dbUser = await User.findOne({ email: token.email }).lean();
          if (dbUser) {
            token.uid = (dbUser as any)._id.toString();
            token.isAdmin = (dbUser as any).isAdmin || false;
            token.name = (dbUser as any).name;
            token.picture = (dbUser as any).image;
          }
        } catch (e) {
          console.error('JWT refresh error:', e);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.uid;
        (session.user as any).isAdmin = token.isAdmin;
      }
      return session;
    },
  },
};