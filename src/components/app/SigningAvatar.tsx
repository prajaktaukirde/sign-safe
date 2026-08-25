import { useEffect, useRef } from "react";

type Props = { speed: number; replayKey: number };

/** Simulated 3D signing avatar drawn with skeletal lines on a canvas. */
export function SigningAvatar({ speed, replayKey }: Props) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const t = useRef(0);

  useEffect(() => {
    t.current = 0;
  }, [replayKey]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let last = performance.now();

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
      const dt = (now - last) / 1000;
      last = now;
      t.current += dt * speed;
      const time = t.current;
      const r = canvas.getBoundingClientRect();
      const w = r.width;
      const h = r.height;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h * 0.52;
      const s = Math.min(w, h) / 420;

      // grid floor
      ctx.strokeStyle = "rgba(120,140,255,0.10)";
      ctx.lineWidth = 1;
      for (let i = 0; i <= 10; i++) {
        const y = h * 0.72 + i * 9;
        const spread = 40 + i * 26;
        ctx.beginPath();
        ctx.moveTo(cx - spread, y);
        ctx.lineTo(cx + spread, y);
        ctx.stroke();
      }

      const bob = Math.sin(time * 1.6) * 4 * s;
      const P = (x: number, y: number): [number, number] => [cx + x * s, cy + y * s + bob];

      const head = P(0, -120);
      const neck = P(0, -84);
      const pelvis = P(0, 26);
      const shL = P(-46, -66);
      const shR = P(46, -66);
      const hipL = P(-28, 26);
      const hipR = P(28, 26);

      // arm animation (signing loop)
      const a = time * 2.2;
      const elL = P(-76 + Math.sin(a) * 16, -18 + Math.cos(a * 1.3) * 18);
      const elR = P(76 + Math.sin(a + 1.1) * 16, -18 + Math.cos(a * 1.1 + 0.6) * 18);
      const haL = P(-56 + Math.sin(a * 1.7 + 0.4) * 34, -66 + Math.sin(a * 1.2) * 40);
      const haR = P(56 + Math.sin(a * 1.5 + 2.1) * 34, -70 + Math.cos(a * 1.4) * 40);
      const knL = P(-30, 86);
      const knR = P(30, 86);
      const ftL = P(-32, 142);
      const ftR = P(32, 142);

      const bone = (p1: number[], p2: number[], width: number, color: string) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(p1[0]!, p1[1]!);
        ctx.lineTo(p2[0]!, p2[1]!);
        ctx.stroke();
      };
      const joint = (p: number[], rad: number, color: string) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(p[0]!, p[1]!, rad, 0, Math.PI * 2);
        ctx.fill();
      };

      const body = "rgba(120,170,255,0.55)";
      const limb = "#0066FF";

      ctx.shadowColor = "rgba(0,102,255,0.65)";
      ctx.shadowBlur = 18;

      bone(neck, pelvis, 16 * s, body);
      bone(shL, shR, 12 * s, body);
      bone(hipL, hipR, 12 * s, body);
      bone(shL, elL, 9 * s, limb);
      bone(elL, haL, 8 * s, limb);
      bone(shR, elR, 9 * s, limb);
      bone(elR, haR, 8 * s, limb);
      bone(hipL, knL, 10 * s, body);
      bone(knL, ftL, 9 * s, body);
      bone(hipR, knR, 10 * s, body);
      bone(knR, ftR, 9 * s, body);
      bone(head, neck, 9 * s, body);

      // head
      ctx.fillStyle = "rgba(150,190,255,0.85)";
      ctx.beginPath();
      ctx.ellipse(head[0]!, head[1]!, 22 * s, 26 * s, 0, 0, Math.PI * 2);
      ctx.fill();

      [shL, shR, elL, elR, hipL, hipR, knL, knR, pelvis].forEach((p) =>
        joint(p, 4.5 * s, "rgba(200,225,255,0.9)"),
      );

      // hands with finger fan
      [haL, haR].forEach((p, idx) => {
        joint(p, 8 * s, "#FF9500");
        for (let f = 0; f < 5; f++) {
          const ang =
            (idx === 0 ? Math.PI : 0) +
            (f - 2) * 0.28 +
            Math.sin(time * 4 + f + idx * 2) * 0.22 -
            Math.PI / 2;
          const len = 16 * s;
          ctx.strokeStyle = "rgba(255,149,0,0.85)";
          ctx.lineWidth = 2.4 * s;
          ctx.beginPath();
          ctx.moveTo(p[0]!, p[1]!);
          ctx.lineTo(p[0]! + Math.cos(ang) * len, p[1]! + Math.sin(ang) * len);
          ctx.stroke();
        }
      });

      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [speed]);

  return <canvas ref={ref} className="h-full w-full" aria-label="Simulated ISL signing avatar" />;
}
