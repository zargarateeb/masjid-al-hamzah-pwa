"use client";
import { useState } from "react";
import Overlay from "../ui/Theme";
import { GlassCard, Star8, PrimaryButton } from "../ui/Theme";
import { useAppStore } from "@/lib/store";

export default function AdminPinScreen() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const push = useAppStore((s) => s.pushScreen);
  const pop = useAppStore((s) => s.popScreen);

  async function submit() {
    if (pin.length < 4) {
      setError("Enter at least 4 digits");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      const data = await res.json();
      if (data.ok) {
        sessionStorage.setItem("admin_pin", pin);
        pop();
        push("admin");
      } else {
        setError("Incorrect PIN");
        setPin("");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Overlay title="Admin Access">
      <div className="mx-auto max-w-[340px]">
        <GlassCard variant="cream" padding="p-6" className="text-center">
          <div
            className="mx-auto grid h-16 w-16 place-items-center rounded-full"
            style={{
              background: "linear-gradient(135deg,#fdf6e3 0%,#f4ead3 100%)",
              border: "1px solid rgba(201,164,93,0.35)",
            }}
          >
            <Star8 size={26} color="#C9A45D" />
          </div>
          <p className="mt-4 font-serif text-[20px] font-bold text-ink">
            Enter PIN
          </p>
          <p className="mt-1 text-[12px] text-ink-muted">
            Only authorized admins can proceed.
          </p>

          <input
            value={pin}
            onChange={(e) => {
              setPin(e.target.value.replace(/\D/g, "").slice(0, 8));
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            type="password"
            inputMode="numeric"
            autoFocus
            placeholder="••••"
            className="mt-6 w-full rounded-2xl bg-white/80 px-4 py-4 text-center font-serif text-[26px] tracking-[0.5em] text-ink outline-none ring-1 ring-divider/50 focus:ring-forest/40"
          />

          {error && (
            <p className="mt-3 text-center text-[12px] font-medium text-[#e5483d]">
              {error}
            </p>
          )}

          <div className="mt-5">
            <PrimaryButton onClick={submit} disabled={loading}>
              {loading ? "Verifying…" : "Verify PIN"}
            </PrimaryButton>
          </div>
        </GlassCard>
      </div>
    </Overlay>
  );
}