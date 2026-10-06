'use client';

export default function AmbientGlow({
  color = 'emerald', // 'emerald' | 'gold'
  size = 300,
  className = '',
  style,
  opacity = 1,
}: {
  color?: 'emerald' | 'gold';
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  opacity?: number;
}) {
  return (
    <div
      className={`${color === 'gold' ? 'ambient-gold' : 'ambient-emerald'} ${className}`}
      style={{
        width: size,
        height: size,
        opacity,
        ...style,
      }}
    />
  );
}