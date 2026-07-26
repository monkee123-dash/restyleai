import React, { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export default function BeforeAfterSlider({ beforeImage, afterImage, beforeLabel = "Before", afterLabel = "After", className }) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef(null);
  const draggingRef = useRef(false);

  const updateFromClientX = useCallback((clientX) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  const onPointerDown = (e) => {
    draggingRef.current = true;
    updateFromClientX(e.clientX);
  };
  const onPointerMove = (e) => {
    if (!draggingRef.current) return;
    updateFromClientX(e.clientX);
  };
  const stop = () => { draggingRef.current = false; };

  return (
    <div
      ref={containerRef}
      className={cn("relative select-none overflow-hidden rounded-2xl bg-muted cursor-ew-resize aspect-[4/3] touch-none", className)}
      onMouseDown={onPointerDown}
      onMouseMove={onPointerMove}
      onMouseUp={stop}
      onMouseLeave={stop}
      onTouchStart={(e) => onPointerDown(e.touches[0])}
      onTouchMove={(e) => onPointerMove(e.touches[0])}
      onTouchEnd={stop}
    >
      {/* After (base layer) */}
      <img src={afterImage} alt="After" className="absolute inset-0 h-full w-full object-cover" draggable={false} />
      <span className="absolute bottom-3 right-3 rounded-full bg-black/55 px-3 py-1 text-[11px] font-medium tracking-wide text-white backdrop-blur-sm">
        {afterLabel}
      </span>

      {/* Before (clipped layer) */}
      <div className="absolute inset-0 h-full w-full overflow-hidden" style={{ width: `${position}%` }}>
        <img
          src={beforeImage}
          alt="Before"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ width: containerRef.current?.clientWidth || "100%", maxWidth: "none" }}
          draggable={false}
        />
        <span className="absolute bottom-3 left-3 rounded-full bg-black/55 px-3 py-1 text-[11px] font-medium tracking-wide text-white backdrop-blur-sm">
          {beforeLabel}
        </span>
      </div>

      {/* Handle */}
      <div className="absolute inset-y-0" style={{ left: `${position}%`, transform: "translateX(-50%)" }}>
        <div className="h-full w-0.5 bg-white/90 shadow-[0_0_6px_rgba(0,0,0,0.3)]" />
        <div className="absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-700">
            <path d="M8 6 L4 12 L8 18" />
            <path d="M16 6 L20 12 L16 18" />
          </svg>
        </div>
      </div>
    </div>
  );
}