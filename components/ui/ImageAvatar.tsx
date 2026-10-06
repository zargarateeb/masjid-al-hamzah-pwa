'use client';

export default function ImageAvatar({
  src,
  name,
  size = 56,
  ring = true,
}: {
  src?: string | null;
  name?: string;
  size?: number;
  ring?: boolean;
}) {
  return (
    <div
      className="relative flex-shrink-0 overflow-hidden rounded-full"
      style={{
        width: size,
        height: size,
        boxShadow: ring
          ? '0 0 0 2px rgba(214,180,106,0.55), 0 0 0 4px rgba(6,46,42,0.6), 0 6px 14px -4px rgba(0,0,0,0.4)'
          : undefined,
      }}
    >
      {src ? (
        <img src={src} alt={name || ''} className="h-full w-full object-cover" />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center font-display font-semibold text-midnight"
          style={{
            background:
              'linear-gradient(160deg, #E5B437 0%, #C9A227 55%, #8A6B15 100%)',
            fontSize: size * 0.4,
          }}
        >
          {name?.[0]?.toUpperCase() || '·'}
        </div>
      )}
    </div>
  );
}