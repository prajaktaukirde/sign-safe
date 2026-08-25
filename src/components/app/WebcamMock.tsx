import { useEffect, useRef } from "react";

/** Simulated webcam feed with animated MediaPipe-style hand skeleton overlay. */
export function WebcamMock({ active }: { active: boolean }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    const start = performance.now();

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const r = canvas.getBoundingClientRect();
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = (now: number) => {
      const t = ((now - start) / 1000) * (active ? 1.8 : 0.8);
      const r = canvas.getBoundingClientRect();
      const w = r.width;
      const h = r.height;
      ctx.clearRect(0, 0, w, h);

      // scanning line
      const scanY = ((Math.sin(t * 0.7) + 1) / 2) * h;
      const grad = ctx.createLinearGradient(0, scanY - 40, 0, scanY + 40);
      grad.addColorStop(0, "rgba(0,102,255,0)");
      grad.addColorStop(0.5, "rgba(0,102,255,0.18)");
      grad.addColorStop(1, "rgba(0,102,255,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, scanY - 40, w, 80);

      const drawHand = (ox: number, oy: number, phase: number, color: string) => {
        const scale = Math.min(w, h) / 240;
        const wrist: [number, number] = [ox, oy];
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        for (let f = 0; f < 5; f++) {
          const baseAng = -Math.PI / 2 + (f - 2) * 0.34;
          const wiggle = Math.sin(t * 2.4 + phase + f * 0.7) * 0.16;
          let px = wrist[0];
          let py = wrist[1];
          const segs = 3;
          for (let sIdx = 0; sIdx < segs; sIdx++) {
            const len = (26 - sIdx * 6) * scale;
            const ang = baseAng + wiggle * (sIdx + 1);
            const nx = px + Math.cos(ang) * len;
            const ny = py + Math.sin(ang) * len;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(nx, ny);
            ctx.stroke();
            ctx.fillStyle = "#FF9500";
            ctx.beginPath();
            ctx.arc(nx, ny, 3, 0, Math.PI * 2);
            ctx.fill();
            px = nx;
            py = ny;
          }
        }
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(wrist[0], wrist[1], 5, 0, Math.PI * 2);
        ctx.fill();
      };

      const cx = w / 2;
      const cy = h * 0.72;
      drawHand(cx - w * 0.16 + Math.sin(t) * 8, cy + Math.cos(t * 1.3) * 10, 0, "#0066FF");
      drawHand(cx + w * 0.16 + Math.sin(t + 1.4) * 8, cy + Math.cos(t * 1.1 + 1) * 10, 2, "#4D9BFF");

      // face bounding box
      const bx = cx - 46;
      const by = h * 0.16 + Math.sin(t * 0.9) * 4;
      ctx.strokeStyle = "rgba(0,102,255,0.8)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 5]);
      ctx.strokeRect(bx, by, 92, 100);
      ctx.setLineDash([]);
      ctx.fillStyle = "rgba(0,102,255,0.85)";
      ctx.font = "11px Outfit, sans-serif";
      ctx.fillText("face 0.99", bx, by - 6);

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [active]);

  return (
    <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl border border-white/10 bg-[linear-gradient(140deg,rgba(20,22,54,0.95),rgba(12,12,30,0.98))]">
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:repeating-linear-gradient(0deg,rgba(255,255,255,0.06)_0px,rgba(255,255,255,0.06)_1px,transparent_1px,transparent_3px)]" />
      <canvas ref={ref} className="absolute inset-0 h-full w-full" />
      <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-medium tracking-wide">
        <span className="h-2 w-2 animate-pulse rounded-full bg-destructive" /> LIVE · CAM 01
      </div>
      <div className="absolute right-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[11px] text-muted-foreground">
        MediaPipe · 21 landmarks
      </div>
    </div>
  );
}
