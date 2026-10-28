import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Returns the signed-in user's email from the session, or null if not signed in.
 * Use this instead of trusting any userId/email from request bodies or URLs.
 */
export async function getSessionEmail(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return session?.user?.email ?? null;
}

/**
 * Returns the signed-in user's Mongo ID from the session, or null if not signed in.
 */
export async function getSessionUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return (session?.user as { id?: string } | undefined)?.id ?? null;
}

/**
 * True only if the signed-in user's email is in SUPER_ADMIN_EMAILS.
 * Never trust a client-supplied email — always call this.
 */
export async function isSuperAdmin(): Promise<boolean> {
  const email = await getSessionEmail();
  if (!email) return false;
  const raw = process.env.SUPER_ADMIN_EMAILS || "";
  const list = raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return list.includes(email.toLowerCase());
}

/**
 * Combined check: returns the session email if the user is a super-admin,
 * otherwise null. Use as:
 *   const adminEmail = await requireSuperAdmin();
 *   if (!adminEmail) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
 */
export async function requireSuperAdmin(): Promise<string | null> {
  const email = await getSessionEmail();
  if (!email) return null;
  const raw = process.env.SUPER_ADMIN_EMAILS || "";
  const list = raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return list.includes(email.toLowerCase()) ? email : null;
}