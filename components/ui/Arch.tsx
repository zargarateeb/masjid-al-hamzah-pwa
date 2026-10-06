'use client';

export function ArchImage({
  src,
  alt = '',
  className = '',
  overlay = true,
  height = 260,
}: {
  src: string;
  alt?: string;
  className?: string;
  overlay?: boolean;
  height?: number;
}) {
  return (
    <div
      className={`relative overflow-hidden arch-shape ${className}`}
      style={{ height }}
    >
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {overlay && (
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, transparent 0%, rgba(3,26,24,0.30) 55%, rgba(3,26,24,0.85) 100%)',
          }}
        />
      )}
    </div>
  );
}

export function ArchFrame({
  children,
  className = '',
  padding = 'p-8',
  variant = 'dark',
}: {
  children: React.ReactNode;
  className?: string;
  padding?: string;
  variant?: 'dark' | 'gold';
}) {
  const bg =
    variant === 'gold'
      ? 'linear-gradient(160deg, rgba(214,180,106,0.20) 0%, rgba(184,149,80,0.10) 55%, rgba(0,0,0,0.28) 100%)'
      : 'linear-gradient(160deg, rgba(10,65,57,0.85) 0%, rgba(6,46,42,0.92) 55%, rgba(3,26,24,0.95) 100%)';

  return (
    <div className={`relative ${className}`}>
      <div
        className={`relative arch-shape overflow-hidden ${padding}`}
        style={{
          background: bg,
          backdropFilter: 'blur(20px) saturate(150%)',
          WebkitBackdropFilter: 'blur(20px) saturate(150%)',
          border: '1px solid rgba(214,180,106,0.22)',
          boxShadow:
            '0 1px 0 rgba(255,255,255,0.06) inset, 0 -2px 8px rgba(0,0,0,0.4) inset, 0 30px 60px -20px rgba(0,0,0,0.65)',
        }}
      >
        {children}
      </div>
      {/* Gold outer frame */}
      <div
        className="pointer-events-none absolute arch-shape"
        style={{
          inset: -8,
          border: '1px solid rgba(214,180,106,0.24)',
        }}
      />
    </div>
  );
}