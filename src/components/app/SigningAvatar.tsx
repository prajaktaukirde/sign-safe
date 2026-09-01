import { useEffect, useRef } from "react";

type Props = { 
  speed: number; 
  replayKey: number; 
  transcript: string;
  activeWord?: string;
};

/** 
 * Live 3D signing avatar drawn with skeletal lines and glowing joints on a canvas. 
 * Translates arbitrary text into Indian Sign Language (ISL) animations dynamically.
 */
export function SigningAvatar({ speed, replayKey, transcript, activeWord }: Props) {
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
      t.current += dt * (speed || 1.0);
      const time = t.current;
      const r = canvas.getBoundingClientRect();
      const w = r.width;
      const h = r.height;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h * 0.52;
      const s = Math.min(w, h) / 420;

      // Background Grid floor with neon perspective
      ctx.strokeStyle = "rgba(120,140,255,0.08)";
      ctx.lineWidth = 1;
      for (let i = 0; i <= 10; i++) {
        const y = h * 0.72 + i * 9;
        const spread = 40 + i * 28;
        ctx.beginPath();
        ctx.moveTo(cx - spread, y);
        ctx.lineTo(cx + spread, y);
        ctx.stroke();
      }

      // Check current keyword in transcript / activeWord to determine gesture
      const text = ((activeWord || transcript || "")).toLowerCase();
      let activeGesture = "idle";
      
      if (text.includes("namaste") || text.includes("pranam") || text.includes("welcome")) activeGesture = "namaste";
      else if (text.includes("morning") || text.includes("sunrise")) activeGesture = "morning";
      else if (text.includes("afternoon")) activeGesture = "afternoon";
      else if (text.includes("evening") || text.includes("sunset")) activeGesture = "evening";
      else if (text.includes("night")) activeGesture = "night";
      else if (text.includes("birthday") || text.includes("happy")) activeGesture = "birthday";
      else if (text.includes("anniversary")) activeGesture = "anniversary";
      else if (text.includes("how are you") || text.includes("how") || text.includes("you") || text.includes("question")) activeGesture = "howareyou";
      else if (text.includes("good") || text.includes("yes") || text.includes("great") || text.includes("super")) activeGesture = "good";
      else if (text.includes("hi") || text.includes("hello") || text.includes("bye")) activeGesture = "hi";
      else if (text.includes("book") || text.includes("read") || text.includes("study")) activeGesture = "book";
      else if (text.includes("teacher") || text.includes("teach") || text.includes("school")) activeGesture = "teacher";
      else if (text.includes("help") || text.includes("assist") || text.includes("support")) activeGesture = "help";
      else if (text.includes("understand") || text.includes("know") || text.includes("think")) activeGesture = "understand";
      else if (text.includes("thank") || text.includes("thanks")) activeGesture = "thankyou";
      else if (text.includes("water") || text.includes("drink")) activeGesture = "water";
      else if (text.includes("danger") || text.includes("fire") || text.includes("emergency") || text.includes("siren") || text.includes("sos")) activeGesture = "danger";
      else if (text.length === 1 && text >= "a" && text <= "z") activeGesture = "letter";

      const bob = Math.sin(time * 1.6) * 3 * s;
      const P = (x: number, y: number): [number, number] => [cx + x * s, cy + y * s + bob];

      const head = P(0, -120);
      const neck = P(0, -84);
      const pelvis = P(0, 26);
      const shL = P(-46, -66);
      const shR = P(46, -66);
      const hipL = P(-28, 26);
      const hipR = P(28, 26);
      const knL = P(-30, 86);
      const knR = P(30, 86);
      const ftL = P(-32, 142);
      const ftR = P(32, 142);

      // Default resting arm positions (idle breathing state)
      let elL = P(-60, -20);
      let elR = P(60, -20);
      let haL = P(-45, 10);
      let haR = P(45, 10);

      // Trigger custom skeletal configurations based on keyword detection
      if (activeGesture === "hi") {
        // Right hand waves high, left hand rests at side
        elR = P(64, -48);
        haR = P(60 + Math.sin(time * 6.5) * 14, -94);
        elL = P(-60, -20);
        haL = P(-45, 10);
      } 
      else if (activeGesture === "namaste") {
        // Both palms pressed together in front of chest
        elL = P(-34, -30);
        elR = P(34, -30);
        haL = P(-8, -48 + Math.sin(time * 2.0) * 3);
        haR = P(8, -48 + Math.sin(time * 2.0) * 3);
      }
      else if (activeGesture === "morning") {
        // Sunrise bloom: Right hand rises from chest level and blooms wide above head
        const bloom = (Math.sin(time * 2.8) + 1) / 2; // 0 to 1
        elR = P(45, -30 - bloom * 25);
        haR = P(20 + bloom * 15, -40 - bloom * 65);
        elL = P(-45, -20);
        haL = P(-20, -20);
      }
      else if (activeGesture === "afternoon") {
        // Flat horizontal palm held at chin level
        elR = P(50, -40);
        haR = P(15 + Math.sin(time * 2.0) * 6, -65);
        elL = P(-60, -20);
        haL = P(-45, 10);
      }
      else if (activeGesture === "evening") {
        // Sunset sweep: Hand moves downward across chest
        const sweep = (Math.sin(time * 2.5) + 1) / 2;
        elR = P(40 - sweep * 10, -30 + sweep * 20);
        haR = P(25 - sweep * 25, -50 + sweep * 45);
        elL = P(-60, -20);
        haL = P(-45, 10);
      }
      else if (activeGesture === "night") {
        // Both wrists crossed over chest
        elL = P(-42, -26);
        elR = P(42, -26);
        haL = P(12, -38);
        haR = P(-12, -38);
      }
      else if (activeGesture === "good") {
        // Thumbs up at chest
        elR = P(42, -32);
        haR = P(22, -45 + Math.sin(time * 3.0) * 4);
        elL = P(-60, -20);
        haL = P(-45, 10);
      }
      else if (activeGesture === "birthday") {
        // Open hand patting over chest / heart
        elR = P(36, -34);
        haR = P(-4 + Math.sin(time * 4.0) * 4, -42);
        elL = P(-60, -20);
        haL = P(-45, 10);
      }
      else if (activeGesture === "anniversary") {
        // Both hands celebrating / circling in front of chest
        const radius = 10;
        const spd = 3.5;
        haL = P(-25 + Math.sin(time * spd) * radius, -36 + Math.cos(time * spd) * radius);
        haR = P(25 + Math.sin(time * spd + Math.PI) * radius, -36 + Math.cos(time * spd + Math.PI) * radius);
        elL = P(-52, -26);
        elR = P(52, -26);
      }
      else if (activeGesture === "howareyou") {
        // Index finger points forward towards camera
        elR = P(38, -36);
        haR = P(12 + Math.sin(time * 2.5) * 8, -48);
        elL = P(-38, -36);
        haL = P(-12 - Math.sin(time * 2.5) * 8, -48);
      }
      else if (activeGesture === "thankyou") {
        // Hand touches chin then extends forward
        const ext = (Math.sin(time * 3.0) + 1) / 2;
        elR = P(45, -40 + ext * 10);
        haR = P(10 + ext * 15, -78 + ext * 25);
        elL = P(-60, -20);
        haL = P(-45, 10);
      }
      else if (activeGesture === "water") {
        // Three fingers tap at mouth
        elR = P(36, -55);
        haR = P(8, -82 + Math.sin(time * 5.0) * 5);
        elL = P(-60, -20);
        haL = P(-45, 10);
      }
      else if (activeGesture === "book") {
        // Both hands flat in center opening outward like a book
        const openPhase = (Math.sin(time * 2.5) + 1) / 2;
        elL = P(-48, -26);
        elR = P(48, -26);
        haL = P(-15 - openPhase * 36, -20);
        haR = P(15 + openPhase * 36, -20);
      } 
      else if (activeGesture === "teacher") {
        // Both hands circle each other in front of chest (ISL gesture)
        const radius = 12;
        const speedMultiplier = 4;
        haL = P(-30 + Math.sin(time * speedMultiplier) * radius, -36 + Math.cos(time * speedMultiplier) * radius);
        haR = P(30 + Math.sin(time * speedMultiplier + Math.PI) * radius, -36 + Math.cos(time * speedMultiplier + Math.PI) * radius);
        elL = P(-58, -26);
        elR = P(58, -26);
      } 
      else if (activeGesture === "help") {
        // Left hand flat, right hand closed fist pushes down on it
        haL = P(-10, -24);
        haR = P(-10, -34 + Math.sin(time * 3.5) * 6);
        elL = P(-50, -24);
        elR = P(34, -28);
      } 
      else if (activeGesture === "understand") {
        // Right hand index finger touches forehead, left hand rests
        elR = P(42, -54);
        haR = P(18, -96 + Math.sin(time * 2) * 4);
        elL = P(-60, -20);
        haL = P(-45, 10);
      } 
      else if (activeGesture === "danger") {
        // Both hands wiggling fingers high in panic motion
        elL = P(-60, -42);
        elR = P(60, -42);
        haL = P(-45 + Math.sin(time * 9) * 6, -92 + Math.cos(time * 9) * 6);
        haR = P(45 + Math.sin(time * 9 + 1.2) * 6, -92 + Math.cos(time * 9 + 1.2) * 6);
      }
      else if (activeGesture === "letter") {
        // Fingerspelling letter posture
        elR = P(48, -48);
        haR = P(36 + Math.sin(time * 3) * 3, -75);
        elL = P(-60, -20);
        haL = P(-45, 10);
      }

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

      const bodyColor = "rgba(120,170,255,0.55)";
      const limbColor = "#0066FF";

      ctx.shadowColor = "rgba(0,102,255,0.65)";
      ctx.shadowBlur = 18;

      bone(neck, pelvis, 16 * s, bodyColor);
      bone(shL, shR, 12 * s, bodyColor);
      bone(hipL, hipR, 12 * s, bodyColor);
      bone(shL, elL, 9 * s, limbColor);
      bone(elL, haL, 8 * s, limbColor);
      bone(shR, elR, 9 * s, limbColor);
      bone(elR, haR, 8 * s, limbColor);
      bone(hipL, knL, 10 * s, bodyColor);
      bone(knL, ftL, 9 * s, bodyColor);
      bone(hipR, knR, 10 * s, bodyColor);
      bone(knR, ftR, 9 * s, bodyColor);
      bone(head, neck, 9 * s, bodyColor);

      // Head
      ctx.fillStyle = "rgba(150,190,255,0.85)";
      ctx.beginPath();
      ctx.ellipse(head[0]!, head[1]!, 22 * s, 26 * s, 0, 0, Math.PI * 2);
      ctx.fill();

      // Face Smile / Eyes
      ctx.fillStyle = "#0A0D28";
      ctx.beginPath();
      ctx.arc(head[0]! - 6 * s, head[1]! - 4 * s, 2.5 * s, 0, Math.PI * 2);
      ctx.arc(head[0]! + 6 * s, head[1]! - 4 * s, 2.5 * s, 0, Math.PI * 2);
      ctx.fill();

      // Cheerful Smile
      ctx.strokeStyle = "#0A0D28";
      ctx.lineWidth = 2 * s;
      ctx.beginPath();
      ctx.arc(head[0]!, head[1]! + 3 * s, 8 * s, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();

      [shL, shR, elL, elR, hipL, hipR, knL, knR, pelvis].forEach((p) =>
        joint(p, 4.5 * s, "rgba(200,225,255,0.9)"),
      );

      // Hands with finger fan animations
      [haL, haR].forEach((p, idx) => {
        const isRight = idx === 1;
        const gestureActive = activeGesture !== "idle";
        
        joint(p, 8 * s, gestureActive ? "#FF9500" : "rgba(200,225,255,0.9)");
        
        // Render animated fingers
        if (gestureActive) {
          for (let f = 0; f < 5; f++) {
            const ang =
              (isRight ? 0 : Math.PI) +
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
  }, [speed, transcript, activeWord]);

  return <canvas ref={ref} className="h-full w-full" aria-label="Live ISL signing avatar" />;
}
