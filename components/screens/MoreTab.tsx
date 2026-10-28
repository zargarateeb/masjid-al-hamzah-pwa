"use client";
import { useAppStore, type OverlayScreen } from "@/lib/store";
import { Star8, OrnamentDivider, Kicker } from "../ui/Theme";
import { TILE_IMAGES } from "@/lib/images";

interface MenuItem {
  screen: OverlayScreen;
  label: string;
  sub: string;
  icon: React.ReactNode;
  accent: string;
}

export function MoreTab() {
  const push = useAppStore((s) => s.pushScreen);

  const items: MenuItem[] = [
    {
      screen: "names-of-allah",
      label: "99 Names of Allah",
      sub: "Asmā ul-Husnā",
      accent: "#2e7a56",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" />
        </svg>
      ),
    },
    {
      screen: "names-of-prophet",
      label: "Names of Prophet ﷺ",
      sub: "Asmā un-Nabi",
      accent: "#b87333",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M12 3c-1 2-3 3-3 5 0 1 .5 2 1.5 2.5C9 11 8 12.5 8 14v7h8v-7c0-1.5-1-3-2.5-3.5C14.5 10 15 9 15 8c0-2-2-3-3-5z" />
        </svg>
      ),
    },
    {
      screen: "duas",
      label: "Supplications",
      sub: "100+ Duas",
      accent: "#7a6b9b",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M12 21s-6-4-6-10a6 6 0 0 1 12 0c0 6-6 10-6 10z" />
        </svg>
      ),
    },
    {
      screen: "qibla",
      label: "Qibla",
      sub: "Live direction",
      accent: "#4b7a9c",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <polygon points="12 4 15 12 12 20 9 12" fill="currentColor" />
        </svg>
      ),
    },
    {
      screen: "our-masjid",
      label: "Our Masjid",
      sub: "Committee & info",
      accent: "#2e7a56",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M4 21V11a8 8 0 0 1 16 0v10" />
          <path d="M4 21h16M12 3v3M9 21v-4h6v4" />
        </svg>
      ),
    },
    {
      screen: "announcements",
      label: "Announcements",
      sub: "Latest updates",
      accent: "#2e7a56",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M3 11v2a1 1 0 0 0 1 1h2l4 4V6L6 10H4a1 1 0 0 0-1 1z" />
          <path d="M16 8a5 5 0 0 1 0 8" />
        </svg>
      ),
    },
    {
      screen: "debate",
      label: "Debate",
      sub: "Community discussions",
      accent: "#7a6b9b",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
    {
      screen: "donate",
      label: "Donate",
      sub: "Support the masjid",
      accent: "#b87333",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
    },
    {
      screen: "settings",
      label: "Settings",
      sub: "Account & admin",
      accent: "#4b7a9c",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
    },
    {
      screen: "profile",
      label: "Profile",
      sub: "Your account",
      accent: "#6f9b7f",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
      ),
    },
  ];

  return (
    <div className="px-4 pt-6 pb-28">
      <div className="mb-5">
        <Kicker>Menu</Kicker>
        <h1 className="mt-1 font-serif text-[32px] font-bold leading-none text-ink">
          More
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-3.5">
        {items.map((item) => (
          <button
            key={item.screen}
            type="button"
            onClick={() => push(item.screen)}
            className="relative h-[150px] overflow-hidden rounded-[24px] transition active:scale-[0.97]"
            style={{
              boxShadow: `
                0 12px 24px -8px rgba(28, 52, 42, 0.32),
                0 4px 8px -2px rgba(28, 52, 42, 0.15)
              `,
            }}
          >
            {/* Full-bleed photo */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage: `url(${TILE_IMAGES[item.screen] || ""})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />

            {/* Thin inner ring for clay depth */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-[24px]"
              style={{
                boxShadow: `
                  inset 0 2px 4px rgba(255, 255, 255, 0.35),
                  inset 0 -2px 6px rgba(0, 0, 0, 0.28)
                `,
              }}
            />

            {/* Clay icon square — top-left */}
            <span
              className="absolute left-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-[14px]"
              style={{
                background:
                  "linear-gradient(145deg, #fefcf7 0%, #ebe5d6 100%)",
                color: item.accent,
                boxShadow: `
                  inset 2px 2px 5px rgba(255, 255, 255, 0.9),
                  inset -2px -2px 5px rgba(180, 170, 150, 0.25),
                  0 4px 8px -2px rgba(0, 0, 0, 0.35)
                `,
              }}
            >
              {item.icon}
            </span>

            {/* Clay text pill — bottom-left, floats over photo */}
            <div
              className="absolute bottom-3 left-3 right-3 z-10 rounded-[14px] px-3 py-2"
              style={{
                background:
                  "linear-gradient(145deg, #fefcf7 0%, #ebe5d6 100%)",
                boxShadow: `
                  inset 2px 2px 5px rgba(255, 255, 255, 0.9),
                  inset -2px -2px 5px rgba(180, 170, 150, 0.25),
                  0 6px 12px -4px rgba(0, 0, 0, 0.35)
                `,
              }}
            >
              <p className="truncate font-serif text-[13px] font-semibold leading-tight text-ink">
                {item.label}
              </p>
              <p className="mt-0.5 truncate text-[9.5px] font-medium uppercase tracking-[0.12em] text-ink-muted">
                {item.sub}
              </p>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8">
        <OrnamentDivider />
      </div>

      <div className="mt-6 text-center">
        <div className="mb-2 flex justify-center">
          <Star8 size={12} />
        </div>
        <Kicker>Developed by Ateeb</Kicker>
        <div className="mt-2 flex items-center justify-center gap-4 text-[12px] text-ink-muted">
          <a
            href="https://www.linkedin.com/in/ateeb-zargar-890022386?utm_source=share_via&utm_content=profile&utm_medium=member_android"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-forest"
          >
            LinkedIn
          </a>
          <span className="text-divider">·</span>
          <a
            href="https://github.com/zargarateeb"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-forest"
          >
            GitHub
          </a>
          <span className="text-divider">·</span>
          <a href="mailto:zargarateeb4@gmail.com" className="hover:text-forest">
            Email
          </a>
        </div>
      </div>
    </div>
  );
}