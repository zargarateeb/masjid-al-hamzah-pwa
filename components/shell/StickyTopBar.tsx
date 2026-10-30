"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { assets } from "@/lib/design/assets";

export function StickyTopBar() {
  const [scrolled, setScrolled] = useState(false);
  const pushScreen = useAppStore((s) => s.pushScreen);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="sticky top-0 z-30 transition-all duration-300"
      style={{
        paddingTop: "calc(env(safe-area-inset-top, 0px) + 16px)",
        paddingBottom: 12,
        backgroundColor: scrolled ? "rgba(250, 248, 243, 0.55)" : "transparent",
        backdropFilter: scrolled ? "blur(20px) saturate(1.4)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px) saturate(1.4)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(28, 74, 58, 0.12)"
          : "1px solid transparent",
        boxShadow: scrolled
          ? "0 4px 14px -8px rgba(20, 40, 32, 0.2)"
          : "none",
      }}
    >
      <div className="mx-auto flex w-full max-w-[430px] items-center gap-3 px-5">
        <div className="flex items-center gap-3">
          <div
            className="relative h-[44px] w-[44px] overflow-hidden rounded-full"
            style={{
              border: "2px solid rgba(222,198,128,0.95)",
              boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
            }}
          >
            <Image
              src={assets.logo}
              alt="Masjid Al-Hamzah logo"
              fill
              sizes="44px"
              className="object-cover"
              priority
            />
          </div>
          <div>
            <div
              className={`text-[12px] font-semibold tracking-[0.15em] transition-colors ${
                scrolled ? "text-ink" : "text-white"
              }`}
              style={
                !scrolled
                  ? { textShadow: "0 1px 6px rgba(0,0,0,0.5)" }
                  : undefined
              }
            >
              MASJID AL-HAMZAH
            </div>
            <div
              className={`mt-0.5 text-[11px] transition-colors ${
                scrolled ? "text-ink-muted" : "text-[#ebe7da]"
              }`}
              style={
                !scrolled
                  ? { textShadow: "0 1px 6px rgba(0,0,0,0.5)" }
                  : undefined
              }
            >
              Buchpora, Srinagar
            </div>
          </div>
        </div>

        <div className="ml-auto flex gap-2.5">
          <button
            type="button"
            aria-label="Search"
            onClick={() => pushScreen("search")}
            className={`grid h-9 w-9 place-items-center rounded-full transition ${
              scrolled
                ? "bg-forest/10 text-forest"
                : "text-white"
            }`}
            style={
              !scrolled
                ? {
                    background: "rgba(255,255,255,0.2)",
                    border: "1px solid rgba(255,255,255,0.34)",
                    WebkitBackdropFilter: "blur(10px)",
                  }
                : undefined
            }
          >
            <svg className="ic" aria-hidden="true">
              <use href="#i-search" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Notifications"
            onClick={() => pushScreen("announcements")}
            className={`relative grid h-9 w-9 place-items-center rounded-full transition ${
              scrolled
                ? "bg-forest/10 text-forest"
                : "text-white"
            }`}
            style={
              !scrolled
                ? {
                    background: "rgba(255,255,255,0.2)",
                    border: "1px solid rgba(255,255,255,0.34)",
                    WebkitBackdropFilter: "blur(10px)",
                  }
                : undefined
            }
          >
            <svg className="ic" aria-hidden="true">
              <use href="#i-bell" />
            </svg>
            <span
              aria-hidden="true"
              className="absolute right-[8px] top-[7px] h-[6px] w-[6px] rounded-full bg-[#e5483d]"
              style={{ boxShadow: "0 0 0 1.5px rgba(255,255,255,0.6)" }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}