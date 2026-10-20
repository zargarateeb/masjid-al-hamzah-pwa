"use client";
import { MASJID_HERO } from "@/lib/images";
import Overlay, {
  GlassCard,
  Star8,
  Kicker,
} from "../ui/Theme";

interface Member {
  role: string;
  name: string;
  nameUr?: string;
  phone?: string;
  email?: string;
}

const IMAM = {
  name: "Hazrat Zafarullah Sahab",
  nameUr: "حضرت ظفر اللہ صاحب",
};

const COMMITTEE: Member[] = [
  {
    role: "President",
    name: "Mohtaram Ghulam Qadir Lankar Sahab",
    nameUr: "محترم غلام قادر لنکر صاحب",
  },
  {
    role: "Vice President",
    name: "Mohtaram Riyaz Ahmad Dar Sahab",
    nameUr: "محترم ریاض احمد دار صاحب",
  },
  {
    role: "Secretary",
    name: "To be appointed",
    nameUr: "تقرری باقی ہے",
  },
  {
    role: "Treasurer",
    name: "To be appointed",
    nameUr: "تقرری باقی ہے",
  },
];

const MEMBERS: Member[] = [];

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <Star8 size={12} />
      <Kicker>{label}</Kicker>
    </div>
  );
}

function isVacant(name: string) {
  return name === "To be appointed";
}

export function OurMasjidOverlay() {
  return (
    <Overlay title="Our Masjid">
            <div className="relative mb-6 overflow-hidden rounded-[22px] ring-1 ring-white/70 shadow-[0_18px_38px_-18px_rgba(28,52,42,0.38)]">
        <div className="relative h-[260px]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${MASJID_HERO})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(0deg, rgba(20,52,39,0.95) 0%, rgba(20,52,39,0.35) 60%, transparent 100%), linear-gradient(90deg, rgba(20,52,39,0.35) 0%, transparent 50%)",
            }}
          />
        </div>

        <div className="absolute inset-x-0 bottom-0 p-6">
          <div className="mb-3 flex items-center gap-2">
            <Star8 size={14} />
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#dec680]">
              The House of Allah
            </p>
          </div>
          <p className="font-serif text-[26px] font-bold leading-tight text-white">
            Masjid Al-Hamzah
          </p>
          <p className="mt-2 text-[13px] text-white/85">
            HajiBagh, Buchpora, Srinagar
          </p>
          <p className="mt-1 text-[12px] text-white/70">Imam: {IMAM.name}</p>
        </div>
      </div>
            <SectionHeader label="Imam" />
      <div className="mb-6">
        <GlassCard variant="gold" padding="p-5">
          <div className="flex items-center gap-4">
            <div
              aria-hidden="true"
              className="grid h-16 w-16 shrink-0 place-items-center rounded-full font-serif text-[22px] font-semibold text-white"
              style={{
                background: "linear-gradient(160deg, #c9a45d 0%, #8a6b15 100%)",
                boxShadow: "0 8px 20px -6px rgba(201,164,93,0.55)",
              }}
            >
              {IMAM.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <Kicker className="text-[#8a6b15]">Imam</Kicker>
              <p className="mt-1 font-serif text-[17px] font-semibold text-ink">
                {IMAM.name}
              </p>
              {IMAM.nameUr && (
                <p
                  dir="rtl"
                  className="mt-0.5 font-arabic text-[15px] leading-relaxed text-[#3a4741]"
                >
                  {IMAM.nameUr}
                </p>
              )}
            </div>
          </div>
        </GlassCard>
      </div>

      <SectionHeader label="Committee" />
      <div className="mb-6 space-y-3">
        {COMMITTEE.map((m) => {
          const vacant = isVacant(m.name);
          return (
            <GlassCard key={m.role} variant="cream" padding="p-4">
              <div className="flex items-center gap-3.5">
                <div
                  aria-hidden="true"
                  className="grid h-14 w-14 shrink-0 place-items-center rounded-full font-serif text-[20px] font-semibold text-white"
                  style={{
                    background:
                      "linear-gradient(160deg, #c9a45d 0%, #a8855c 100%)",
                    boxShadow: "0 6px 14px -4px rgba(201,164,93,0.5)",
                  }}
                >
                  {vacant ? "·" : m.name[0]?.toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <Kicker>{m.role}</Kicker>
                  <p
                    className={`mt-0.5 font-serif text-[16px] font-semibold ${
                      vacant ? "italic text-ink-muted" : "text-ink"
                    }`}
                  >
                    {m.name}
                  </p>
                  {m.nameUr && (
                    <p
                      dir="rtl"
                      className={`mt-0.5 font-arabic text-[15px] leading-relaxed ${
                        vacant ? "text-ink-muted" : "text-[#3a4741]"
                      }`}
                    >
                      {m.nameUr}
                    </p>
                  )}
                  {m.phone && (
                    <a
                      href={`tel:${m.phone}`}
                      aria-label={`Call ${m.name}`}
                      className="mt-1 block truncate text-[12px] text-forest"
                    >
                      {m.phone}
                    </a>
                  )}
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {MEMBERS.length > 0 && (
        <>
          <SectionHeader label="Members" />
          <div className="space-y-2">
            {MEMBERS.map((m) => (
              <GlassCard key={m.name} variant="cream" padding="p-3.5">
                <p className="font-serif text-[14px] font-semibold text-ink">
                  {m.name}
                </p>
                {m.nameUr && (
                  <p
                    dir="rtl"
                    className="font-arabic text-[14px] leading-relaxed text-[#3a4741]"
                  >
                    {m.nameUr}
                  </p>
                )}
                {m.role && (
                  <p className="text-[11px] text-ink-muted">{m.role}</p>
                )}
              </GlassCard>
            ))}
          </div>
        </>
      )}

      <GlassCard variant="cream" padding="p-4" className="mt-6">
        <p className="text-[12.5px] leading-relaxed text-[#3a4741]">
          Serving the HajiBagh community — daily prayers, Jumu&apos;ah, madrasah
          classes, and janazah services.
        </p>
      </GlassCard>
    </Overlay>
  );
}