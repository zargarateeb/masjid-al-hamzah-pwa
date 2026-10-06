'use client';

import { useAppStore, Tab } from '@/lib/store';
import { Home, Moon, Circle, Grid3x3 } from 'lucide-react';

const tabs: { key: Tab; label: string; icon: any }[] = [
  { key: 'home', label: 'Home', icon: Home },
  { key: 'prayer', label: 'Prayer', icon: Moon },
  { key: 'tasbeeh', label: 'Tasbeeh', icon: Circle },
  { key: 'more', label: 'More', icon: Grid3x3 },
];

export default function BottomNav() {
  const activeTab = useAppStore((s) => s.activeTab);
  const setTab = useAppStore((s) => s.setTab);

  return (
    <nav className="pointer-events-auto fixed bottom-5 left-1/2 z-40 w-[calc(100%-32px)] max-w-[440px] -translate-x-1/2">
      <div
        className="flex items-center justify-around rounded-pill px-2 py-2"
        style={{
          background:
            'linear-gradient(180deg, #17415A 0%, #0B2A3E 60%, #061B28 100%)',
          boxShadow:
            '0 1px 0 rgba(255,255,255,0.14) inset, 0 -2px 8px rgba(0,0,0,0.45) inset, 0 20px 40px -12px rgba(11,42,62,0.6), 0 6px 16px -6px rgba(0,0,0,0.3)',
        }}
      >
        {tabs.map(({ key, label, icon: Icon }) => {
          const active = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setTab(key)}
              className="flex flex-1 flex-col items-center gap-0.5 py-1.5"
            >
              <div
                className="flex h-11 w-14 items-center justify-center rounded-pill transition-all duration-200"
                style={
                  active
                    ? {
                        background:
                          'linear-gradient(180deg, #2E7A56 0%, #1B5E3F 60%, #0F3D28 100%)',
                        boxShadow:
                          '0 1px 0 rgba(255,255,255,0.20) inset, 0 -2px 6px rgba(0,0,0,0.35) inset, 0 6px 14px -4px rgba(27,94,63,0.55)',
                        color: 'white',
                      }
                    : { color: 'rgba(255,255,255,0.55)' }
                }
              >
                <Icon size={18} strokeWidth={2} />
              </div>
              <span
                className="text-[10px] font-medium tracking-wide"
                style={{
                  color: active ? '#fff' : 'rgba(255,255,255,0.55)',
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}