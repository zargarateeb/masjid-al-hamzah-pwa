"use client";
import { useEffect, useRef, useState } from "react";
import Overlay, {
  Star8,
  OrnamentDivider,
  CornerFlourish,
} from "../ui/Theme";
import { NAMES_OF_ALLAH } from "@/lib/data/namesOfAllah";

const PALETTE = [
  { name: "Gold", accent: "#C9A45D", dark: "#8a6b15", tint: "#fdf6e3" },
  { name: "Forest", accent: "#2f6350", dark: "#1a3d30", tint: "#f0f7f2" },
  { name: "Purple", accent: "#7a6b9b", dark: "#4a4063", tint: "#f5f0fa" },
  { name: "Blue", accent: "#4b7a9c", dark: "#2a4a63", tint: "#eef4f9" },
  { name: "Copper", accent: "#b87333", dark: "#7a4a1e", tint: "#fbf3ea" },
  { name: "Rose", accent: "#a85c6e", dark: "#6b3542", tint: "#faf0f2" },
];

export function NamesOfAllahOverlay() {
  const [i, setI] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, mx: 50, my: 50 });
  const cardRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const n = NAMES_OF_ALLAH[i];
  const total = NAMES_OF_ALLAH.length;
  const pal = PALETTE[i % PALETTE.length];

  const go = (delta: number) => {
    setI((v) => (v + delta + total) % total);
    setAnimKey((k) => k + 1);
  };

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  });

  function onPointerMove(e: React.PointerEvent) {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = x / rect.width; // 0-1
    const py = y / rect.height;
    // Tilt: horizontal movement → ry (rotate Y), vertical → rx (rotate X)
    const ry = (px - 0.5) * 20; // -10 to +10 degrees
    const rx = (0.5 - py) * 20;
    setTilt({ rx, ry, mx: px * 100, my: py * 100 });
  }

  function onPointerLeave() {
    setTilt({ rx: 0, ry: 0, mx: 50, my: 50 });
  }

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;
    if (x < 0 || x > rect.width || y < 0 || y > rect.height) return;
    const px = x / rect.width;
    const py = y / rect.height;
    setTilt({
      rx: (0.5 - py) * 20,
      ry: (px - 0.5) * 20,
      mx: px * 100,
      my: py * 100,
    });
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    setTilt({ rx: 0, ry: 0, mx: 50, my: 50 });
    const startX = touchStartX.current;
    const startY = touchStartY.current;
    if (startX == null || startY == null) return;
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      go(dx < 0 ? 1 : -1);
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <Overlay title="Asmā ul-Husnā">
      <style>{`
        @keyframes nameFade {
          0% { opacity: 0; transform: scale(0.96) translateY(8px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span
            className="font-serif text-[26px] font-bold leading-none transition-colors duration-500"
            style={{ color: pal.dark }}
          >
            {i + 1}
          </span>
          <span className="text-[12px] text-ink-muted">/ {total}</span>
        </div>
        <button
          type="button"
          onClick={() => {
            setI(Math.floor(Math.random() * total));
            setAnimKey((k) => k + 1);
          }}
          className="rounded-full bg-white/70 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] ring-1 ring-white/70 transition-colors duration-500"
          style={{ color: pal.dark }}
        >
          ✦ Surprise me
        </button>
      </div>

      <div className="mb-5 h-1 w-full overflow-hidden rounded-full bg-divider/40">
        <div
          className="h-full transition-all duration-500"
          style={{
            width: `${((i + 1) / total) * 100}%`,
            background: `linear-gradient(90deg, ${pal.accent}, ${pal.dark})`,
          }}
        />
      </div>

      {/* 3D tilt wrapper with perspective */}
      <div
        className="relative"
        style={{
          perspective: "1000px",
          transformStyle: "preserve-3d",
        }}
      >
        <div
          ref={cardRef}
          key={animKey}
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          className="relative overflow-hidden rounded-[28px] ring-1 ring-white/70 shadow-[0_25px_50px_-15px_rgba(28,52,42,0.45)]"
          style={{
            background: `linear-gradient(160deg, ${pal.tint} 0%, #fbf9f4 60%, ${pal.tint} 100%)`,
            animation: "nameFade 400ms cubic-bezier(0.22, 1, 0.36, 1)",
            transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
            transformStyle: "preserve-3d",
            transition:
              "transform 200ms cubic-bezier(0.22, 1, 0.36, 1), background 500ms",
            willChange: "transform",
          }}
        >
          {/* Specular highlight — follows pointer */}
          <div
            className="pointer-events-none absolute inset-0 z-20"
            aria-hidden="true"
            style={{
              background: `radial-gradient(circle at ${tilt.mx}% ${tilt.my}%, rgba(255,255,255,0.35) 0%, transparent 45%)`,
              transition: "background 80ms",
              mixBlendMode: "overlay",
            }}
          />

          {/* Deep shadow that shifts opposite the tilt */}
          <div
            className="pointer-events-none absolute inset-0 z-10"
            aria-hidden="true"
            style={{
              background: `linear-gradient(135deg, transparent 40%, ${pal.dark}15 100%)`,
            }}
          />

          <CornerFlourish
            className="absolute left-3 top-3"
            size={36}
            color={pal.accent}
          />
          <CornerFlourish
            className="absolute right-3 top-3 -scale-x-100"
            size={36}
            color={pal.accent}
          />
          <CornerFlourish
            className="absolute bottom-3 left-3 -scale-y-100"
            size={36}
            color={pal.accent}
          />
          <CornerFlourish
            className="absolute bottom-3 right-3 -scale-100"
            size={36}
            color={pal.accent}
          />

          {/* Floating giant number — pops off the card */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-serif font-bold leading-none"
            style={{
              fontSize: 260,
              color: `${pal.accent}10`,
              transform: "translate3d(0, 0, 20px)",
              transition: "color 500ms",
            }}
          >
            {n.id}
          </div>

          <div
            className="relative px-8 py-14 text-center"
            style={{ transform: "translate3d(0, 0, 40px)" }}
          >
            <div className="mb-6 flex justify-center">
              <Star8 size={20} color={pal.accent} className="animate-pulse" />
            </div>

            <div
              dir="rtl"
              className="font-arabic leading-none transition-colors duration-500"
              style={{
                fontSize: 68,
                letterSpacing: "-0.01em",
                color: pal.dark,
                textShadow: `0 4px 16px ${pal.accent}40, 0 2px 4px rgba(0,0,0,0.1)`,
              }}
            >
              {n.arabic}
            </div>

            <div className="my-6 flex justify-center">
              <div
                className="h-px transition-all duration-500"
                style={{
                  width: 120,
                  background: `linear-gradient(90deg, transparent, ${pal.accent}cc, transparent)`,
                }}
              />
            </div>

            <p className="font-serif text-[24px] font-semibold tracking-[0.04em] text-ink">
              {n.transliteration}
            </p>

            <p className="mt-3 text-[14px] font-medium text-ink-muted">
              {n.english}
            </p>

            <p
              dir="rtl"
              className="mt-4 font-arabic leading-relaxed transition-colors duration-500"
              style={{ fontSize: 20, color: pal.dark }}
            >
              {n.urdu}
            </p>

            <div className="mt-6 flex justify-center">
              <Star8 size={14} color={pal.accent} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous"
          className="grid h-14 w-14 place-items-center rounded-full bg-white/70 ring-1 ring-white/70 transition active:scale-95"
          style={{ color: pal.dark }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink-muted">
          Swipe or tap
        </p>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next"
          className="grid h-14 w-14 place-items-center rounded-full bg-white/70 ring-1 ring-white/70 transition active:scale-95"
          style={{ color: pal.dark }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <div className="mt-6">
        <OrnamentDivider />
        <div className="mt-4 grid grid-cols-10 gap-1.5">
          {Array.from({ length: 10 }).map((_, ci) => {
            const start = ci * 10;
            const active = i >= start && i < start + 10;
            return (
              <button
                key={ci}
                type="button"
                onClick={() => {
                  setI(start);
                  setAnimKey((k) => k + 1);
                }}
                className="rounded-md py-1.5 text-[9px] font-bold transition"
                style={{
                  background: active ? pal.accent : "rgba(255,255,255,0.7)",
                  color: active ? "#fff" : "#6c746e",
                  boxShadow: active
                    ? "none"
                    : "inset 0 0 0 1px rgba(255,255,255,0.7)",
                }}
              >
                {start + 1}
              </button>
            );
          })}
        </div>
      </div>
    </Overlay>
  );
}