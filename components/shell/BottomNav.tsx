"use client";
import { Home, Clock, CircleDot, LayoutGrid } from "lucide-react";
import { useAppStore, type Tab } from "@/lib/store";

const ITEMS: { tab: Tab; label: string; Icon: typeof Home }[] = [
  { tab: "home",    label: "Home",    Icon: Home },
  { tab: "prayer",  label: "Timings", Icon: Clock },
  { tab: "tasbeeh", label: "Tasbeeh", Icon: CircleDot },
  { tab: "more",    label: "More",    Icon: LayoutGrid },
];

export function BottomNav() {
  const activeTab = useAppStore((s) => s.activeTab);
  const setTab = useAppStore((s) => s.setTab);
  const overlaysOpen = useAppStore((s) => s.overlayStack.length > 0);

  if (overlaysOpen) return null;

  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[calc(env(safe-area-inset-bottom)+12px)]">
      <ul className="pointer-events-auto grid w-full max-w-[430px] grid-cols-4 items-center gap-1 rounded-[34px] bg-card/95 p-2 shadow-[0_12px_40px_-10px_rgba(23,75,59,0.35)] ring-1 ring-divider/60 backdrop-blur">
        {ITEMS.map(({ tab, label, Icon }, i) => {
          const active = activeTab === tab;
          return (
            <li key={tab} className="relative">
              {i > 0 && !active && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-0 top-1/2 h-6 w-px -translate-y-1/2 bg-divider/50"
                />
              )}
              <button
                type="button"
                onClick={() => setTab(tab)}
                aria-current={active ? "page" : undefined}
                className={`flex w-full flex-col items-center gap-0.5 rounded-2xl px-2 py-2 text-[10px] transition ${
                  active
                    ? "bg-forest text-white shadow-md shadow-forest/20"
                    : "text-ink-muted hover:text-forest"
                }`}
              >
                <Icon size={16} strokeWidth={active ? 2.5 : 2} />
                <span>{label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
