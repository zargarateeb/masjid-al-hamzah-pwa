"use client";
import { useMemo, useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { DUAS } from "@/lib/data/duas";
import { NAMES_OF_ALLAH } from "@/lib/data/namesOfAllah";
import { NAMES_OF_PROPHET } from "@/lib/data/namesOfProphet";
import { fuzzyScore } from "@/lib/search/fuzzy";

interface SearchResult {
  type: "dua" | "name-allah" | "name-prophet" | "announcement" | "namaz";
  title: string;
  subtitle: string;
  arabic?: string;
  score: number;
  onOpen: () => void;
}

export function SearchOverlay() {
  const popScreen = useAppStore((s) => s.popScreen);
  const pushScreen = useAppStore((s) => s.pushScreen);
  const setTab = useAppStore((s) => s.setTab);
  const setSearchTarget = useAppStore((s) => s.setSearchTarget);

  const [query, setQuery] = useState("");
  const [announcements, setAnnouncements] = useState<{ _id: string; title: string; content: string }[]>([]);
  const [annLoaded, setAnnLoaded] = useState(false);

  useEffect(() => {
    if (annLoaded) return;
    setAnnLoaded(true);
    fetch("/api/announcements", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setAnnouncements(d?.items || []))
      .catch(() => {});
  }, [annLoaded]);

  const q = query.trim();
  const qLen = q.length;

  const results = useMemo<SearchResult[]>(() => {
    if (qLen < 2) return [];
    const out: SearchResult[] = [];

    // Duas
    for (const d of DUAS) {
      const score = Math.max(
        fuzzyScore(q, d.title),
        fuzzyScore(q, d.transliteration),
        fuzzyScore(q, d.english),
        fuzzyScore(q, d.category)
      );
      if (score > 0) {
        out.push({
          type: "dua",
          title: d.title,
          subtitle: `${d.category} · ${d.transliteration}`,
          arabic: d.arabic,
          score,
          onOpen: () => {
            setSearchTarget({ type: "dua", id: d.id });
            popScreen();
            pushScreen("duas");
          },
        });
      }
    }

    // Names of Allah
    for (const n of NAMES_OF_ALLAH) {
      const score = Math.max(
        fuzzyScore(q, n.transliteration),
        fuzzyScore(q, n.english),
        fuzzyScore(q, n.arabic)
      );
      if (score > 0) {
        out.push({
          type: "name-allah",
          title: n.transliteration,
          subtitle: `Allah · ${n.english}`,
          arabic: n.arabic,
          score,
          onOpen: () => {
            setSearchTarget({ type: "name-allah", id: n.id });
            popScreen();
            pushScreen("names-of-allah");
          },
        });
      }
    }

    // Names of Prophet
    for (const p of NAMES_OF_PROPHET) {
      const score = Math.max(
        fuzzyScore(q, p.transliteration),
        fuzzyScore(q, p.english),
        fuzzyScore(q, p.arabic)
      );
      if (score > 0) {
        out.push({
          type: "name-prophet",
          title: p.transliteration,
          subtitle: `Prophet ﷺ · ${p.english}`,
          arabic: p.arabic,
          score,
          onOpen: () => {
            setSearchTarget({ type: "name-prophet", id: p.id });
            popScreen();
            pushScreen("names-of-prophet");
          },
        });
      }
    }

    // Announcements
    for (const a of announcements) {
      const score = Math.max(
        fuzzyScore(q, a.title),
        fuzzyScore(q, a.content)
      );
      if (score > 0) {
        out.push({
          type: "announcement",
          title: a.title,
          subtitle: a.content.slice(0, 60) + (a.content.length > 60 ? "…" : ""),
          score,
          onOpen: () => {
            popScreen();
            pushScreen("announcements");
          },
        });
      }
    }

    // Namaz (prayer times) — matches common prayer names
    const NAMAZ_MATCHES = [
      { name: "Fajr", arabic: "الفجر", note: "Dawn prayer" },
      { name: "Dhuhr", arabic: "الظهر", note: "Noon prayer" },
      { name: "Asr", arabic: "العصر", note: "Afternoon prayer" },
      { name: "Maghrib", arabic: "المغرب", note: "Sunset prayer" },
      { name: "Isha", arabic: "العشاء", note: "Night prayer" },
      { name: "Jumu'ah", arabic: "الجمعة", note: "Friday congregational prayer" },
    ];
    for (const nm of NAMAZ_MATCHES) {
      const score = Math.max(
        fuzzyScore(q, nm.name),
        fuzzyScore(q, nm.arabic),
        fuzzyScore(q, "namaz"),
        fuzzyScore(q, "prayer"),
        fuzzyScore(q, nm.note)
      );
      if (score > 0) {
        out.push({
          type: "namaz",
          title: nm.name,
          subtitle: `Namaz · ${nm.note}`,
          arabic: nm.arabic,
          score,
          onOpen: () => {
            popScreen();
            setTab("prayer");
          },
        });
      }
    }

    // Sort by score descending
    out.sort((a, b) => b.score - a.score);

    return out.slice(0, 50);
  }, [q, qLen, announcements, popScreen, pushScreen, setTab, setSearchTarget]);

  const typeLabel: Record<SearchResult["type"], string> = {
    dua: "Dua",
    "name-allah": "Allah",
    "name-prophet": "Prophet ﷺ",
    announcement: "News",
    namaz: "Namaz",
  };

  const typeColor: Record<SearchResult["type"], string> = {
    dua: "#6f9b7f",
    "name-allah": "#c9a45d",
    "name-prophet": "#b87333",
    announcement: "#4b7a9c",
    namaz: "#2f6350",
  };

  return (
    <div className="px-4 pt-4 pb-28">
      <div className="mb-5 flex items-center gap-3">
        <button
          type="button"
          onClick={popScreen}
          aria-label="Back"
          className="grid h-10 w-10 place-items-center rounded-full bg-white/70 text-forest ring-1 ring-white/70"
        >
          <svg className="ic" style={{ transform: "rotate(180deg)" }} aria-hidden="true">
            <use href="#i-chev" />
          </svg>
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 rounded-full bg-white/70 px-4 py-2.5 ring-1 ring-white/70">
            <svg className="ic text-forest/60" style={{ width: 18, height: 18 }} aria-hidden="true">
              <use href="#i-search" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search duas, names, namaz, announcements…"
              className="w-full bg-transparent text-[14px] text-ink outline-none placeholder:text-ink-muted/60"
              autoFocus
            />
          </div>
        </div>
      </div>

      {qLen === 0 && (
        <div className="py-12 text-center">
          <p className="font-serif text-[16px] font-bold text-ink">Search the app</p>
          <p className="mt-1 text-[12px] text-ink-muted">
            Duas, names, namaz, announcements. Typo-tolerant.
          </p>
        </div>
      )}

      {qLen === 1 && (
        <p className="py-6 text-center text-[12px] text-ink-muted">
          Type at least 2 characters…
        </p>
      )}

      {qLen >= 2 && results.length === 0 && (
        <div className="py-12 text-center">
          <p className="font-serif text-[15px] font-bold text-ink">
            No results for "{query}"
          </p>
          <p className="mt-1 text-[12px] text-ink-muted">
            Try a shorter word or check the spelling.
          </p>
        </div>
      )}

      {results.length > 0 && (
        <>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-muted">
            {results.length} result{results.length === 1 ? "" : "s"}
          </p>
          <ul className="space-y-2">
            {results.map((r, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={r.onOpen}
                  className="flex w-full items-start gap-3 rounded-[18px] bg-white/85 p-3 text-left ring-1 ring-white/70 shadow-sm transition active:scale-[0.99]"
                >
                  <span
                    className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-white shrink-0 mt-0.5"
                    style={{ background: typeColor[r.type] }}
                  >
                    {typeLabel[r.type]}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-serif text-[14px] font-semibold text-ink">
                      {r.title}
                    </span>
                    <span className="mt-0.5 block truncate text-[11.5px] text-ink-muted">
                      {r.subtitle}
                    </span>
                    {r.arabic && (
                      <span
                        dir="rtl"
                        className="mt-1 block truncate font-arabic text-[13px] text-forest"
                      >
                        {r.arabic}
                      </span>
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}