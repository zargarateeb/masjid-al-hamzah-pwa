export default function SectionHead({
  kicker,
  title,
  action,
  onAction,
}: {
  kicker?: string;
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="mb-4 flex items-end justify-between">
      <div>
        {kicker && (
          <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-inkFaint">
            {kicker}
          </div>
        )}
        <h2 className="font-display text-[24px] font-semibold leading-tight text-ink">
          {title}
        </h2>
      </div>
      {action && (
        <button
          onClick={onAction}
          className="rounded-pill border border-line bg-surface px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-green"
        >
          {action} →
        </button>
      )}
    </div>
  );
}