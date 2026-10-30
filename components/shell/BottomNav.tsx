"use client";
import { Home, Clock, CircleDot, LayoutGrid } from "lucide-react";
import { useAppStore, type Tab } from "@/lib/store";

const ITEMS: { tab: Tab; label: string; Icon: typeof Home }[] = [
  { tab: "home", label: "Home", Icon: Home },
  { tab: "prayer", label: "Timings", Icon: Clock },
  { tab: "tasbeeh", label: "Tasbeeh", Icon: CircleDot },
  { tab: "more", label: "More", Icon: LayoutGrid },
];

export function BottomNav() {
  const activeTab = useAppStore((s) => s.activeTab);
  const setTab = useAppStore((s) => s.setTab);
  const overlaysOpen = useAppStore((s) => s.overlayStack.length > 0);

  if (overlaysOpen) return null;

  return (
    <nav
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)" }}
    >
      <ul
        className="pointer-events-auto grid w-full max-w-[540px] grid-cols-4 items-center gap-1 p-2"
        style={{
          backgroundColor: "rgba(251,249,244,0.95)",
          borderRadius: 34,
          boxShadow: "0 12px 40px -10px rgba(23,75,59,0.35)",
          border: "1px solid rgba(228,222,209,0.6)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        {ITEMS.map(({ tab, label, Icon }, i) => {
          const active = activeTab === tab;
          return (
            <li key={tab} className="relative">
              {i > 0 && !active && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 h-6 w-px"
                  style={{
                    left: 0,
                    transform: "translateY(-50%)",
                    backgroundColor: "rgba(228,222,209,0.5)",
                  }}
                />
              )}
              <button
                type="button"
                onClick={() => setTab(tab)}
                aria-current={active ? "page" : undefined}
                style={{
                  display: "flex",
                  width: "100%",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                  padding: "8px 8px",
                  borderRadius: 16,
                  fontSize: 10,
                  transition: "all 200ms ease",
                  backgroundColor: active ? "#1c4a3a" : "transparent",
                  color: active ? "#ffffff" : "#6c746e",
                  boxShadow: active ? "0 4px 12px -4px rgba(28,74,58,0.35)" : "none",
                  border: "none",
                  cursor: "pointer",
                }}
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