"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { todayISO } from "@/lib/utils";
import { AmbientGlow, Kicker } from "../ui/Theme";

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

function DigitalTasbeeh({
  count,
  target,
  color,
  colorLight,
  colorDark,
  flicker,
  onTap,
}: {
  count: number;
  target: number;
  color: string;
  colorLight: string;
  colorDark: string;
  flicker: boolean;
  onTap: () => void;
}) {
  const display = String(Math.min(count, 9999)).padStart(4, "0");
  const flickerDisplay = "8888";

  const size = 320;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = 148;
  const beadR = 10;
  const beadCount = 32;

  return (
    <button
      type="button"
      onClick={onTap}
      aria-label={`Digital tasbeeh. ${count} of ${target}. Tap to increment.`}
      className="relative mx-auto block w-full max-w-[380px] transition-transform active:scale-[0.98]"
      style={{ touchAction: "manipulation" }}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="h-auto w-full"
        style={{ filter: "drop-shadow(0 20px 40px rgba(28,52,42,0.35))" }}
      >
        <defs>
          <radialGradient id="ringGradient" cx="35%" cy="25%">
            <stop offset="0%" stopColor="#fdfaf1" />
            <stop offset="50%" stopColor="#ece5d3" />
            <stop offset="100%" stopColor="#c8bda3" />
          </radialGradient>

          <radialGradient id="beadOn" cx="35%" cy="30%">
            <stop offset="0%" stopColor={colorLight} />
            <stop offset="55%" stopColor={color} />
            <stop offset="100%" stopColor={colorDark} />
          </radialGradient>

          <radialGradient id="beadOff" cx="35%" cy="30%">
            <stop offset="0%" stopColor="#f5efe2" />
            <stop offset="55%" stopColor="#d4cbb4" />
            <stop offset="100%" stopColor="#a89d85" />
          </radialGradient>

          <radialGradient id="lcdGradient" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#2a3a2e" />
            <stop offset="100%" stopColor="#0f1a12" />
          </radialGradient>

          <linearGradient id="lcdGloss" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>

        <ellipse
          cx={cx}
          cy={cy + 6}
          rx={outerR + 8}
          ry={outerR + 8}
          fill="rgba(28,52,42,0.18)"
        />

        <circle cx={cx} cy={cy} r={outerR + 4} fill="url(#ringGradient)" />

        <circle
          cx={cx}
          cy={cy}
          r={outerR + 4}
          fill="none"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="2"
          opacity="0.6"
        />
        <circle
          cx={cx}
          cy={cy}
          r={outerR}
          fill="none"
          stroke="rgba(0,0,0,0.1)"
          strokeWidth="1.5"
        />

        {Array.from({ length: beadCount }).map((_, i) => {
          const angle = (i / beadCount) * Math.PI * 2 - Math.PI / 2;
          const bx = cx + Math.cos(angle) * (outerR - 22);
          const by = cy + Math.sin(angle) * (outerR - 22);
          const lit = i < Math.round((count / Math.max(target, 1)) * beadCount);

          return (
            <circle
              key={i}
              cx={bx}
              cy={by}
              r={beadR}
              fill={lit ? "url(#beadOn)" : "url(#beadOff)"}
              style={{
                filter: lit
                  ? `drop-shadow(0 0 4px ${color}88)`
                  : "drop-shadow(0 1px 2px rgba(0,0,0,0.2))",
                transition: "fill 300ms",
              }}
            />
          );
        })}

        <circle cx={cx} cy={cy} r={outerR - 40} fill="#efe9dc" />

        <rect
          x={cx - 95}
          y={cy - 42}
          width={190}
          height={84}
          rx={10}
          ry={10}
          fill="url(#lcdGradient)"
          stroke="#0a0a0a"
          strokeWidth="3"
        />

        <rect
          x={cx - 95}
          y={cy - 42}
          width={190}
          height={42}
          rx={10}
          ry={10}
          fill="url(#lcdGloss)"
          pointerEvents="none"
        />

        <text
          x={cx}
          y={cy + 20}
          textAnchor="middle"
          fontFamily="'Courier New', 'Consolas', monospace"
          fontSize="52"
          fontWeight="900"
          letterSpacing="6"
          fill={flicker ? "#2a3a2e" : "#7dd87d"}
          style={{
            textShadow: flicker
              ? "none"
              : "0 0 8px rgba(125,216,125,0.6), 0 0 14px rgba(125,216,125,0.3)",
            transition: "fill 80ms",
          }}
        >
          {flicker ? flickerDisplay : display}
        </text>

        <rect
          x={cx - 95}
          y={cy - 42}
          width={190}
          height={84}
          rx={10}
          ry={10}
          fill="none"
          stroke="rgba(125,216,125,0.15)"
          strokeWidth="1"
          pointerEvents="none"
        />

        <text
          x={cx}
          y={cy + 78}
          textAnchor="middle"
          fontFamily="system-ui, sans-serif"
          fontSize="9"
          fontWeight="700"
          letterSpacing="3"
          fill="rgba(28,52,42,0.45)"
        >
          TASBEEH
        </text>

        <circle
          cx={cx}
          cy={cy + 6}
          r={4}
          fill={flicker ? color : colorLight}
          style={{ transition: "fill 80ms" }}
        />
      </svg>
    </button>
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
  const [flicker, setFlicker] = useState(false);
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
        navigator.vibrate(15);
      } catch {}
    }
    setFlicker(true);
    setTimeout(() => setFlicker(false), 70);

    const target = targets[activeKey] ?? activePreset.defaultTarget;
    const current = counts[activeKey] ?? 0;
    const next = current + 1;
    const newCounts = { ...counts, [activeKey]: next };
    setCounts(newCounts);

    if (next % target === 0) {
      setRounds((prev) => ({
        ...prev,
        [activeKey]: (prev[activeKey] ?? 0) + 1,
      }));
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

      <div className="relative flex items-center justify-between px-4 pt-6 pb-2">
        <Kicker>Tashbih</Kicker>
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

      <div className="relative mx-4 mb-4 rounded-[20px] bg-white/85 p-4 ring-1 ring-white/70 shadow-[0_10px_22px_-14px_rgba(28,52,42,0.4)]">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-muted">
          Dhikr
        </p>
        <button
          type="button"
          onClick={() => setShowPicker(true)}
          className="mt-1 flex w-full items-center gap-2"
        >
          <p className="truncate font-serif text-[18px] font-bold text-ink">
            {activePreset.label}
          </p>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0 text-ink-muted"
          >
            <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z" />
          </svg>
        </button>

        <div className="mt-3 flex items-center gap-2">
          <div
            className="h-6 w-6 grid place-items-center rounded-full"
            style={{ background: theme.color }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2.5"
            >
              <circle cx="12" cy="12" r="6" />
            </svg>
          </div>
          <p className="font-serif text-[16px] font-bold text-ink">
            {countInRound}
          </p>
          <p className="text-[12px] text-ink-muted">/ {activeTarget}</p>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-[11px] text-ink-muted">
            Round {String(activeRound).padStart(2, "0")} · Total {activeCount}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowCustom(!showCustom)}
              className="text-[10px] font-bold uppercase tracking-[0.12em] text-forest"
            >
              Target
            </button>
            <button
              type="button"
              onClick={reset}
              className="text-[10px] font-bold uppercase tracking-[0.12em] text-forest"
            >
              Reset
            </button>
          </div>
        </div>

        {showCustom && (
          <div className="mt-3 flex items-center gap-2">
            {[33, 100].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setTarget(t);
                  setShowCustom(false);
                }}
                className="rounded-full px-3 py-1 text-[11px] font-bold"
                style={{
                  background:
                    activeTarget === t ? theme.color : "rgba(0,0,0,0.05)",
                  color: activeTarget === t ? "#fff" : "#6c746e",
                }}
              >
                {t}
              </button>
            ))}
            <input
              type="number"
              min={1}
              max={9999}
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Custom"
              className="w-20 rounded-full bg-white/90 px-3 py-1 text-center text-[11px] font-bold text-ink outline-none ring-1 ring-divider/50"
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
              className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white"
              style={{ background: theme.color }}
            >
              Set
            </button>
          </div>
        )}
      </div>

      <div className="mx-4 mb-6">
        <DigitalTasbeeh
          count={countInRound}
          target={activeTarget}
          color={theme.color}
          colorLight={theme.light}
          colorDark={theme.dark}
          flicker={flicker}
          onTap={tap}
        />
      </div>

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