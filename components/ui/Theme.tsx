"use client";
import { useAppStore } from "@/lib/store";
import type { ReactNode } from "react";

/* ═══════════════════════════════════════════════════════
   Overlay — full-screen scroll container with back button
   ═══════════════════════════════════════════════════════ */
export function Overlay({
  title,
  children,
  hideBack = false,
}: {
  title?: string;
  children: ReactNode;
  hideBack?: boolean;
}) {
  const pop = useAppStore((s) => s.popScreen);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-canvas">
      <div className="mx-auto min-h-full max-w-[430px] pb-28">
        {!hideBack && (
          <div className="sticky top-0 z-10 flex items-center gap-3 bg-canvas/85 px-4 py-3 backdrop-blur-xl">
            <button
              type="button"
              onClick={pop}
              aria-label="Back"
              className="grid h-10 w-10 place-items-center rounded-full bg-white/70 text-forest ring-1 ring-white/70 transition active:scale-95"
            >
              <svg className="ic" style={{ transform: "rotate(180deg)" }} aria-hidden="true">
                <use href="#i-chev" />
              </svg>
            </button>
            {title && (
              <h1 className="truncate font-serif text-[18px] font-bold text-ink">
                {title}
              </h1>
            )}
          </div>
        )}
        <div className="px-4 pt-3">{children}</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   GlassCard — cream gradient card with soft shadow
   variants: "cream" (default) | "solid" | "outline" | "gold"
   ═══════════════════════════════════════════════════════ */
export function GlassCard({
  children,
  variant = "cream",
  padding = "p-4",
  className = "",
  onClick,
}: {
  children: ReactNode;
  variant?: "cream" | "solid" | "outline" | "gold";
  padding?: string;
  className?: string;
  onClick?: () => void;
}) {
  const styles: Record<string, string> = {
    cream:
      "bg-[linear-gradient(135deg,#fbf9f4_0%,#f1ede3_100%)] ring-1 ring-white/70 shadow-[0_18px_38px_-18px_rgba(28,52,42,0.38)]",
    solid:
      "bg-card ring-1 ring-white/70 shadow-[0_18px_38px_-18px_rgba(28,52,42,0.38)]",
    outline:
      "bg-transparent ring-1 ring-divider",
    gold:
      "bg-[linear-gradient(135deg,#fdf6e3_0%,#f4ead3_100%)] ring-1 ring-[rgba(201,164,93,0.35)] shadow-[0_18px_38px_-18px_rgba(201,164,93,0.35)]",
  };
  const base = `rounded-[22px] ${padding} ${styles[variant]} ${className}`;

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`block w-full text-left transition active:scale-[0.99] ${base}`}
      >
        {children}
      </button>
    );
  }
  return <div className={base}>{children}</div>;
}

/* ═══════════════════════════════════════════════════════
   Star8 — 8-pointed Islamic star ornament
   ═══════════════════════════════════════════════════════ */
export function Star8({
  size = 14,
  color = "#C9A45D",
  className = "",
}: {
  size?: number;
  color?: string;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z"
        stroke={color}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════
   OrnamentDivider — horizontal rule with center star
   ═══════════════════════════════════════════════════════ */
export function OrnamentDivider({
  width = "100%",
  className = "",
  color = "rgba(28,74,58,0.25)",
}: {
  width?: string;
  className?: string;
  color?: string;
}) {
  return (
    <div
      className={`flex items-center gap-3 ${className}`}
      style={{ width }}
      aria-hidden="true"
    >
      <span className="h-px flex-1" style={{ background: color }} />
      <Star8 size={10} color={color} />
      <span className="h-px flex-1" style={{ background: color }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CornerFlourish — a small corner ornament (top-left by default)
   Use className to rotate/mirror for other corners
   ═══════════════════════════════════════════════════════ */
export function CornerFlourish({
  size = 36,
  color = "#C9A45D",
  className = "",
}: {
  size?: number;
  color?: string;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      className={`pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <path
        d="M2 18 Q2 2 18 2 M2 12 Q2 2 12 2 M6 18 Q6 6 18 6"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════
   GeometryBg — subtle geometric background pattern
   ═══════════════════════════════════════════════════════ */
export function GeometryBg({
  color = "#C9A45D",
  opacity = 0.06,
}: {
  color?: string;
  opacity?: number;
}) {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
      aria-hidden="true"
    >
      <defs>
        <pattern id="geoStar" width="60" height="60" patternUnits="userSpaceOnUse">
          <path
            d="M30 5 L40 25 L60 30 L40 35 L30 55 L20 35 L0 30 L20 25 Z"
            fill="none"
            stroke={color}
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#geoStar)" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════
   Tilt3D — wraps children in a subtle 3D tilt on hover/tap
   Static fallback: renders children in a div (no JS tilt)
   ═══════════════════════════════════════════════════════ */
export function Tilt3D({
  children,
  intensity = 5,
}: {
  children: ReactNode;
  intensity?: number;
}) {
  // CSS-only subtle press effect. No JS, no dependency.
  return (
    <div
      className="transition-transform duration-200 will-change-transform"
      style={{
        // stored as CSS var so consumers can override
        // (intensity unused in this static version, kept for API compat)
      }}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   AmbientGlow — soft colored blur blob for backgrounds
   ═══════════════════════════════════════════════════════ */
export function AmbientGlow({
  color = "gold",
  size = 300,
  style = {},
}: {
  color?: "gold" | "emerald" | "forest";
  size?: number;
  style?: React.CSSProperties;
}) {
  const colors: Record<string, string> = {
    gold: "rgba(201,164,93,0.18)",
    emerald: "rgba(47,99,80,0.15)",
    forest: "rgba(28,74,58,0.12)",
  };
  return (
    <div
      className="pointer-events-none absolute rounded-full"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${colors[color]} 0%, transparent 70%)`,
        filter: "blur(40px)",
        ...style,
      }}
      aria-hidden="true"
    />
  );
}

/* ═══════════════════════════════════════════════════════
   ImageAvatar — rounded avatar with name initial fallback
   ═══════════════════════════════════════════════════════ */
export function ImageAvatar({
  src,
  name,
  size = 64,
  className = "",
}: {
  src?: string | null;
  name?: string | null;
  size?: number;
  className?: string;
}) {
  const initial = (name ?? "?").trim().charAt(0).toUpperCase() || "?";
  return (
    <div
      className={`relative overflow-hidden rounded-full ring-2 ring-[#dec680] ${className}`}
      style={{ width: size, height: size }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name ?? ""}
          className="h-full w-full object-cover"
        />
      ) : (
        <span
          className="grid h-full w-full place-items-center bg-forest font-serif font-semibold text-white"
          style={{ fontSize: Math.round(size * 0.36) }}
        >
          {initial}
        </span>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Kicker — small uppercase label
   ═══════════════════════════════════════════════════════ */
export function Kicker({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted ${className}`}
    >
      {children}
    </p>
  );
}

/* ═══════════════════════════════════════════════════════
   PrimaryButton / SecondaryButton — consistent buttons
   ═══════════════════════════════════════════════════════ */
export function PrimaryButton({
  children,
  onClick,
  disabled = false,
  type = "button",
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-full bg-forest py-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-white transition active:scale-[0.98] disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  onClick,
  disabled = false,
  type = "button",
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-full border border-divider bg-white/50 py-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-forest transition active:scale-[0.98] disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}
export default Overlay;