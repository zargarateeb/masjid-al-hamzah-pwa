'use client';

export default function PressCard({
  children,
  className = '',
  onClick,
  variant = 'light', // 'light' | 'navy' | 'emerald' | 'copper'
  padding = 'p-5',
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'light' | 'navy' | 'emerald' | 'copper';
  padding?: string;
}) {
  const variantClass = {
    light: 'surface-3d',
    navy: 'surface-3d-navy text-white',
    emerald: 'surface-3d-emerald text-white',
    copper: 'surface-3d-copper text-white',
  }[variant];

  return (
    <button
      onClick={onClick}
      className={`relative w-full overflow-hidden rounded-[24px] ${variantClass} ${padding} text-left transition-transform duration-150 active:translate-y-[1px] active:scale-[0.99] ${className}`}
      style={{ transform: 'translateZ(0)' }}
    >
      {children}
    </button>
  );
}