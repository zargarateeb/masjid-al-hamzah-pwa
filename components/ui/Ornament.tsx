'use client';

export function GoldStar({ size = 14, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--color-champagne)"
      strokeWidth="1.5"
      className={className}
    >
      <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" />
    </svg>
  );
}

export function GoldDivider({ width = '100%', className = '' }: { width?: string | number; className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`} style={{ width }}>
      <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(214,180,106,0.45))' }} />
      <GoldStar size={10} />
      <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(214,180,106,0.45), transparent)' }} />
    </div>
  );
}

export function CornerFlourish({
  size = 32,
  color = 'var(--color-champagne)',
  className = '',
  opacity = 0.5,
}: {
  size?: number;
  color?: string;
  className?: string;
  opacity?: number;
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
      style={{ opacity, pointerEvents: 'none' }}
    >
      <path d="M2 2 Q2 12 8 14 Q14 16 14 22 Q14 28 2 30" />
      <path d="M2 2 Q12 2 14 8 Q16 14 22 14 Q28 14 30 2" opacity="0.5" />
      <circle cx="8" cy="8" r="2" fill={color} opacity="0.4" />
    </svg>
  );
}