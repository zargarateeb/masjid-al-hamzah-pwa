'use client';

/** Islamic 8-point star ornament */
export function Star8({ size = 16, color = '#C9A227', className = '' }: {
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
      stroke={color}
      strokeWidth="1.5"
      className={className}
    >
      <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" />
      <path d="M12 6 L13 11 L18 12 L13 13 L12 18 L11 13 L6 12 L11 11 Z" opacity="0.5" />
    </svg>
  );
}

/** Decorative corner flourish */
export function CornerFlourish({
  size = 32,
  color = '#C9A227',
  className = '',
}: {
  size?: number;
  color?: string;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke={color}
      strokeWidth="1"
      className={className}
    >
      <path d="M2 2 Q2 12 8 14 Q14 16 14 22 Q14 28 2 30" />
      <path d="M2 2 Q12 2 14 8 Q16 14 22 14 Q28 14 30 2" opacity="0.5" />
      <circle cx="8" cy="8" r="2" fill={color} opacity="0.4" />
    </svg>
  );
}

export function OrnamentDivider({
  color = '#C9A227',
  width = '100%',
  className = '',
}: {
  color?: string;
  width?: string | number;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} style={{ width }}>
      <div
        className="h-px flex-1"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}88)`,
        }}
      />
      <Star8 size={12} color={color} />
      <div
        className="h-px flex-1"
        style={{
          background: `linear-gradient(90deg, ${color}88, transparent)`,
        }}
      />
    </div>
  );
}

/** Alias so both import names work */
export const GoldDivider = OrnamentDivider;

/** Arched decorative frame (mihrab-shaped outline) */
export function ArchedFrame({
  color = '#C9A227',
  className = '',
}: {
  color?: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 200 260"
      preserveAspectRatio="none"
      fill="none"
      stroke={color}
      strokeWidth="1"
      className={className}
    >
      <path d="M10 30 Q10 10 30 10 L170 10 Q190 10 190 30 L190 240 Q190 250 180 250 L20 250 Q10 250 10 240 Z" />
      <path d="M16 34 Q16 16 34 16 L166 16 Q184 16 184 34 L184 236 Q184 244 176 244 L24 244 Q16 244 16 236 Z" opacity="0.4" />
    </svg>
  );
}

/** Geometric pattern background (subtle) */
export function GeometryBg({
  color = '#C9A227',
  opacity = 0.06,
  className = '',
}: {
  color?: string;
  opacity?: number;
  className?: string;
}) {
  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      style={{ position: 'absolute', inset: 0, opacity, pointerEvents: 'none' }}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id="geo" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <path
            d="M30 0 L45 15 L30 30 L15 15 Z M30 30 L45 45 L30 60 L15 45 Z"
            fill="none"
            stroke={color}
            strokeWidth="0.8"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#geo)" />
    </svg>
  );
}