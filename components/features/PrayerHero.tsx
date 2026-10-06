'use client';

import { prayerImage } from '@/lib/images';

interface Props {
  prayerKey: string;
  name: string;
  arabic: string;
  time: string;
  countdown: string;
  onOpen?: () => void;
}

export default function PrayerHero({
  prayerKey,
  name,
  arabic,
  time,
  countdown,
  onOpen,
}: Props) {
  const img = prayerImage(prayerKey);

  return (
    <>
      {/* SVG clipPath definitions */}
      <svg
        width="0"
        height="0"
        className="absolute"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          {/* Outer silhouette (unchanged) */}
          <clipPath id="prayerCardClip" clipPathUnits="objectBoundingBox">
            <path
              d="
                M 0.50 0
                C 0.46 0.035, 0.40 0.075, 0.34 0.13
                C 0.29 0.18, 0.25 0.23, 0.23 0.29
                C 0.15 0.31, 0.09 0.36, 0.06 0.44
                C 0.03 0.51, 0.03 0.60, 0.03 0.70
                L 0.03 0.88
                C 0.03 0.96, 0.08 1.00, 0.16 1.00
                L 0.84 1.00
                C 0.92 1.00, 0.97 0.96, 0.97 0.88
                L 0.97 0.70
                C 0.97 0.60, 0.97 0.51, 0.94 0.44
                C 0.91 0.36, 0.85 0.31, 0.77 0.29
                C 0.75 0.23, 0.71 0.18, 0.66 0.13
                C 0.60 0.075, 0.54 0.035, 0.50 0
                Z
              "
            />
          </clipPath>

          {/* Inner silhouette — inset ~1.5% */}
          <clipPath id="prayerCardClipInner" clipPathUnits="objectBoundingBox">
            <path
              d="
                M 0.50 0.015
                C 0.462 0.048, 0.406 0.086, 0.348 0.140
                C 0.298 0.189, 0.259 0.238, 0.240 0.297
                C 0.161 0.316, 0.101 0.366, 0.072 0.448
                C 0.043 0.516, 0.043 0.605, 0.043 0.705
                L 0.043 0.882
                C 0.043 0.958, 0.090 0.988, 0.165 0.988
                L 0.835 0.988
                C 0.910 0.988, 0.957 0.958, 0.957 0.882
                L 0.957 0.705
                C 0.957 0.605, 0.957 0.516, 0.928 0.448
                C 0.899 0.366, 0.839 0.316, 0.760 0.297
                C 0.741 0.238, 0.702 0.189, 0.652 0.140
                C 0.594 0.086, 0.538 0.048, 0.50 0.015
                Z
              "
            />
          </clipPath>
        </defs>
      </svg>

      {/* Card wrapper — 440 wide */}
      <div className="relative mx-auto w-full max-w-[440px]">
        <div
          className="relative w-full"
          style={{ aspectRatio: '440 / 420' }}
        >
          {/* LAYER 1: White base — visible only as border ring */}
          <div
            className="absolute inset-0 bg-white"
            style={{
              clipPath: 'url(#prayerCardClip)',
              WebkitClipPath: 'url(#prayerCardClip)',
            }}
          />

          {/* LAYER 2: Card content — clipped to inner silhouette */}
          <div
            className="absolute inset-0"
            style={{
              clipPath: 'url(#prayerCardClipInner)',
              WebkitClipPath: 'url(#prayerCardClipInner)',
            }}
          >
            {/* Image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${img})` }}
            />

            {/* Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-navy-dark/55 via-navy/55 to-navy-dark/88" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-8 pt-20 text-center text-white">
              <div className="text-[12px] font-medium tracking-[0.04em] text-white/90">
                Next Prayer
              </div>

              <div className="mt-3 font-arabic text-[28px] leading-none text-white/95">
                {arabic}
              </div>

              <div className="mt-3 font-display text-[54px] font-semibold leading-none">
                {name}
              </div>

              <div className="mt-4 font-display text-[34px] font-medium leading-none">
                {time}
              </div>

              <div className="mt-6 font-display text-[20px] font-medium tracking-[0.18em] text-white/95">
                {countdown}
              </div>

              <div className="mt-1 text-[10px] tracking-[0.06em] text-white/65">
                remaining
              </div>
            </div>

            {/* Arrow button */}
            <button
              onClick={onOpen}
              className="absolute bottom-6 right-7 flex h-12 w-12 items-center justify-center rounded-full border border-white/45 bg-white/10 backdrop-blur transition active:scale-95"
              aria-label="Open prayer"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}