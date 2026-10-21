"use client";
import type { HeroUser } from "@/lib/home/types";
import { assets } from "@/lib/design/assets";
const QUOTE = "\u201CAnd establish prayer and give zakah.\u201D";
const QUOTE_REF = "Qur\u2019an 2:43";

function formatGregorian(d: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

export function Hero({
  user,
  hijriDate,
  location,
}: {
  user: HeroUser;
  hijriDate: string;
  location: string;
}) {
  const today = formatGregorian(new Date());

  return (
    <header
      className="relative isolate px-5 pb-6 text-white"
      style={{
        paddingTop: 0,
        minHeight: 70,
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none fixed left-1/2 top-0 -z-10 h-[460px] w-screen max-w-[430px] -translate-x-1/2"
        style={{
          backgroundImage: `url(${assets.hero})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Greeting */}
      <div
        className="mt-[100px]"
        style={{ textShadow: "0 2px 12px rgba(0,0,0,0.55)" }}
      >
        <div className="text-[13px] font-medium">Assalamu Alaikum</div>
        <h1 className="mt-0.5 mb-1.5 font-serif text-[38px] font-bold leading-[1.1] tracking-[0.01em]">
          {user.firstName}
        </h1>
        <blockquote className="max-w-[190px] text-[12px] leading-snug">
          &ldquo;And establish prayer and give zakah.&rdquo;
        </blockquote>
        <cite className="block text-[11px] not-italic text-[#e6e2d5]">
          ({QUOTE_REF})
        </cite>
      </div>

      {/* Date + location capsules */}
      <div className="mt-3.5 flex gap-3">
        <div
          className="flex h-[42px] items-center gap-2.5 rounded-2xl px-3.5 text-[11px] leading-tight backdrop-blur-md"
          style={{
            flex: "1.15",
            background: "rgba(32,52,42,0.5)",
            border: "1px solid rgba(255,255,255,0.22)",
            boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
          }}
        >
          <svg className="ic" aria-hidden="true">
            <use href="#i-cal" />
          </svg>
          <div>
            <b className="block text-[12px] font-semibold">{today}</b>
            {hijriDate}
          </div>
        </div>

        <div
          className="flex h-[42px] items-center gap-2.5 rounded-2xl px-3.5 text-[11px] leading-tight backdrop-blur-md"
          style={{
            flex: "0.85",
            background: "rgba(32,52,42,0.5)",
            border: "1px solid rgba(255,255,255,0.22)",
            boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
          }}
        >
          <svg className="ic" aria-hidden="true">
            <use href="#i-sun" />
          </svg>
          <div>
            <b className="block text-[12px] font-semibold">{location}</b>
          </div>
          <svg className="ic ml-auto h-4 w-4" aria-hidden="true">
            <use href="#i-chev" />
          </svg>
        </div>
      </div>
    </header>
  );
}
