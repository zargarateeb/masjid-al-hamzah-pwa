"use client";
import { useEffect } from "react";

export function InstallCapture() {
  useEffect(() => {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;
  // Skip on localhost dev — SW caches stale builds and breaks debugging
  if (location.hostname === "localhost" || location.hostname === "127.0.0.1") return;

  navigator.serviceWorker
    .register("/sw.js", { scope: "/" })
    .then((reg) => {
      console.log("SW registered:", reg.scope);
    })
    .catch((err) => console.warn("SW registration failed:", err));
}, []);
  useEffect(() => {
    const w = window as any;
    if (typeof w.__pwaInstallPrompt === "undefined") {
      w.__pwaInstallPrompt = null;
    }
    if (typeof w.__pwaInstalled === "undefined") {
      w.__pwaInstalled = false;
    }

    const onPrompt = (e: Event) => {
      e.preventDefault();
      w.__pwaInstallPrompt = e;
      window.dispatchEvent(new Event("pwa-install-available"));
    };
    const onInstalled = () => {
      w.__pwaInstalled = true;
      window.dispatchEvent(new Event("pwa-installed"));
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);

    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true
    ) {
      w.__pwaInstalled = true;
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  return null;
}