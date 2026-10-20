import type { PrayerRow } from "@/lib/home/types";
import type { PrayerKey } from "@/lib/constants";
import { Moon, Sun, Sunrise, Sunset, CloudMoon } from "lucide-react";

const ICONS: Record<PrayerKey, typeof Moon> = {
  fajr: Sunrise,
  zuhr: Sun,
  asr: Sun,
  maghrib: Sunset,
  isha: CloudMoon,
};

export function PrayerTimeline({
  rows,
  activeKey,
}: {
  rows: PrayerRow[];
  activeKey: PrayerKey;
}) {
  if (rows.length === 0) return null;

  return (
    <div className="relative my-6">
      <div className="absolute inset-x-2 top-[34px] h-px bg-divider" />
      <ul className="relative grid grid-cols-5 gap-1">
        {rows.map((r) => {
          const active = r.key === activeKey;
          const Icon = ICONS[r.key];
          return (
            <li key={r.key} className="flex flex-col items-center gap-1">
              <span
                className={
                  active
                    ? "grid h-12 w-12 place-items-center rounded-2xl bg-forest text-white shadow-md"
                    : "grid h-12 w-12 place-items-center rounded-2xl text-forest"
                }
              >
                <Icon size={20} strokeWidth={2} />
              </span>
              <span
                className={`text-[11px] ${
                  active ? "font-semibold text-forest" : "text-ink-muted"
                }`}
              >
                {r.label}
              </span>
              <span
                className={`text-[11px] tabular-nums ${
                  active ? "text-forest" : "text-ink-muted"
                }`}
              >
                {r.display}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}