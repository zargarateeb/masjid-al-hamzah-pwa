"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useAppStore } from "@/lib/store";
import Overlay, {
  GlassCard,
  Star8,
  OrnamentDivider,
  Kicker,
  AmbientGlow,
} from "../ui/Theme";

interface UserRow {
  _id: string;
  email: string;
  name: string;
  image?: string;
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
  createdAt: string;
}

interface Stats {
  totalUsers: number;
  totalPrayerLogs: number;
  totalTasbeehLogs: number;
  totalTasbeeh: number;
  totalDebates: number;
  totalAnnouncements: number;
}

export function SuperAdminOverlay() {
  const { data: session } = useSession();
  const push = useAppStore((s) => s.pushScreen);
  const email = session?.user?.email || "";

  const [users, setUsers] = useState<UserRow[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"overview" | "users" | "content">("overview");

  useEffect(() => {
    if (!email) return;
    loadAll();
  }, [email]);

  async function loadAll() {
    setLoading(true);
    try {
      const [sRes, uRes] = await Promise.all([
        fetch(`/api/super/stats?email=${encodeURIComponent(email)}`),
        fetch(`/api/super/users?email=${encodeURIComponent(email)}`),
      ]);
      const s = await sRes.json();
      const u = await uRes.json();
      setStats(s.stats);
      setUsers(u.users || []);
    } catch {}
    setLoading(false);
  }

  if (!session || !email) {
    return (
      <Overlay title="Super Admin">
        <GlassCard variant="cream" padding="p-8" className="text-center">
          <p className="font-serif text-[16px] font-bold text-ink">
            Sign in required
          </p>
        </GlassCard>
      </Overlay>
    );
  }

  return (
    <Overlay title="Super Admin">
      <AmbientGlow
        color="gold"
        size={300}
        style={{ top: -100, right: -100, opacity: 0.4 }}
      />

      <div className="relative mb-5 text-center">
        <div
          className="mx-auto grid h-16 w-16 place-items-center rounded-full"
          style={{
            background: "linear-gradient(135deg,#fdf6e3 0%,#f4ead3 100%)",
            border: "1px solid rgba(201,164,93,0.35)",
          }}
        >
          <Star8 size={26} />
        </div>
        <p className="mt-3 font-serif text-[18px] font-bold text-ink">
          Super Admin
        </p>
        <p className="mt-1 text-[11.5px] text-ink-muted">{email}</p>
        <div className="mt-4">
          <OrnamentDivider />
        </div>
      </div>

      <div className="relative mb-4 flex gap-2">
        {(["overview", "users", "content"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={
              "flex-1 rounded-full py-2.5 text-[10.5px] font-bold uppercase tracking-[0.14em] transition " +
              (tab === t
                ? "bg-forest text-white"
                : "bg-white/70 text-ink-muted ring-1 ring-white/70")
            }
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 text-center text-[13px] text-ink-muted">
          Loading…
        </div>
      ) : (
        <div className="relative">
          {tab === "overview" && stats && (
            <div className="grid grid-cols-2 gap-3">
              {[
                { v: stats.totalUsers, l: "Total Users" },
                { v: stats.totalPrayerLogs, l: "Prayer Logs" },
                { v: stats.totalTasbeeh, l: "Tasbeeh Count" },
                { v: stats.totalDebates, l: "Debates" },
                { v: stats.totalAnnouncements, l: "Announcements" },
                { v: stats.totalTasbeehLogs, l: "Dhikr Sessions" },
              ].map((s) => (
                <GlassCard
                  key={s.l}
                  variant="cream"
                  padding="p-4"
                  className="text-center"
                >
                  <p className="font-serif text-[24px] font-bold leading-none text-[#8a6b15]">
                    {s.v}
                  </p>
                  <Kicker className="mt-2">{s.l}</Kicker>
                </GlassCard>
              ))}
            </div>
          )}

          {tab === "users" && (
            <div className="space-y-2">
              <p className="mb-3 text-[12px] text-ink-muted">
                {users.length} signed-in user{users.length === 1 ? "" : "s"}
              </p>
              {users.map((u) => (
                <GlassCard key={u._id} variant="cream" padding="p-3.5">
                  <div className="flex items-center gap-3">
                    {u.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={u.image}
                        alt=""
                        className="h-10 w-10 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#c9a45d] font-serif text-[14px] font-semibold text-white">
                        {u.name?.[0]?.toUpperCase() || "·"}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-serif text-[13.5px] font-semibold text-ink">
                          {u.name}
                        </p>
                        {u.isSuperAdmin && (
                          <span className="rounded-full bg-[#c9a45d] px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-white">
                            Super
                          </span>
                        )}
                        {u.isAdmin && !u.isSuperAdmin && (
                          <span className="rounded-full bg-[#c9a45d]/20 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-[#8a6b15]">
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="truncate text-[11px] text-ink-muted">
                        {u.email}
                      </p>
                    </div>
                    <p className="text-[10px] text-ink-muted">
                      {new Date(u.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}

          {tab === "content" && (
            <div className="space-y-3">
              <GlassCard
                variant="cream"
                padding="p-4"
                onClick={() => window.location.reload()}
              >
                <p className="font-serif text-[14px] font-semibold text-ink">
                  🔄 Refresh data
                </p>
                <p className="mt-0.5 text-[11.5px] text-ink-muted">
                  Pull latest from the server
                </p>
              </GlassCard>
              <GlassCard
                variant="cream"
                padding="p-4"
                onClick={() => push("announcements")}
              >
                <p className="font-serif text-[14px] font-semibold text-ink">
                  📢 Open Announcements
                </p>
                <p className="mt-0.5 text-[11.5px] text-ink-muted">
                  Review and manage
                </p>
              </GlassCard>
              <GlassCard
                variant="cream"
                padding="p-4"
                onClick={() => push("debate")}
              >
                <p className="font-serif text-[14px] font-semibold text-ink">
                  💬 Open Debates
                </p>
                <p className="mt-0.5 text-[11.5px] text-ink-muted">
                  Moderate discussions
                </p>
              </GlassCard>
            </div>
          )}
        </div>
      )}

      <div className="mt-6">
        <OrnamentDivider />
      </div>
    </Overlay>
  );
}