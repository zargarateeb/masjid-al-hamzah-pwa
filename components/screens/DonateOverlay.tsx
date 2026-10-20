"use client";
import { useState } from "react";
import { DONATE_HERO } from "@/lib/images";
import Overlay, { GlassCard, Kicker, PrimaryButton } from "../ui/Theme";
import { BANK_DETAILS } from "@/lib/constants";

function Row({
  label,
  value,
  canCopy,
  copyKey,
  copied,
  onCopy,
}: {
  label: string;
  value: string;
  canCopy?: boolean;
  copyKey?: string;
  copied: string | null;
  onCopy: (value: string, key: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-divider/50 py-3 last:border-b-0">
      <div className="min-w-0">
        <Kicker>{label}</Kicker>
        <p className="mt-0.5 truncate font-serif text-[15px] font-semibold text-ink">
          {value}
        </p>
      </div>
      {canCopy && copyKey && (
        <button
          type="button"
          onClick={() => onCopy(value, copyKey)}
          className="shrink-0 rounded-full border border-[#c9a45d]/50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#8a6b15] transition active:scale-95"
        >
          {copied === copyKey ? "✓ Copied" : "Copy"}
        </button>
      )}
    </div>
  );
}

export default function DonateScreen() {
  const [copied, setCopied] = useState<string | null>(null);

  function copy(value: string, key: string) {
    if (typeof navigator === "undefined") return;
    navigator.clipboard.writeText(value).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    });
  }

    return (
    <Overlay title="Support Our Masjid">
      <div
        className="relative mb-5 h-[180px] overflow-hidden rounded-[22px] ring-1 ring-white/70 shadow-[0_18px_38px_-18px_rgba(28,52,42,0.38)]"
        style={{
          backgroundImage: `linear-gradient(90deg, var(--color-canvas) 0%, rgba(236,232,222,0.85) 40%, transparent 100%), url(${DONATE_HERO})`,
          backgroundSize: "cover, cover",
          backgroundPosition: "center, center",
          backgroundRepeat: "no-repeat, no-repeat",
        }}
      >
              <div
        className="relative mb-5 h-[200px] overflow-hidden rounded-[22px] ring-1 ring-white/70 shadow-[0_18px_38px_-18px_rgba(28,52,42,0.38)]"
        style={{
          backgroundImage: `linear-gradient(90deg, var(--color-canvas) 0%, rgba(236,232,222,0.85) 40%, transparent 100%), url(${DONATE_HERO})`,
          backgroundSize: "cover, cover",
          backgroundPosition: "center, center",
          backgroundRepeat: "no-repeat, no-repeat",
        }}
      >
        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8a6b15]">
            Support Our Masjid
          </p>
          <p className="mt-1 font-serif text-[20px] font-bold leading-tight text-ink">
            Your contribution fuels our community
          </p>
        </div>
      </div>
      </div>

      <div className="mb-5 text-center">
        <p className="font-serif text-[22px] font-bold text-ink">
          Support Our Masjid
        </p>
        <p className="mt-1 text-[12px] text-ink-muted">
          Your contribution fuels our community
        </p>
      </div>

      <GlassCard variant="gold" padding="p-5">
        <Kicker className="mb-3">Bank Details</Kicker>
        <Row
          label="Account holder"
          value={BANK_DETAILS.holder}
          copied={copied}
          onCopy={copy}
        />
        <Row
          label="Account number"
          value={BANK_DETAILS.accountNumber}
          canCopy
          copyKey="acc"
          copied={copied}
          onCopy={copy}
        />
        <Row
          label="IFSC code"
          value={BANK_DETAILS.ifsc}
          canCopy
          copyKey="ifsc"
          copied={copied}
          onCopy={copy}
        />
        <Row label="Bank" value={BANK_DETAILS.bank} copied={copied} onCopy={copy} />
      </GlassCard>

      <div className="mt-4">
        <PrimaryButton
          onClick={() =>
            copy(
              `${BANK_DETAILS.holder}\n${BANK_DETAILS.accountNumber}\nIFSC: ${BANK_DETAILS.ifsc}\n${BANK_DETAILS.bank}`,
              "all"
            )
          }
        >
          {copied === "all" ? "✓ Copied" : "Copy All Details"}
        </PrimaryButton>
      </div>

      <GlassCard variant="cream" padding="p-4" className="mt-5">
        <p className="text-[12.5px] leading-relaxed text-[#3a4741]">
          🤲 &ldquo;The example of those who spend their wealth in the way of
          Allah is like a seed which grows seven spikes; in each spike is a
          hundred grains.&rdquo; — Qur&apos;an 2:261
        </p>
      </GlassCard>
    </Overlay>
  );
}