"use client";
import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useAppStore } from "@/lib/store";
import Overlay, {
  GlassCard,
  Star8,
  OrnamentDivider,
  Kicker,
  PrimaryButton,
  SecondaryButton,
} from "../ui/Theme";

export function SettingsOverlay() {
  const push = useAppStore((s) => s.pushScreen);
  const { data: session } = useSession();
  const [busy, setBusy] = useState(false);
  const [isSuper, setIsSuper] = useState(false);
  const [checking, setChecking] = useState(true);

  const email = session?.user?.email || "";

  useEffect(() => {
    if (!email) {
      setChecking(false);
      return;
    }
    fetch(`/api/super/check?email=${encodeURIComponent(email)}`)
      .then((r) => r.json())
      .then((d) => setIsSuper(!!d.isSuperAdmin))
      .catch(() => {})
      .finally(() => setChecking(false));
  }, [email]);

  async function enableNotifications() {
    setBusy(true);
    try {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        alert("Push not supported");
        return;
      }
      const perm = await Notification.requestPermission();
      if (perm !== "granted") {
        alert("Permission denied");
        return;
      }
      const reg = await navigator.serviceWorker.getRegistration();
      if (!reg) {
        alert("No service worker");
        return;
      }
      await navigator.serviceWorker.ready;
      const vapid = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapid) {
        alert("VAPID missing");
        return;
      }
      const padding = "=".repeat((4 - (vapid.length % 4)) % 4);
      const base64 = (vapid + padding).replace(/-/g, "+").replace(/_/g, "/");
      const raw = atob(base64);
      const arr = new Uint8Array(raw.length);
      for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: arr,
      });
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscription: sub.toJSON(),
          userId: (session?.user as { id?: string } | undefined)?.id,
        }),
      });
      alert("✓ Notifications enabled");
    } catch (e) {
      alert("Error: " + ((e as Error)?.message || "Unknown"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Overlay title="Settings">
      <div className="space-y-4">
        <GlassCard variant="cream" padding="p-5">
          <div className="flex items-center justify-between">
            <Kicker>{session ? "Signed in" : "Guest"}</Kicker>
            <Star8 size={12} />
          </div>
          {session ? (
            <>
              <div className="mt-4 flex items-center gap-3">
                {session.user?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={session.user.image}
                    alt=""
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-[#dec680]"
                  />
                ) : (
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-[#c9a45d] font-serif text-[18px] font-semibold text-white">
                    {session.user?.name?.[0]?.toUpperCase() || "·"}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-serif text-[15px] font-semibold text-ink">
                    {session.user?.name}
                  </p>
                  <p className="truncate text-[12px] text-ink-muted">
                    {session.user?.email}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <SecondaryButton onClick={() => signOut()}>
                  Sign out
                </SecondaryButton>
              </div>
            </>
          ) : (
            <>
              <p className="mt-3 font-serif text-[15px] font-semibold text-ink">
                Sign in to save progress
              </p>
              <p className="mt-1 text-[12px] text-ink-muted">
                Track prayers, Quran, and deeds across devices.
              </p>
              <div className="mt-4">
                <PrimaryButton onClick={() => signIn("google")}>
                  Sign in with Google
                </PrimaryButton>
              </div>
            </>
          )}
        </GlassCard>

        {isSuper && !checking && (
          <GlassCard
            variant="gold"
            padding="p-5"
            onClick={() => push("super-admin")}
          >
            <div className="flex items-center gap-3">
              <div
                className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl"
                style={{
                  background:
                    "linear-gradient(160deg, #e5b437 0%, #c9a227 55%, #8a6b15 100%)",
                  boxShadow: "0 6px 14px -4px rgba(201,162,39,0.5)",
                }}
              >
                <Star8 size={20} color="#ffffff" />
              </div>
              <div className="flex-1">
                <p className="font-serif text-[15px] font-semibold text-ink">
                  ⭐ Super Admin
                </p>
                <p className="mt-0.5 text-[12px] text-ink-muted">
                  Full system access
                </p>
              </div>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#8a6b15"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </GlassCard>
        )}

        <GlassCard variant="gold" padding="p-5">
          <div className="flex items-start gap-3">
            <div
              className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl"
              style={{
                background:
                  "linear-gradient(160deg, #e5b437 0%, #c9a227 55%, #8a6b15 100%)",
                boxShadow: "0 6px 14px -4px rgba(201,162,39,0.5)",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-serif text-[15px] font-semibold text-ink">
                Prayer Reminders
              </p>
              <p className="mt-0.5 text-[12px] text-ink-muted">
                Notified before every Azān &amp; Jamā&apos;ah
              </p>
            </div>
          </div>
          <div className="mt-4">
            <PrimaryButton onClick={enableNotifications} disabled={busy}>
              {busy ? "Setting up…" : "Enable notifications"}
            </PrimaryButton>
          </div>
          <div className="mt-2">
            <SecondaryButton
              onClick={async () => {
                await fetch("/api/push/test", { method: "POST" });
                alert("Test sent");
              }}
            >
              Send test notification
            </SecondaryButton>
          </div>
        </GlassCard>

        <GlassCard
          variant="cream"
          padding="p-5"
          onClick={() => push("admin-pin")}
        >
          <div className="flex items-center gap-3">
            <div
              className="grid h-12 w-12 place-items-center rounded-2xl"
              style={{
                background:
                  "linear-gradient(160deg, rgba(201,164,93,0.28) 0%, rgba(168,133,92,0.12) 100%)",
                border: "1px solid rgba(201,164,93,0.35)",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#8a6b15"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-serif text-[15px] font-semibold text-ink">
                Admin Panel
              </p>
              <p className="mt-0.5 text-[12px] text-ink-muted">Requires PIN</p>
            </div>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6c746e"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </GlassCard>

        <div className="mt-4">
          <OrnamentDivider />
        </div>

        <div className="text-center">
          <Kicker>Developed by Ateeb</Kicker>
          <div className="mt-2 flex items-center justify-center gap-4 text-[12px] text-ink-muted">
            <a
              href="https://www.linkedin.com/in/ateeb-zargar-890022386?utm_source=share_via&utm_content=profile&utm_medium=member_android"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-forest"
            >
              LinkedIn
            </a>
            <span>·</span>
            <a
              href="https://github.com/zargarateeb"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-forest"
            >
              GitHub
            </a>
            <span>·</span>
            <a href="mailto:zargarateeb4@gmail.com" className="hover:text-forest">
              Email
            </a>
          </div>
        </div>
      </div>
    </Overlay>
  );
}