'use client';

interface Props {
  label: string;
  icon: React.ReactNode;
  bg: string;
  onClick?: () => void;
}

export default function QuickAction({ label, icon, bg, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="flex flex-1 flex-col items-center gap-3 transition active:scale-95"
    >
      <div
        className="flex h-[68px] w-[68px] items-center justify-center rounded-full"
        style={{ backgroundColor: bg }}
      >
        {icon}
      </div>
      <span className="text-[12px] font-medium text-ink">{label}</span>
    </button>
  );
}