"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { todayISO } from "@/lib/utils";
import { TasbeehSkeleton } from "@/components/skeletons/TasbeehSkeleton";
import { AmbientGlow } from "../ui/Theme";

interface DhikrPreset {
  key: string;
  label: string;
  arabic: string;
  meaning: string;
  defaultTarget: number;
  color: string;
  colorLight: string;
  colorDark: string;
}

const [booting, setBooting] = useState(true);
useEffect(() => {
  // Wait for session + initial counts load
  const t = setTimeout(() => setBooting(false), 400);
  return () => clearTimeout(t);
}, []);

const DHIKR_PRESETS: DhikrPreset[] = [
  { key: "allahuakbar", label: "Allahu Akbar", arabic: "اللَّهُ أَكْبَر", meaning: "Allah is the Greatest", defaultTarget: 34, color: "#b87333", colorLight: "#e8b077", colorDark: "#7a4a1e" },
  { key: "salawat", label: "Durood-e-Ibrahimi", arabic: "اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّد", meaning: "Blessings upon the Prophet ﷺ", defaultTarget: 100, color: "#c9a45d", colorLight: "#e8d4a0", colorDark: "#8a6b15" },
  { key: "subhanallah", label: "SubhanAllah", arabic: "سُبْحَانَ اللَّهِ", meaning: "Glory be to Allah", defaultTarget: 33, color: "#2f6350", colorLight: "#7bb194", colorDark: "#1a3d30" },
  { key: "alhamdulillah", label: "Alhamdulillah", arabic: "الْحَمْدُ لِلَّهِ", meaning: "All praise is for Allah", defaultTarget: 33, color: "#1c4a3a", colorLight: "#5e9378", colorDark: "#0f2a20" },
  { key: "lailaha", label: "La ilaha illallah", arabic: "لَا إِلَٰهَ إِلَّا ٱللَّٰهُ", meaning: "There is no god but Allah", defaultTarget: 100, color: "#4b7a9c", colorLight: "#8fb3cf", colorDark: "#2a4a63" },
  { key: "astaghfirullah", label: "Astaghfirullah", arabic: "أَسْتَغْفِرُ اللَّهَ", meaning: "I seek Allah's forgiveness", defaultTarget: 100, color: "#7a6b9b", colorLight: "#b6a9d1", colorDark: "#4a4063" },
  { key: "lahawla", label: "La hawla wa la quwwata", arabic: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ", meaning: "No power except with Allah", defaultTarget: 100, color: "#a8855c", colorLight: "#d3b48d", colorDark: "#6b5433" },
  { key: "subhanallah-wa-bihamdihi", label: "SubhanAllahi wa bihamdihi", arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", meaning: "Glory and praise to Allah", defaultTarget: 100, color: "#2f6350", colorLight: "#7bb194", colorDark: "#1a3d30" },
  { key: "subhanallahil-azeem", label: "SubhanAllahil Azeem", arabic: "سُبْحَانَ اللَّهِ الْعَظِيمِ", meaning: "Glory to Allah, the Magnificent", defaultTarget: 100, color: "#1c4a3a", colorLight: "#5e9378", colorDark: "#0f2a20" },
  { key: "hasbunallah", label: "HasbunAllah", arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ", meaning: "Allah is sufficient for us", defaultTarget: 100, color: "#4b7a9c", colorLight: "#8fb3cf", colorDark: "#2a4a63" },
  { key: "rabbana-atina", label: "Rabbana atina", arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً", meaning: "Our Lord, give us good in this world", defaultTarget: 100, color: "#7a6b9b", colorLight: "#b6a9d1", colorDark: "#4a4063" },
  { key: "ya-hayyu", label: "Ya Hayyu Ya Qayyum", arabic: "يَا حَيُّ يَا قَيُّومُ", meaning: "O Ever-Living, O Sustainer", defaultTarget: 100, color: "#b87333", colorLight: "#e8b077", colorDark: "#7a4a1e" },
];

/* Animated number — digit-by-digit slide */
function AnimatedCounter({ value, color }: { value: number; color: string }) {
  const display = String(value).padStart(2, "0");
  const digits = display.split("");
  if (booting) return <TasbeehSkeleton />;
  return (
    <div className="flex items-center justify-center">
      {digits.map((d, i) => (
        <div
          key={i}
          className="relative overflow-hidden"
          style={{ height: "clamp(60px, 16vw, 96px)", width: "clamp(40px, 10vw, 60px)" }}
        >
          <div
            className="absolute inset-0 flex flex-col transition-transform duration-300"
            style={{
              transform: `translateY(-${parseInt(d, 10) * 10}%)`,
              transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
              height: "1000%",
            }}
          >
            {Array.from({ length: 10 }).map((_, n) => (
              <div
                key={n}
                className="flex items-center justify-center font-serif font-bold tabular-nums"
                style={{ height: "10%", color, fontSize: "clamp(56px, 15vw, 90px)" }}
              >
                {n}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* Bead ring around the digital counter */
function BeadRing({ count, target, color, colorLight, colorDark }: {
  count: number;
  target: number;
  color: string;
  colorLight: string;
  colorDark: string;
}) {
  const size = 300;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 135;
  const beadCount = 32;
  const litRatio = count / Math.max(target, 1);
  const litCount = Math.round(litRatio * beadCount);

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="absolute inset-0 h-full w-full pointer-events-none">
      <defs>
        <radialGradient id="beadLit" cx="35%" cy="30%">
          <stop offset="0%" stopColor={colorLight} />
          <stop offset="55%" stopColor={color} />
          <stop offset="100%" stopColor={colorDark} />
        </radialGradient>
        <radialGradient id="beadDim" cx="35%" cy="30%">
          <stop offset="0%" stopColor="#f5efe2" />
          <stop offset="55%" stopColor="#d4cbb4" />
          <stop offset="100%" stopColor="#a89d85" />
        </radialGradient>
      </defs>
      {Array.from({ length: beadCount }).map((_, i) => {
        const angle = (i / beadCount) * Math.PI * 2 - Math.PI / 2;
        const bx = cx + Math.cos(angle) * radius;
        const by = cy + Math.sin(angle) * radius;
        const lit = i < litCount;
        return (
          <circle
            key={i}
            cx={bx}
            cy={by}
            r={i === litCount - 1 ? 8 : 6}
            fill={lit ? "url(#beadLit)" : "url(#beadDim)"}
            style={{
              transition: "fill 400ms ease-out, r 300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
              filter: i === litCount - 1 ? `drop-shadow(0 0 8px ${color})` : "none",
            }}
          />
        );
      })}
    </svg>
  );
}

export function TasbeehTab() {
  const { data: session } = useSession();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [targets, setTargets] = useState<Record<string, number>>({});
  const [rounds, setRounds] = useState<Record<string, number>>({});
  const [activeKey, setActiveKey] = useState<string>("allahuakbar");
  const [showPicker, setShowPicker] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [roundFlash, setRoundFlash] = useState(false);
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  const userId = (session?.user as { id?: string } | undefined)?.id || "";
  const activePreset =
    DHIKR_PRESETS.find((d) => d.key === activeKey) ?? DHIKR_PRESETS[0];
  const theme = {
    color: activePreset.color,
    light: activePreset.colorLight,
    dark: activePreset.colorDark,
  };

  useEffect(() => {
    const t: Record<string, number> = {};
    DHIKR_PRESETS.forEach((d) => {
      t[d.key] = d.defaultTarget;
    });
    setTargets(t);
  }, []);

  useEffect(() => {
    if (!userId) return;
    fetch(`/api/tasbeeh?userId=${userId}&date=${todayISO()}`)
      .then((r) => r.json())
      .then((d) => setCounts(d?.counts || {}))
      .catch(() => {});
  }, [userId]);

  const scheduleSave = useCallback(
    (newCounts: Record<string, number>) => {
      if (!userId) return;
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
      saveTimeout.current = setTimeout(() => {
        fetch("/api/tasbeeh", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, date: todayISO(), counts: newCounts }),
        }).catch(() => {});
      }, 800);
    },
    [userId]
  );

  function tap() {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(12);
      } catch {}
    }

    // pulse
    setPulse(true);
    setTimeout(() => setPulse(false), 300);

    const target = targets[activeKey] ?? activePreset.defaultTarget;
    const current = counts[activeKey] ?? 0;
    const next = current + 1;
    const newCounts = { ...counts, [activeKey]: next };
    setCounts(newCounts);

    if (next % target === 0) {
      // round complete
      setRounds((prev) => ({
        ...prev,
        [activeKey]: (prev[activeKey] ?? 0) + 1,
      }));
      setRoundFlash(true);
      setTimeout(() => setRoundFlash(false), 1600);
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        try {
          navigator.vibrate([30, 50, 30]);
        } catch {}
      }
    }

    scheduleSave(newCounts);
  }

  function setTarget(v: number) {
    const clamped = Math.min(9999, Math.max(1, Math.floor(v)));
    setTargets((prev) => ({ ...prev, [activeKey]: clamped }));
  }

  function reset() {
    const newCounts = { ...counts, [activeKey]: 0 };
    setCounts(newCounts);
    setRounds((prev) => ({ ...prev, [activeKey]: 0 }));
    scheduleSave(newCounts);
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(20);
      } catch {}
    }
  }

  const activeCount = counts[activeKey] ?? 0;
  const activeTarget = targets[activeKey] ?? activePreset.defaultTarget;
  const activeRound = rounds[activeKey] ?? 0;
  const countInRound = activeCount % activeTarget;

  return (
    <div className="relative min-h-dvh bg-canvas pb-32">
      <AmbientGlow
        color="emerald"
        size={400}
        style={{ top: -120, left: -80, opacity: 0.3 }}
      />

      {/* Top bar */}
      <div className="relative flex items-center justify-between px-4 pt-6 pb-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-ink-muted">
          Tasbeeh
        </p>
        <button
          type="button"
          onClick={reset}
          className="grid h-8 w-8 place-items-center rounded-full bg-white/70 text-ink-muted ring-1 ring-white/70"
          aria-label="Reset"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          </svg>
        </button>
      </div>

      {/* Dhikr name + picker */}
      <div className="relative mx-4 mb-3">
        <button
          type="button"
          onClick={() => setShowPicker(true)}
          className="flex w-full items-center justify-center gap-2"
        >
          <p className="text-center font-serif text-[22px] font-bold text-ink">
            {activePreset.label}
          </p>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-ink-muted"
          >
            <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z" />
          </svg>
        </button>
        <p
          dir="rtl"
          className="mt-1 text-center font-arabic text-[16px] text-ink-muted"
        >
          {activePreset.arabic}
        </p>
      </div>

      {/* Counter / bead ring */}
      <div className="relative mx-auto mb-4 h-[320px] w-[320px]">
        {/* Glow pulse */}
        <div
          className="pointer-events-none absolute inset-0 rounded-full transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle, ${theme.color}44 0%, transparent 60%)`,
            opacity: pulse ? 1 : 0.15,
            transitionProperty: "opacity",
          }}
        />

        {/* Beads */}
        <BeadRing
          count={countInRound}
          target={activeTarget}
          color={theme.color}
          colorLight={theme.light}
          colorDark={theme.dark}
        />

        {/* Center tap area */}
        <button
          type="button"
          onClick={tap}
          aria-label={`Count ${activePreset.label}`}
          className="absolute inset-[55px] grid place-items-center rounded-full transition-transform active:scale-[0.96]"
          style={{
            background: `radial-gradient(circle at 35% 30%, ${theme.light} 0%, ${theme.color} 45%, ${theme.dark} 100%)`,
            boxShadow: `
              inset -6px -6px 14px rgba(0,0,0,0.35),
              inset 6px 6px 14px rgba(255,255,255,0.25),
              0 20px 40px -12px ${theme.color}88
            `,
            transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          <div className="flex flex-col items-center">
            <AnimatedCounter value={countInRound} color="#ffffff" />
            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.24em] text-white/70">
              of {activeTarget}
            </p>
            {activeRound > 0 && (
              <p
                className="mt-1 text-[9px] font-bold uppercase tracking-[0.18em] text-white/60"
                style={{
                  transition: "opacity 300ms",
                  opacity: roundFlash ? 1 : 0.6,
                }}
              >
                Round {String(activeRound).padStart(2, "0")}
              </p>
            )}
          </div>
        </button>

        {/* Round flash badge */}
        {roundFlash && (
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="rounded-full bg-white/30 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur animate-pulse">
              ✦ Round Complete
            </div>
          </div>
        )}
      </div>

      {/* Target controls */}
      <div className="relative mx-4 mb-6">
        <div className="flex items-center justify-center gap-2">
          {[33, 100].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setTarget(t);
                setShowCustom(false);
              }}
              className="rounded-full px-4 py-1.5 text-[12px] font-bold transition-all"
              style={{
                background:
                  activeTarget === t ? theme.color : "rgba(255,255,255,0.7)",
                color: activeTarget === t ? "#fff" : "#6c746e",
                boxShadow:
                  activeTarget === t ? `0 4px 12px -4px ${theme.color}88` : "none",
              }}
            >
              {t}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              if (showCustom) setShowCustom(false);
              else {
                setShowCustom(true);
                setCustomInput(String(activeTarget));
              }
            }}
            className="rounded-full px-4 py-1.5 text-[12px] font-bold transition-all"
            style={{
              background:
                showCustom || ![33, 100].includes(activeTarget)
                  ? theme.color
                  : "rgba(255,255,255,0.7)",
              color:
                showCustom || ![33, 100].includes(activeTarget)
                  ? "#fff"
                  : "#6c746e",
            }}
          >
            Custom
          </button>
        </div>

        {showCustom && (
          <div className="mt-3 flex items-center justify-center gap-2">
            <input
              type="number"
              min={1}
              max={9999}
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const n = parseInt(customInput, 10);
                  if (!isNaN(n)) {
                    setTarget(n);
                    setShowCustom(false);
                  }
                }
              }}
              className="w-24 rounded-full bg-white/90 px-3 py-1.5 text-center font-serif text-[14px] font-semibold tabular-nums text-ink outline-none ring-1 ring-divider/50 focus:ring-forest/40"
              autoFocus
            />
            <button
              type="button"
              onClick={() => {
                const n = parseInt(customInput, 10);
                if (!isNaN(n)) {
                  setTarget(n);
                  setShowCustom(false);
                }
              }}
              className="rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-white"
              style={{ background: theme.color }}
            >
              Set
            </button>
          </div>
        )}
      </div>

      {/* Dhikr picker modal */}
      {showPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
          <div className="max-h-[85vh] w-full max-w-[430px] overflow-y-auto rounded-[28px] bg-canvas p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-[18px] font-bold text-ink">
                Choose Dhikr
              </h2>
              <button
                type="button"
                onClick={() => setShowPicker(false)}
                className="text-[22px] leading-none text-ink-muted"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {DHIKR_PRESETS.map((d) => (
                <button
                  key={d.key}
                  type="button"
                  onClick={() => {
                    setActiveKey(d.key);
                    setShowPicker(false);
                  }}
                  className="relative flex aspect-square flex-col items-center justify-center rounded-[20px] p-3 text-center transition active:scale-[0.97]"
                  style={{
                    background:
                      activeKey === d.key
                        ? `linear-gradient(135deg, ${d.color} 0%, ${d.colorDark} 100%)`
                        : "linear-gradient(135deg, #fbf9f4 0%, #f1ede3 100%)",
                    boxShadow:
                      activeKey === d.key
                        ? `0 12px 24px -8px ${d.color}88`
                        : "0 6px 14px -8px rgba(28,52,42,0.3)",
                  }}
                >
                  <p
                    dir="rtl"
                    className="font-arabic leading-tight"
                    style={{
                      fontSize: 22,
                      color: activeKey === d.key ? "#fff" : d.color,
                    }}
                  >
                    {d.arabic}
                  </p>
                  <p
                    className="mt-2 line-clamp-2 font-serif text-[12px] font-semibold leading-tight"
                    style={{
                      color: activeKey === d.key ? "#fff" : "#17261f",
                    }}
                  >
                    {d.label}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
