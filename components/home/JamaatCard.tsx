"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { assets } from "@/lib/design/assets";
import type { JamaatInfo } from "@/lib/home/types";
import { useAppStore } from "@/lib/store";

function formatCountdown(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(sec)}`;
}

function progress(startIso: string, endIso: string, now: number): number {
  const start = new Date(startIso).getTime();
  const end = new Date(endIso).getTime();
  if (!(end > start)) return 0;
  return Math.min(1, Math.max(0, (now - start) / (end - start)));
}

/* ── Skeleton shimmer ─────────────────────────────────── */
function SkeletonBlock({
  width,
  height,
  radius = 8,
}: {
  width: string | number;
  height: number;
  radius?: number;
}) {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        width,
        height,
        borderRadius: radius,
        background:
          "linear-gradient(90deg, #efe9dd 0%, #f7f2e8 50%, #efe9dd 100%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.6s linear infinite",
      }}
    >
      <style>{`
        @keyframes shimmer {
          0% { background-position: -100% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}

function SkeletonCard() {
  return (
    <section className="relative h-[200px] overflow-hidden rounded-[28px] bg-card shadow-[0_14px_36px_-14px_rgba(23,75,59,0.35)] ring-1 ring-divider/60">
      {/* Photo skeleton — right */}
      <div className="absolute inset-y-0 right-0 w-[42%]">
        <SkeletonBlock width="100%" height={200} radius={0} />
        <div className="absolute inset-y-0 left-0 w-[35%] bg-gradient-to-r from-card via-card/60 to-transparent" />
      </div>

      <div className="relative p-6 pr-[42%]">
        <SkeletonBlock width={90} height={10} radius={4} />
        <div className="mt-3">
          <SkeletonBlock width={180} height={38} radius={10} />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4">
          <div>
            <SkeletonBlock width={40} height={10} radius={3} />
            <div className="mt-2">
              <SkeletonBlock width={80} height={20} radius={5} />
            </div>
          </div>
          <div>
            <SkeletonBlock width={40} height={10} radius={3} />
            <div className="mt-2">
              <SkeletonBlock width={80} height={20} radius={5} />
            </div>
          </div>
        </div>

        <div className="mt-5 h-px w-full bg-divider" />

        <div className="mt-4">
          <SkeletonBlock width={140} height={14} radius={4} />
        </div>
      </div>
    </section>
  );
}

export function JamaatCard({
  jamaat,
  loading = false,
}: {
  jamaat: JamaatInfo | null;
  loading?: boolean;
}) {
  const [now, setNow] = useState(() => Date.now());
  const pushScreen = useAppStore((s) => s.pushScreen);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Skeleton while data is loading
  if (loading) {
    return <SkeletonCard />;
  }

  if (!jamaat) {
    return (
      <section className="relative rounded-[28px] bg-card p-6 shadow-sm ring-1 ring-divider/60">
        <button
          type="button"
          onClick={() => pushScreen("edit-times")}
          className="absolute right-4 top-4 z-20 flex items-center gap-1 rounded-full px-2 py-1 text-[8px] font-black uppercase tracking-[0.14em] text-white shadow-md transition active:scale-95"
          style={{ background: "#c9a45d" }}
          aria-label="Change prayer times"
        >
          <svg
            className="ic"
            style={{ width: 9, height: 9 }}
            aria-hidden="true"
          >
            <use href="#i-clock" />
          </svg>
          Change
        </button>
        <p className="text-[11px] tracking-[0.18em] text-ink-muted">
          NEXT JAMAAT
        </p>
        <p className="mt-2 font-serif text-3xl text-forest">
          Timings unavailable
        </p>
        <p className="mt-1 text-sm text-ink-muted">
          Please check with the mosque committee.
        </p>
      </section>
    );
  }

  const remaining = new Date(jamaat.jamaatIso).getTime() - now;
  const p = progress(jamaat.windowStartIso, jamaat.jamaatIso, now);

  return (
    <div className="relative">
      <section className="relative h-[200px] overflow-hidden rounded-[28px] bg-card shadow-[0_14px_36px_-14px_rgba(23,75,59,0.35)] ring-1 ring-divider/60">
        <div className="absolute inset-y-0 right-0 w-[42%]">
          <Image
            src={assets.jamaatArch}
            alt=""
            fill
            sizes="180px"
            className="object-cover"
            style={{ objectPosition: "center" }}
          />
          <div className="absolute inset-y-0 left-0 w-[35%] bg-gradient-to-r from-card via-card/60 to-transparent" />
        </div>

        <div className="relative p-6 pr-[42%]">
          <p className="text-[11px] tracking-[0.18em] text-ink-muted">
            NEXT JAMAAT
          </p>

          <h2 className="mt-1 font-serif text-[40px] leading-none text-forest">
            {jamaat.title}
          </h2>

          <div className="mt-5 grid grid-cols-2 gap-4">
            <Info label="Azaan" value={jamaat.azaanDisplay} />
            <Info label="Jamaat" value={jamaat.jamaatDisplay} />
          </div>

          <div className="mt-5 h-px w-full bg-divider" />

          <div className="mt-4 flex items-center gap-2 text-[12px] text-ink-muted">
            <span>Starts in</span>
            <span className="font-semibold tabular-nums text-forest">
              {formatCountdown(remaining)}
            </span>
          </div>

          {p > 0 && p < 1 && (
            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-divider">
              <div
                className="h-full bg-forest"
                style={{ width: `${p * 100}%` }}
              />
            </div>
          )}
        </div>
      </section>

      <button
        type="button"
        onClick={() => pushScreen("edit-times")}
        className="absolute right-4 top-4 z-50 flex items-center gap-1 rounded-full px-2 py-1 text-[8px] font-black uppercase tracking-[0.14em] text-white shadow-md transition active:scale-95"
        style={{ background: "#c9a45d" }}
        aria-label="Change prayer times"
      >
        <svg
          className="ic"
          style={{ width: 9, height: 9 }}
          aria-hidden="true"
        >
          <use href="#i-clock" />
        </svg>
        Change
      </button>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] text-ink-muted">{label}</p>
      <p className="text-[16px] font-semibold tabular-nums text-forest">
        {value || "—"}
      </p>
    </div>
  );
}