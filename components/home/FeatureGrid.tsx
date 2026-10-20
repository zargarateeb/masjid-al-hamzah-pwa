"use client";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { assets } from "@/lib/design/assets";
import { useAppStore } from "@/lib/store";

interface Feature {
  title: string;
  subtitle: string;
  image: string;
  onOpen: () => void;
}

export function FeatureGrid() {
  const pushScreen = useAppStore((s) => s.pushScreen);
  const setTab = useAppStore((s) => s.setTab);

  const items: Feature[] = [
    {
      title: "Qibla",
      subtitle: "Find Direction",
      image: assets.qibla,
      onOpen: () => pushScreen("qibla"),
    },
    {
      title: "Tasbeeh",
      subtitle: "Keep Remembrance",
      image: assets.tasbeeh,
      onOpen: () => setTab("tasbeeh"),
    },
    {
      title: "Duas",
      subtitle: "Supplications",
      image: assets.duas,
      onOpen: () => pushScreen("duas"),
    },
    {
      title: "Names of Allah",
      subtitle: "99 Beautiful Names",
      image: assets.names,
      onOpen: () => pushScreen("names-of-allah"),
    },
  ];

  return (
    <section className="grid grid-cols-2 gap-3">
      {items.map((f) => (
        <button
          key={f.title}
          type="button"
          onClick={f.onOpen}
          className="group relative h-[65px] overflow-hidden rounded-[20px] bg-card text-left ring-1 ring-divider/60 shadow-[0_6px_16px_-8px_rgba(23,75,59,0.25)]"
        >
          {/* Photo — right half, fades to cream on the left */}
          <div className="absolute inset-y-0 right-0 w-1/2">
            <Image
              src={f.image}
              alt=""
              fill
              sizes="200px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-card via-card/40 to-transparent" />
          </div>

          {/* Text — pinned to left extreme */}
          <div className="relative flex h-full items-center pl-3 pr-2">
            <div className="min-w-0">
              <p className="truncate font-serif text-[14px] leading-tight text-forest">
                {f.title}
              </p>
              <p className="mt-0.5 truncate text-[10px] leading-tight text-ink-muted">
                {f.subtitle}
              </p>
            </div>
            <ChevronRight
              size={14}
              className="ml-auto shrink-0 text-forest/50"
            />
          </div>
        </button>
      ))}
    </section>
  );
}