'use client';

import { useEffect, useRef, useState } from 'react';

export default function AnalogTimePicker({
  value,
  onConfirm,
  onCancel,
  title = 'Set Time',
}: {
  value: string;
  onConfirm: (time: string) => void;
  onCancel: () => void;
  title?: string;
}) {
  // Parse initial value as 24-hour
  const [hour24, setHour24] = useState<number>(() => {
    const [h] = value.split(':').map(Number);
    return isNaN(h) ? 6 : h;
  });
  const [minute, setMinute] = useState<number>(() => {
    const [, m] = value.split(':').map(Number);
    return isNaN(m) ? 0 : m;
  });
  const [mode, setMode] = useState<'hour' | 'minute'>('hour');
  const [dragging, setDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  // Derived
  const isPM = hour24 >= 12;
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;

  const SIZE = 300;
  const CENTER = SIZE / 2;
  const HOUR_RADIUS = 100;
  const MINUTE_RADIUS = 130;

  const handAngle =
    mode === 'hour'
      ? (hour12 % 12) * 30 + minute * 0.5
      : minute * 6;

  function posFromEvent(e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent) {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    const clientX = 'touches' in e
      ? e.touches[0]?.clientX ?? (e as any).changedTouches?.[0]?.clientX
      : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e
      ? e.touches[0]?.clientY ?? (e as any).changedTouches?.[0]?.clientY
      : (e as React.MouseEvent).clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  function handlePointer(e: React.MouseEvent | React.TouchEvent) {
    const p = posFromEvent(e);
    if (!p) return;
    const dx = p.x - CENTER;
    const dy = p.y - CENTER;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 30) return;

    let deg = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
    if (deg < 0) deg += 360;

    if (mode === 'hour') {
      let h = Math.round(deg / 30) % 12;
      if (h === 0) h = 12;
      // keep current AM/PM
      const newHour24 = isPM
        ? h === 12
          ? 12
          : h + 12
        : h === 12
        ? 0
        : h;
      setHour24(newHour24);
    } else {
      const m = Math.round(deg / 6) % 60;
      setMinute(m);
    }
  }

  function handleMove(e: MouseEvent | TouchEvent) {
    if (!dragging) return;
    const p = posFromEvent(e);
    if (!p) return;
    const dx = p.x - CENTER;
    const dy = p.y - CENTER;
    let deg = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
    if (deg < 0) deg += 360;

    if (mode === 'hour') {
      let h = Math.round(deg / 30) % 12;
      if (h === 0) h = 12;
      const newHour24 = isPM
        ? h === 12
          ? 12
          : h + 12
        : h === 12
        ? 0
        : h;
      setHour24(newHour24);
    } else {
      const m = Math.round(deg / 6) % 60;
      setMinute(m);
    }
  }

  function handleUp() {
    setDragging(false);
    if (mode === 'hour') {
      setTimeout(() => setMode('minute'), 200);
    }
  }

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent | TouchEvent) => handleMove(e);
    const onUp = () => handleUp();
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchend', onUp);
    };
  }, [dragging, mode, isPM]);

  function confirm() {
    const hh = String(hour24).padStart(2, '0');
    const mm = String(minute).padStart(2, '0');
    onConfirm(`${hh}:${mm}`);
  }

  function toggleAmPm(newPM: boolean) {
    if (newPM === isPM) return;
    if (newPM) {
      // convert to PM
      setHour24((h) => (h < 12 ? h + 12 : h));
    } else {
      // convert to AM
      setHour24((h) => (h >= 12 ? h - 12 : h));
    }
  }

  // Hour labels
  const hourNumbers = [];
  for (let i = 1; i <= 12; i++) {
    const angle = ((i * 30 - 90) * Math.PI) / 180;
    const x = CENTER + Math.cos(angle) * HOUR_RADIUS;
    const y = CENTER + Math.sin(angle) * HOUR_RADIUS;
    const active = mode === 'hour' && hour12 === i;
    hourNumbers.push(
      <text
        key={i}
        x={x}
        y={y + 5}
        textAnchor="middle"
        fontSize={active ? 20 : 16}
        fontWeight={active ? 700 : 500}
        fill={active ? '#031A18' : 'rgba(245,240,230,0.85)'}
        pointerEvents="none"
        style={{ userSelect: 'none' }}
      >
        {i}
      </text>
    );
  }

  // Minute labels
  const minuteNumbers = [];
  for (let i = 0; i < 60; i += 5) {
    const angle = ((i * 6 - 90) * Math.PI) / 180;
    const x = CENTER + Math.cos(angle) * (HOUR_RADIUS + 15);
    const y = CENTER + Math.sin(angle) * (HOUR_RADIUS + 15);
    const active = mode === 'minute' && minute === i;
    minuteNumbers.push(
      <text
        key={i}
        x={x}
        y={y + 4}
        textAnchor="middle"
        fontSize={active ? 14 : 11}
        fontWeight={active ? 700 : 500}
        fill={active ? '#D6B46A' : 'rgba(245,240,230,0.55)'}
        pointerEvents="none"
        style={{ userSelect: 'none' }}
      >
        {String(i).padStart(2, '0')}
      </text>
    );
  }

  // Display formatted time (12-hour with AM/PM)
  const displayHour = hour12;
  const displayMinute = String(minute).padStart(2, '0');
  const displayAmPm = isPM ? 'PM' : 'AM';

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-midnight/90 px-4 backdrop-blur-md">
      <div className="glass-dark-strong w-full max-w-[420px] rounded-[28px] p-5">
        <div className="text-center">
          <div className="kicker kicker-gold">{title}</div>

          {/* Time display with AM/PM */}
          <div className="mt-2 flex items-center justify-center gap-3">
            <div className="font-display text-[44px] font-semibold leading-none text-ink-on-dark text-glow-white tabular-nums">
              {displayHour}:{displayMinute}
            </div>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => toggleAmPm(false)}
                className={
                  'rounded-pill px-2.5 py-1 text-[10px] font-bold tracking-widest transition ' +
                  (!isPM ? 'bg-champagne text-midnight' : 'text-ink-faint')
                }
              >
                AM
              </button>
              <button
                onClick={() => toggleAmPm(true)}
                className={
                  'rounded-pill px-2.5 py-1 text-[10px] font-bold tracking-widest transition ' +
                  (isPM ? 'bg-champagne text-midnight' : 'text-ink-faint')
                }
              >
                PM
              </button>
            </div>
          </div>

          <div className="mt-3 inline-flex items-center gap-2">
            <button
              onClick={() => setMode('hour')}
              className={
                'rounded-pill px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] transition ' +
                (mode === 'hour' ? 'bg-champagne text-midnight' : 'text-ink-faint')
              }
            >
              Hour
            </button>
            <button
              onClick={() => setMode('minute')}
              className={
                'rounded-pill px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] transition ' +
                (mode === 'minute' ? 'bg-champagne text-midnight' : 'text-ink-faint')
              }
            >
              Minute
            </button>
          </div>
        </div>

        <div className="mt-4 flex justify-center">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            width={280}
            height={280}
            className="touch-none select-none"
            onMouseDown={(e) => { setDragging(true); handlePointer(e); }}
            onTouchStart={(e) => { setDragging(true); handlePointer(e); }}
          >
            <circle cx={CENTER} cy={CENTER} r={140} fill="url(#clockGrad)" stroke="rgba(214,180,106,0.30)" strokeWidth={1.5} />
            <circle cx={CENTER} cy={CENTER} r={HOUR_RADIUS + 25} fill="none" stroke="rgba(245,240,230,0.10)" strokeWidth={1} />
            <defs>
              <radialGradient id="clockGrad" cx="50%" cy="50%">
                <stop offset="0%" stopColor="#0E5449" />
                <stop offset="60%" stopColor="#0A4139" />
                <stop offset="100%" stopColor="#031A18" />
              </radialGradient>
            </defs>

            {Array.from({ length: 60 }).map((_, i) => {
              const angle = ((i * 6 - 90) * Math.PI) / 180;
              const r1 = 132;
              const r2 = i % 5 === 0 ? 122 : 128;
              return (
                <line
                  key={i}
                  x1={CENTER + Math.cos(angle) * r1}
                  y1={CENTER + Math.sin(angle) * r1}
                  x2={CENTER + Math.cos(angle) * r2}
                  y2={CENTER + Math.sin(angle) * r2}
                  stroke={i % 5 === 0 ? 'rgba(214,180,106,0.75)' : 'rgba(245,240,230,0.28)'}
                  strokeWidth={i % 5 === 0 ? 2 : 1}
                  pointerEvents="none"
                />
              );
            })}

            {hourNumbers}
            {mode === 'minute' && minuteNumbers}

            <circle cx={CENTER} cy={CENTER} r={6} fill="#D6B46A" />

            <line
              x1={CENTER}
              y1={CENTER}
              x2={CENTER + Math.cos(((handAngle - 90) * Math.PI) / 180) * (mode === 'hour' ? HOUR_RADIUS - 15 : MINUTE_RADIUS - 20)}
              y2={CENTER + Math.sin(((handAngle - 90) * Math.PI) / 180) * (mode === 'hour' ? HOUR_RADIUS - 15 : MINUTE_RADIUS - 20)}
              stroke="#D6B46A"
              strokeWidth={3}
              strokeLinecap="round"
              pointerEvents="none"
            />

            {mode === 'minute' && (
              <line
                x1={CENTER}
                y1={CENTER}
                x2={CENTER + Math.cos(((hour12 * 30 + minute * 0.5 - 90) * Math.PI) / 180) * (HOUR_RADIUS - 30)}
                y2={CENTER + Math.sin(((hour12 * 30 + minute * 0.5 - 90) * Math.PI) / 180) * (HOUR_RADIUS - 30)}
                stroke="rgba(214,180,106,0.45)"
                strokeWidth={5}
                strokeLinecap="round"
                pointerEvents="none"
              />
            )}

            <circle
              cx={CENTER + Math.cos(((handAngle - 90) * Math.PI) / 180) * (mode === 'hour' ? HOUR_RADIUS - 15 : MINUTE_RADIUS - 20)}
              cy={CENTER + Math.sin(((handAngle - 90) * Math.PI) / 180) * (mode === 'hour' ? HOUR_RADIUS - 15 : MINUTE_RADIUS - 20)}
              r={10}
              fill="#E5B437"
              stroke="#031A18"
              strokeWidth={2}
              pointerEvents="none"
            />
          </svg>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button onClick={onCancel} className="glass-dark press flex-1 rounded-pill py-3.5 text-[11px] font-bold uppercase tracking-[0.16em] text-ink-soft">
            Cancel
          </button>
          <button onClick={confirm} className="press flex-1 rounded-pill bg-champagne py-3.5 text-[11px] font-bold uppercase tracking-[0.16em] text-midnight">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}