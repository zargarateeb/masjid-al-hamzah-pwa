"use client";
import { QIBLA_BG } from "@/lib/images";
import { useEffect, useState } from "react";
import Overlay, {
  GlassCard,
  Star8,
  PrimaryButton,
  SecondaryButton,
} from "../ui/Theme";

const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

const toRad = (d: number) => (d * Math.PI) / 180;
const toDeg = (r: number) => (r * 180) / Math.PI;

function qiblaBearing(lat: number, lng: number): number {
  const φ1 = toRad(lat);
  const φ2 = toRad(KAABA_LAT);
  const Δλ = toRad(KAABA_LNG - lng);
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

function haversine(lat: number, lng: number): number {
  const R = 6371;
  const φ1 = toRad(lat);
  const φ2 = toRad(KAABA_LAT);
  const Δφ = toRad(KAABA_LAT - lat);
  const Δλ = toRad(KAABA_LNG - lng);
  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(a)));
}

export function QiblaOverlay() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [error, setError] = useState("");
  const [heading, setHeading] = useState<number | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Location not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (p) => setCoords({ lat: p.coords.latitude, lng: p.coords.longitude }),
      (e) => setError(e.message || "Location permission denied"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  useEffect(() => {
    const h = (e: DeviceOrientationEvent & { webkitCompassHeading?: number }) => {
      const v = e.webkitCompassHeading ?? (e.alpha ?? null);
      if (v != null) setHeading(v);
    };
    window.addEventListener(
      "deviceorientationabsolute",
      h as EventListener,
      true
    );
    window.addEventListener("deviceorientation", h as EventListener, true);
    return () => {
      window.removeEventListener(
        "deviceorientationabsolute",
        h as EventListener,
        true
      );
      window.removeEventListener("deviceorientation", h as EventListener, true);
    };
  }, []);

  const qibla = coords ? qiblaBearing(coords.lat, coords.lng) : null;
  const distance = coords ? haversine(coords.lat, coords.lng) : null;
  const rotation =
    heading != null && qibla != null ? qibla - heading : qibla ?? 0;

  return (
    <Overlay title="Qibla">
            <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[400px] -z-0"
        style={{
          backgroundImage: `linear-gradient(90deg, var(--color-canvas) 0%, rgba(236,232,222,0.85) 35%, rgba(236,232,222,0.35) 70%, transparent 100%), url(${QIBLA_BG})`,
          backgroundSize: "cover, cover",
          backgroundPosition: "center, center",
          backgroundRepeat: "no-repeat, no-repeat",
        }}
      />
      {error && (
        
        <GlassCard variant="cream" padding="p-4">
          <p className="text-center text-[12.5px] font-medium text-[#e5483d]">
            {error}
          </p>
        </GlassCard>
      )}

      {!coords && !error && (
        <div className="py-24 text-center">
          <div
            className="mx-auto grid h-16 w-16 place-items-center rounded-full animate-pulse"
            style={{
              background: "linear-gradient(135deg,#fdf6e3 0%,#f4ead3 100%)",
              border: "1px solid rgba(201,164,93,0.35)",
            }}
          >
            <Star8 size={20} />
          </div>
          <p className="mt-4 text-[13px] text-ink-muted">Finding your location…</p>
        </div>
      )}

      {coords && (
        <>
          <div
            className="relative mx-auto mb-8"
            style={{ width: 300, height: 300 }}
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(201,164,93,0.18) 0%, transparent 65%)",
              }}
            />

            <div
              className="absolute inset-4 rounded-full"
              style={{
                background:
                  "linear-gradient(160deg, #fbf9f4 0%, #f1ede3 100%)",
                border: "1px solid rgba(201,164,93,0.35)",
                boxShadow:
                  "0 30px 60px -20px rgba(28,52,42,0.28), inset 0 2px 8px rgba(255,255,255,0.6)",
                transform: `rotate(${-1 * (heading ?? 0)}deg)`,
                transition: "transform 200ms ease-out",
              }}
            >
              {Array.from({ length: 72 }).map((_, i) => {
                const big = i % 9 === 0;
                return (
                  <div
                    key={i}
                    className="absolute left-1/2 top-0 origin-bottom"
                    style={{
                      height: 132,
                      transform: `translateX(-50%) rotate(${i * 5}deg)`,
                    }}
                  >
                    <div
                      className="mx-auto w-px"
                      style={{
                        height: big ? 14 : 6,
                        background: big
                          ? "rgba(201,164,93,0.85)"
                          : "rgba(28,74,58,0.25)",
                      }}
                    />
                  </div>
                );
              })}
              <span className="absolute left-1/2 top-5 -translate-x-1/2 font-serif text-[14px] font-bold text-[#8a6b15]">
                N
              </span>
              <span className="absolute right-5 top-1/2 -translate-y-1/2 font-serif text-[12px] font-bold text-ink-muted">
                E
              </span>
              <span className="absolute bottom-5 left-1/2 -translate-x-1/2 font-serif text-[12px] font-bold text-ink-muted">
                S
              </span>
              <span className="absolute left-5 top-1/2 -translate-y-1/2 font-serif text-[12px] font-bold text-ink-muted">
                W
              </span>
            </div>

            <div
              className="absolute inset-4 flex items-start justify-center"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: "transform 300ms cubic-bezier(0.23, 1, 0.32, 1)",
              }}
            >
              <div className="mt-4 flex flex-col items-center">
                <div
                  className="grid h-12 w-12 place-items-center rounded-full"
                  style={{
                    background:
                      "linear-gradient(180deg, #e5b437 0%, #c9a227 55%, #8a6b15 100%)",
                    boxShadow:
                      "0 12px 24px -6px rgba(201,162,39,0.55), 0 0 30px rgba(201,162,39,0.4), inset 0 1px 0 rgba(255,255,255,0.4)",
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="#031a18"
                    aria-hidden="true"
                  >
                    <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" />
                  </svg>
                </div>
                <div
                  className="mt-1 w-1 rounded-b-full"
                  style={{
                    height: 100,
                    background:
                      "linear-gradient(180deg, rgba(201,164,93,0.9), rgba(201,164,93,0))",
                  }}
                />
              </div>
            </div>

            <div
              className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background: "linear-gradient(180deg, #e5b437, #8a6b15)",
                boxShadow: "0 0 12px rgba(201,162,39,0.6)",
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <GlassCard variant="cream" padding="p-5" className="text-center">
              <p className="font-serif text-[28px] font-bold leading-none text-[#8a6b15]">
                {qibla?.toFixed(1)}°
              </p>
              <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.14em] text-ink-muted">
                Qibla bearing
              </p>
            </GlassCard>
            <GlassCard variant="cream" padding="p-5" className="text-center">
              <p className="font-serif text-[28px] font-bold leading-none text-[#8a6b15]">
                {distance}
                <span className="ml-1 text-[13px] font-normal text-ink-muted">
                  km
                </span>
              </p>
              <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.14em] text-ink-muted">
                To Makkah
              </p>
            </GlassCard>
          </div>

          {heading == null && (
            <GlassCard variant="gold" padding="p-4" className="mt-4">
              <p className="text-center text-[12px] leading-relaxed text-[#3a4741]">
                <b className="text-[#8a6b15]">Note:</b> The needle points toward
                Qibla. On desktop, rotate the number from North to find the
                direction.
              </p>
            </GlassCard>
          )}
        </>
      )}
    </Overlay>
  );
}