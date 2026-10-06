'use client';

import { useRef, useState } from 'react';

export default function Tilt3D({
  children,
  intensity = 8,
  className = '',
  as: Tag = 'div',
}: {
  children: React.ReactNode;
  intensity?: number;
  className?: string;
  as?: any;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, pressed: false });

  function handleMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -y * intensity, ry: x * intensity, pressed: tilt.pressed });
  }

  function handleLeave() {
    setTilt({ rx: 0, ry: 0, pressed: false });
  }

  function handleDown() {
    setTilt((t) => ({ ...t, pressed: true }));
  }
  function handleUp() {
    setTilt((t) => ({ ...t, pressed: false }));
  }

  return (
    <Tag
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onMouseDown={handleDown}
      onMouseUp={handleUp}
      className={className}
      style={{
        transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${tilt.pressed ? 0.985 : 1})`,
        transition: tilt.pressed
          ? 'transform 100ms ease-out'
          : 'transform 300ms cubic-bezier(0.23, 1, 0.32, 1)',
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </Tag>
  );
}