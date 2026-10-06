'use client';

export default function GlassCard({
  children,
  className = '',
  variant = 'dark', // 'dark' | 'dark-strong' | 'gold' | 'light'
  padding = 'p-5',
  onClick,
  arch = false,
}: {
  children: React.ReactNode;
  className?: string;
  variant?: 'dark' | 'dark-strong' | 'gold' | 'light';
  padding?: string;
  onClick?: () => void;
  arch?: boolean;
}) {
  const variantClass = {
    dark: 'glass-dark',
    'dark-strong': 'glass-dark-strong',
    gold: 'glass-gold',
    light: 'glass-light',
  }[variant];

  const textClass = variant === 'light' ? 'text-ink-on-light' : 'text-ink-on-dark';

  const shapeClass = arch ? 'arch-shape' : 'rounded-[22px]';

  const base = `relative overflow-hidden ${variantClass} ${shapeClass} ${padding} ${textClass} ${className}`;

  if (onClick) {
    return (
      <button onClick={onClick} className={`${base} press text-left w-full`}>
        {children}
      </button>
    );
  }

  return <div className={base}>{children}</div>;
}