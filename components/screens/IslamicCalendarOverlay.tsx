"use client";
import { useMemo, useState } from "react";
import { useAppStore } from "@/lib/store";
import { GlassCard } from "../ui/Theme";
import {
  buildHijriMonth,
  getHijri,
  hijriMonthName,
  ISLAMIC_EVENTS,
  type DayCell,
} from "@/lib/calendar/islamicEvents";
import { MOSQUE_NIGHT } from "@/lib/images";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Convert Western digits to Arabic-Indic. */
function toArabicNumerals(n: number | string): string {
  const map = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return String(n).replace(/\d/g, (d) => map[parseInt(d, 10)]);
}

function arabicHijriDate(day: number, year: number): string {
  return `${toArabicNumerals(day)} ${toArabicNumerals(year)}`;
}

function daysUntil(target: Date, from: Date): number {
  const a = new Date(target);
  a.setHours(0, 0, 0, 0);
  const b = new Date(from);
  b.setHours(0, 0, 0, 0);
  return Math.round((a.getTime() - b.getTime()) / 86400000);
}

export function IslamicCalendarOverlay() {
  const popScreen = useAppStore((s) => s.popScreen);
  const today = useMemo(() => new Date(), []);
  const todayH = useMemo(() => getHijri(today), [today]);

  const [year, setYear] = useState(todayH.year);
  const [month, setMonth] = useState(todayH.month);
  const [selectedDay, setSelectedDay] = useState<DayCell | null>(null);

  const { rows, gregorianRange } = useMemo(
    () => buildHijriMonth(year, month),
    [year, month],
  );

  function shiftMonth(delta: number) {
    let m = month + delta;
    let y = year;
    if (m < 1) {
      m = 12;
      y -= 1;
    }
    if (m > 12) {
      m = 1;
      y += 1;
    }
    setMonth(m);
    setYear(y);
    setSelectedDay(null);
  }

  const monthEvents = ISLAMIC_EVENTS.filter((e) => e.hijriMonth === month);

  // Compute next upcoming event with a real date by scanning the current grid
  const upcomingEvents = useMemo(() => {
    const allDays: DayCell[] = [];
    for (const row of rows) {
      for (const cell of row) {
        if (cell && cell.isEvent) allDays.push(cell);
      }
    }
    return allDays
      .filter((d) => daysUntil(d.date, today) >= 0)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 3);
  }, [rows, today]);

  const nextEvent = upcomingEvents[0];

  return (
    <div className="px-4 pt-4 pb-28">
      {/* Top bar */}
      <div className="mb-4 flex items-center gap-3">
        <button
          type="button"
          onClick={popScreen}
          aria-label="Back"
          className="grid h-10 w-10 place-items-center rounded-full bg-white/70 text-forest ring-1 ring-white/70"
        >
          <svg className="ic" style={{ transform: "rotate(180deg)" }} aria-hidden="true">
            <use href="#i-chev" />
          </svg>
        </button>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
            Islamic Calendar
          </p>
          <h1 className="truncate font-serif text-[20px] font-bold text-ink">
            Sacred Dates
          </h1>
        </div>
      </div>

      {/* HERO — mosque at night + month name */}
      <div className="relative mb-4 h-[220px] overflow-hidden rounded-[28px]">
        {/* Photo background */}
        <img
          src={MOSQUE_NIGHT}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Dark gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,15,12,0.45) 0%, rgba(10,15,12,0.35) 40%, rgba(10,15,12,0.92) 100%)",
          }}
        />

        {/* Month nav arrows over the hero */}
        <button
          type="button"
          onClick={() => shiftMonth(-1)}
          aria-label="Previous month"
          className="absolute left-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/20 text-white ring-1 ring-white/30 backdrop-blur active:scale-95"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => shiftMonth(1)}
          aria-label="Next month"
          className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/20 text-white ring-1 ring-white/30 backdrop-blur active:scale-95"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        {/* Month name + dates */}
        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#dec680]">
            {year === todayH.year && month === todayH.month ? "This month" : "Selected month"}
          </p>
          <h2 className="mt-1 font-serif text-[34px] font-bold leading-none text-white drop-shadow">
            {hijriMonthName(month)}{" "}
            <span className="font-serif">{toArabicNumerals(year)}</span>
          </h2>
          <p className="mt-1.5 text-[12px] text-white/75">{gregorianRange}</p>
        </div>
      </div>

      {/* Today pill */}
      {year === todayH.year && month === todayH.month && (
        <div className="mb-4 flex items-center gap-3 rounded-[18px] bg-[#1c4a3a] px-4 py-3 text-white shadow-lg">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-white/15">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="5" width="18" height="16" rx="2" />
              <path d="M3 9h18M8 3v4M16 3v4" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#dec680]">
              Today
            </p>
            <p className="font-serif text-[16px] font-bold">
              {arabicHijriDate(todayH.day, todayH.year)} · {todayH.monthName}
            </p>
          </div>
          <p className="text-right text-[11px] text-white/70">
            {today.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
          </p>
        </div>
      )}

      {/* Next event hero card */}
      {nextEvent && (
        <div className="mb-4 overflow-hidden rounded-[24px] bg-[linear-gradient(135deg,#fbf9f4_0%,#f1ede3_100%)] ring-1 ring-white/70 shadow-[0_18px_38px_-18px_rgba(28,52,42,0.38)]">
          <div className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8a6b15]">
                  Upcoming
                </p>
                <p className="mt-1 font-serif text-[22px] font-bold leading-tight text-forest">
                  {nextEvent.eventName}
                </p>
                <p className="mt-1 text-[12.5px] text-ink-muted">
                  {nextEvent.eventDescription}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-serif text-[28px] font-bold leading-none text-forest">
                  {toArabicNumerals(nextEvent.hijriDay)}
                </p>
                <p className="text-[10px] uppercase tracking-[0.14em] text-ink-muted">
                  {hijriMonthName(month)}
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between rounded-2xl bg-white/60 px-3 py-2">
              <p className="text-[11px] text-ink-muted">
                {nextEvent.date.toLocaleDateString("en-GB", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
              <p className="rounded-full bg-forest px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                {(() => {
                  const d = daysUntil(nextEvent.date, today);
                  return d === 0 ? "Today" : d === 1 ? "Tomorrow" : `In ${d} days`;
                })()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Weekday header */}
      <div className="mb-2 grid grid-cols-7 gap-1">
        {WEEKDAYS.map((w) => (
          <div key={w} className="text-center text-[10px] font-bold uppercase tracking-[0.1em] text-ink-muted">
            {w}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <GlassCard variant="cream" padding="p-2.5">
        {rows.map((row, ri) => (
          <div key={ri} className="mb-1 grid grid-cols-7 gap-1 last:mb-0">
            {row.map((cell, ci) => {
              if (!cell) return <div key={ci} className="aspect-square" />;
              const isToday =
                cell.hijriDay === todayH.day &&
                month === todayH.month &&
                year === todayH.year;
              const isSelected = selectedDay?.hijriDay === cell.hijriDay;
              return (
                <button
                  key={ci}
                  type="button"
                  onClick={() => setSelectedDay(cell)}
                  className={`relative flex aspect-square flex-col items-center justify-center rounded-xl transition ${
                    isSelected
                      ? "bg-forest text-white shadow-md"
                      : isToday
                      ? "bg-forest/15 text-forest font-bold ring-1 ring-forest/40"
                      : cell.isEvent
                      ? "bg-[#c9a45d]/10 text-ink hover:bg-[#c9a45d]/20"
                      : "text-ink hover:bg-white/60"
                  }`}
                >
                  <span className="font-serif text-[15px] font-semibold leading-none">
                    {toArabicNumerals(cell.hijriDay)}
                  </span>
                  <span className={`mt-1 text-[9px] leading-none ${isSelected ? "text-white/70" : "text-ink-muted"}`}>
                    {cell.gregorianDay}
                  </span>
                  {cell.isEvent && (
                    <span
                      className={`absolute -top-0.5 right-0.5 h-1.5 w-1.5 rounded-full ${
                        isSelected ? "bg-[#dec680]" : "bg-[#c9a45d]"
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </GlassCard>

      {/* Selected day detail */}
      {selectedDay && (
        <div className="mt-4">
          <GlassCard variant="gold" padding="p-4">
            <div className="flex items-baseline justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8a6b15]">
                  {toArabicNumerals(selectedDay.hijriDay)} {hijriMonthName(month)}{" "}
                  {toArabicNumerals(year)} AH
                </p>
                <p className="mt-1 font-serif text-[16px] font-bold text-ink">
                  {selectedDay.date.toLocaleDateString("en-GB", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDay(null)}
                className="shrink-0 text-[18px] leading-none text-ink-muted"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            {selectedDay.eventName && (
              <div className="mt-3 rounded-2xl bg-white/60 p-3">
                <p className="font-serif text-[14px] font-bold text-forest">
                  {selectedDay.eventName}
                </p>
                <p className="mt-0.5 text-[12px] text-ink-muted">
                  {selectedDay.eventDescription}
                </p>
              </div>
            )}
          </GlassCard>
        </div>
      )}

      {/* Month's events */}
      {monthEvents.length > 0 && (
        <div className="mt-6">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted">
            This month
          </p>
          <ul className="space-y-2">
            {monthEvents.map((e) => (
              <li
                key={e.name}
                className="flex items-start gap-3 rounded-[16px] bg-white/70 p-3 ring-1 ring-white/70"
              >
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#c9a45d]" />
                <div className="min-w-0">
                  <p className="font-serif text-[13px] font-semibold text-forest">
                    {toArabicNumerals(e.hijriDay)} {hijriMonthName(month)}
                  </p>
                  <p className="text-[11.5px] text-ink">{e.name}</p>
                  <p className="text-[10.5px] text-ink-muted">
                    {e.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Note about moon sighting */}
      <p className="mt-5 rounded-2xl bg-white/50 p-3 text-center text-[10.5px] leading-relaxed text-ink-muted ring-1 ring-white/60">
        Dates follow the Umm al-Qura calendar and may differ by ±1 day from local
        Srinagar moon sighting. Check with the mosque for confirmed dates.
      </p>
    </div>
  );
}