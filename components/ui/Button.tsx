'use client';

import { cls } from '@/lib/utils';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'solid' | 'ghost';
  loading?: boolean;
};

export default function Button({
  children,
  variant = 'solid',
  loading,
  className,
  ...rest
}: Props) {
  const base =
    'w-full rounded-pill py-4 px-6 text-[11px] tracking-[0.16em] uppercase font-semibold transition active:scale-[0.98] disabled:opacity-50';
  const styles =
    variant === 'solid'
      ? 'bg-green text-white shadow-[0_10px_20px_-6px_rgba(27,94,63,0.4)]'
      : 'bg-transparent text-ink border border-line';

  return (
    <button className={cls(base, styles, className)} {...rest}>
      {loading ? '…' : children}
    </button>
  );
}