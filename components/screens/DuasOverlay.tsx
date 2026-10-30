"use client";
import { useAppStore } from "@/lib/store";
import { useEffect, useMemo, useState } from "react";
import { DUAS, DUA_CATEGORIES } from "@/lib/data/duas";
import { duaCategoryImage } from "@/lib/images";

function StarGlyph({ size = 14, color }: { size?: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2l2.4 6.9L21 12l-6.6 3.1L12 22l-2.4-6.9L3 12l6.6-3.1L12 2z"
        stroke={color}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function OrnamentDivider({ color = "rgba(28,74,58,0.25)" }: { color?: string }) {
  return (
    <div className="flex items-center gap-3" aria-hidden="true">
      <span className="h-px flex-1" style={{ background: color }} />
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 3l3 6 6 3-6 3-3 6-3-6-6-3 6-3 3-6z"
          stroke={color}
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
      <span className="h-px flex-1" style={{ background: color }} />
    </div>
  );
}

const CATEGORY_COLORS: Record<string, string> = {
  "Morning & Evening": "#C9A45D",
  "Eating & Drinking": "#6F9B7F",
  "Sleeping & Waking": "#4B7A9C",
  Travel: "#B87333",
  "Home & Masjid": "#5C8466",
  Protection: "#7A6B9B",
  Forgiveness: "#A85C6E",
  "Parents & Family": "#A8855C",
  "Anxiety & Sadness": "#5C7AA0",
  General: "#6F9B7F",
};

export default function DuasOverlay() {
  const popScreen = useAppStore((s) => s.popScreen);
  const lastSearchTarget = useAppStore((s) => s.lastSearchTarget);
  const setSearchTarget = useAppStore((s) => s.setSearchTarget);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Auto-open the exact dua if we came from search
  useEffect(() => {
    if (lastSearchTarget?.type === "dua") {
      const dua = DUAS.find((d) => d.id === lastSearchTarget.id);
      if (dua) {
        setOpenCategory(dua.category);
        setExpandedId(dua.id);
      }
      setSearchTarget(null);
    }
  }, [lastSearchTarget, setSearchTarget]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    DUAS.forEach((d) => {
      c[d.category] = (c[d.category] || 0) + 1;
    });
    return c;
  }, []);

  const categoryDuas = useMemo(
    () => (openCategory ? DUAS.filter((d) => d.category === openCategory) : []),
    [openCategory]
  );

  // ═══════════════════════════════════════════════════════
  //  LEVEL 2 — Reading view (one color, alive animations)
  // ═══════════════════════════════════════════════════════
  if (openCategory) {
    const color = CATEGORY_COLORS[openCategory] || "#6F9B7F";

    return (
      <div className="px-4 pt-4 pb-28">
        <style>{`
          @keyframes duaFadeIn {
            0% { opacity: 0; transform: translateY(12px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes badgePulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.08); }
          }
          @keyframes arabicGlow {
            0%, 100% { text-shadow: 0 1px 6px currentColor; }
            50% { text-shadow: 0 2px 14px currentColor, 0 0 24px currentColor; }
          }
          @keyframes stripFlow {
            0% { background-position: 0% 0%; }
            100% { background-position: 0% 200%; }
          }
        `}</style>

        <div className="mb-5 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setOpenCategory(null)}
            aria-label="Back to categories"
            className="grid h-10 w-10 place-items-center rounded-full bg-white/70 text-forest ring-1 ring-white/70"
          >
            <svg
              className="ic"
              style={{ transform: "rotate(180deg)" }}
              aria-hidden="true"
            >
              <use href="#i-chev" />
            </svg>
          </button>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
              Category
            </p>
            <h1 className="truncate font-serif text-[20px] font-bold text-ink">
              {openCategory}
            </h1>
          </div>
        </div>

        <div className="mb-4 flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: color }}
          />
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
            {categoryDuas.length} supplication
            {categoryDuas.length === 1 ? "" : "s"}
          </p>
        </div>

        <div className="space-y-4">
          {categoryDuas.map((d, idx) => {
            return (
              <div
                key={d.id}
                className="group relative overflow-hidden rounded-[22px] ring-1 ring-white/70 shadow-[0_18px_38px_-18px_rgba(28,52,42,0.38)] transition-transform duration-200 hover:scale-[1.005] active:scale-[0.995]"
                style={{
                  background: `linear-gradient(135deg, #fbf9f4 0%, ${color}06 100%)`,
                  animation: `duaFadeIn 450ms ease-out ${Math.min(
                    idx * 70,
                    500
                  )}ms both`,
                }}
              >
                {/* Flowing accent strip — vertical light traveling down */}
                <div
                  className="absolute inset-y-0 left-0 w-1.5 overflow-hidden"
                  aria-hidden="true"
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(180deg, ${color}22 0%, ${color} 40%, ${color} 60%, ${color}22 100%)`,
                      backgroundSize: "100% 200%",
                      animation: `stripFlow 6s linear ${idx * 150}ms infinite`,
                    }}
                  />
                </div>

                {/* Soft corner glow */}
                <div
                  className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full opacity-40"
                  aria-hidden="true"
                  style={{
                    background: `radial-gradient(circle, ${color}55 0%, transparent 70%)`,
                    filter: "blur(30px)",
                  }}
                />

                <div className="relative p-5 pl-6">
                  <div className="mb-3 flex items-center gap-3">
                    <span
                      className="grid h-8 min-w-8 place-items-center rounded-lg px-2 font-serif text-[13px] font-bold text-white shadow-sm"
                      style={{
                        background: `linear-gradient(145deg, ${color}, ${color}cc)`,
                        animation: `badgePulse 2.4s ease-in-out ${
                          idx * 120
                        }ms infinite`,
                      }}
                    >
                      {d.id}
                    </span>
                    <p className="font-serif text-[16px] font-semibold leading-tight text-ink">
                      {d.title}
                    </p>
                  </div>

                  <div
                    dir="rtl"
                    className="mb-4 text-right font-arabic leading-[2.1]"
                    style={{
                      fontSize: 24,
                      color: color,
                      animation: `arabicGlow 4s ease-in-out ${
                        idx * 200
                      }ms infinite`,
                    }}
                  >
                    {d.arabic}
                  </div>

                  <div
                    className="mb-3 h-px w-full"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${color}66, transparent)`,
                    }}
                  />

                  <p className="mb-2 text-[12.5px] italic leading-relaxed text-ink-muted">
                    {d.transliteration}
                  </p>

                  <p className="text-[13.5px] leading-relaxed text-[#3a4741]">
                    {d.english}
                  </p>

                  {d.reference && (
                    <div className="mt-3 flex items-center gap-2">
                      <StarGlyph size={10} color={color} />
                      <span
                        className="text-[10px] font-bold uppercase tracking-[0.12em]"
                        style={{ color: color }}
                      >
                        {d.reference}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* End-of-category flourish */}
        <div className="mt-8 flex flex-col items-center gap-2 text-center">
          <StarGlyph size={18} color={color} />
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink-muted">
            End of {openCategory}
          </p>
          <button
            type="button"
            onClick={() => setOpenCategory(null)}
            className="mt-2 rounded-full bg-white/70 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-forest ring-1 ring-white/70"
          >
            ← Back to categories
          </button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════
  //  LEVEL 1 — Category grid (full-bleed photo, glass pill)
  // ═══════════════════════════════════════════════════════
  return (
    <div className="px-4 pt-4 pb-28">
      <div className="mb-5 flex items-center gap-3">
        <button
          type="button"
          onClick={popScreen}
          aria-label="Back"
          className="grid h-10 w-10 place-items-center rounded-full bg-white/70 text-forest ring-1 ring-white/70"
        >
          <svg
            className="ic"
            style={{ transform: "rotate(180deg)" }}
            aria-hidden="true"
          >
            <use href="#i-chev" />
          </svg>
        </button>
        <h1 className="font-serif text-[24px] font-bold text-ink">Duas</h1>
      </div>

      <div className="mb-5 text-center">
        <div
          className="mx-auto grid h-14 w-14 place-items-center rounded-full"
          style={{
            background: "linear-gradient(135deg, #fbf9f4 0%, #f1ede3 100%)",
            boxShadow: "0 10px 22px -14px rgba(28,52,42,0.4)",
            border: "1px solid rgba(255,255,255,0.7)",
          }}
        >
          <StarGlyph size={20} color="#C9A45D" />
        </div>
        <p className="mt-3 font-serif text-[18px] font-semibold text-ink">
          {DUAS.length} Duas · {DUA_CATEGORIES.length} Categories
        </p>
        <p className="mt-1 text-[12px] text-ink-muted">
          Tap a category to open its supplications
        </p>
        <div className="mt-4">
          <OrnamentDivider />
        </div>
      </div>

      {/* Category grid — full-bleed photo, glass text pill */}
      <div className="grid grid-cols-2 gap-3.5">
        {DUA_CATEGORIES.map((cat) => {
          const count = counts[cat] || 0;
          const catColor = CATEGORY_COLORS[cat] || "#6F9B7F";
          const img = duaCategoryImage(cat);

          return (
            <button
              key={cat}
              type="button"
              onClick={() => setOpenCategory(cat)}
              className="relative h-[150px] overflow-hidden rounded-[24px] transition active:scale-[0.97]"
              style={{
                boxShadow: `
                  0 12px 24px -8px rgba(28, 52, 42, 0.32),
                  0 4px 8px -2px rgba(28, 52, 42, 0.15)
                `,
              }}
            >
              {/* Full-bleed photo */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  backgroundImage: `url(${img})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              />

              {/* Inner clay depth ring */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-[24px]"
                style={{
                  boxShadow: `
                    inset 0 2px 4px rgba(255, 255, 255, 0.35),
                    inset 0 -2px 6px rgba(0, 0, 0, 0.28)
                  `,
                }}
              />

              {/* Clay icon square — top-left */}
              <span
                className="absolute left-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-[14px]"
                style={{
                  background:
                    "linear-gradient(145deg, #fefcf7 0%, #ebe5d6 100%)",
                  color: catColor,
                  boxShadow: `
                    inset 2px 2px 5px rgba(255, 255, 255, 0.9),
                    inset -2px -2px 5px rgba(180, 170, 150, 0.25),
                    0 4px 8px -2px rgba(0, 0, 0, 0.35)
                  `,
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M12 21s-6-4-6-10a6 6 0 0 1 12 0c0 6-6 10-6 10z" />
                </svg>
              </span>

              {/* Glass-morphic text pill — bottom */}
              <div
                className="absolute bottom-3 left-3 right-3 z-10 overflow-hidden rounded-[14px] px-3 py-2"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(251,249,244,0.72) 0%, rgba(241,237,227,0.62) 100%)",
                  backdropFilter: "blur(14px) saturate(1.3)",
                  WebkitBackdropFilter: "blur(14px) saturate(1.3)",
                  boxShadow: `
                    inset 0 1px 0 rgba(255, 255, 255, 0.7),
                    inset 0 -1px 0 rgba(0, 0, 0, 0.08),
                    0 6px 14px -4px rgba(0, 0, 0, 0.4)
                  `,
                  border: "1px solid rgba(255,255,255,0.45)",
                }}
              >
                <p className="truncate font-serif text-[13px] font-semibold leading-tight text-ink">
                  {cat}
                </p>
                <p className="mt-0.5 truncate text-[9.5px] font-medium uppercase tracking-[0.12em] text-ink-muted">
                  {count} {count === 1 ? "Dua" : "Duas"}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        <OrnamentDivider />
      </div>
    </div>
  );
}