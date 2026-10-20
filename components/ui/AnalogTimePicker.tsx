"use client";
import { useState } from "react";

export default function AnalogTimePicker({
  value,
  title,
  step = 1,
  onCancel,
  onConfirm,
}: {
  value: string;
  title: string;
  step?: number; // 1 = any minute, 5 = multiples of 5 only
  onCancel: () => void;
  onConfirm: (time: string) => void;
}) {
  const [h, m] = value.split(":").map((n) => parseInt(n, 10) || 0);
  const [hours, setHours] = useState(h);
  const [minutes, setMinutes] = useState(m);

  function pad(n: number) {
    return String(n).padStart(2, "0");
  }

  function bumpHours(delta: number) {
    setHours((v) => (v + delta + 24) % 24);
  }
  function bumpMinutes(delta: number) {
    setMinutes((v) => {
      const next = v + delta * step;
      return ((next % 60) + 60) % 60;
    });
  }

  function display12(h: number, m: number) {
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${pad(m)} ${ampm}`;
  }

  // For 5-min step, show a scrollable strip of all 12 valid minutes
  const validMinutes =
    step === 5 ? [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55] : null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 px-5 backdrop-blur-md">
      <div className="w-full max-w-[340px] overflow-hidden rounded-[26px] bg-canvas shadow-2xl">
        <div className="border-b border-divider/60 px-5 py-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
            Select time
          </p>
          <h3 className="mt-0.5 font-serif text-[16px] font-bold text-ink">
            {title}
          </h3>
        </div>

        <div className="px-5 py-6">
          <p className="mb-4 text-center font-serif text-[40px] font-bold tabular-nums text-forest">
            {display12(hours, minutes)}
          </p>

          {step === 5 && validMinutes ? (
            // ── 5-min step: scrollable minute chips ──
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="mb-1.5 text-center text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
                  Hour
                </p>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => bumpHours(-1)}
                    className="grid h-9 w-9 place-items-center rounded-full bg-white/70 text-forest ring-1 ring-white/70"
                    aria-label="Decrease hour"
                  >
                    −
                  </button>
                  <span className="flex-1 text-center font-serif text-[18px] font-bold tabular-nums text-ink">
                    {pad(hours)}
                  </span>
                  <button
                    type="button"
                    onClick={() => bumpHours(1)}
                    className="grid h-9 w-9 place-items-center rounded-full bg-white/70 text-forest ring-1 ring-white/70"
                    aria-label="Increase hour"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <p className="mb-1.5 text-center text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
                  Minute (5-step)
                </p>
                <select
                  value={minutes}
                  onChange={(e) => setMinutes(parseInt(e.target.value, 10))}
                  className="w-full rounded-xl bg-white/80 px-3 py-2 text-center font-serif text-[16px] font-bold tabular-nums text-ink outline-none ring-1 ring-divider/50 focus:ring-forest/40"
                >
                  {validMinutes.map((mv) => (
                    <option key={mv} value={mv}>
                      :{pad(mv)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            // ── 1-min step: original ± buttons ──
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="mb-1.5 text-center text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
                  Hour
                </p>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => bumpHours(-1)}
                    className="grid h-9 w-9 place-items-center rounded-full bg-white/70 text-forest ring-1 ring-white/70"
                    aria-label="Decrease hour"
                  >
                    −
                  </button>
                  <span className="flex-1 text-center font-serif text-[18px] font-bold tabular-nums text-ink">
                    {pad(hours)}
                  </span>
                  <button
                    type="button"
                    onClick={() => bumpHours(1)}
                    className="grid h-9 w-9 place-items-center rounded-full bg-white/70 text-forest ring-1 ring-white/70"
                    aria-label="Increase hour"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <p className="mb-1.5 text-center text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
                  Minute
                </p>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => bumpMinutes(-1)}
                    className="grid h-9 w-9 place-items-center rounded-full bg-white/70 text-forest ring-1 ring-white/70"
                    aria-label="Decrease minutes"
                  >
                    −
                  </button>
                  <span className="flex-1 text-center font-serif text-[18px] font-bold tabular-nums text-ink">
                    {pad(minutes)}
                  </span>
                  <button
                    type="button"
                    onClick={() => bumpMinutes(1)}
                    className="grid h-9 w-9 place-items-center rounded-full bg-white/70 text-forest ring-1 ring-white/70"
                    aria-label="Increase minutes"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 border-t border-divider/60 px-4 py-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-full border border-divider bg-white/50 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-forest"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(`${pad(hours)}:${pad(minutes)}`)}
            className="flex-1 rounded-full bg-forest py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
