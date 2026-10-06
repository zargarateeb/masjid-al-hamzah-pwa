import { cls } from '@/lib/utils';

export default function Card({
  children,
  className,
  border,
}: {
  children: React.ReactNode;
  className?: string;
  border?: boolean;
}) {
  return (
    <div
      className={cls(
        'rounded-card bg-surface p-5 shadow-soft',
        border && 'border border-line',
        className
      )}
    >
      {children}
    </div>
  );
}