import { useEffect, useRef, useState } from "react";
import { useDemo } from "@/lib/demo-store";

declare global {
  interface Window {
    Holistic: any;
    Camera: any;
    drawConnectors: any;
    drawLandmarks: any;
  }
}

/** 
 * Fully functional webcam feed that loads the real MediaPipe Holistic model 
 * and draws your actual, live joint coordinates on a canvas in real-time.
 */
export function WebcamMock({ active }: { active: boolean }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { translateWebcamLandmarks, gestureStatus, gestureOutput } = useDemo();

  useEffect(() => {
    let activeCamera: any = null;
    let holisticModel: any = null;
    let isUnmounted = false;

    // Load MediaPipe scripts from CDN dynamically to avoid bundler/WASM compile issues
    const loadScript = (url: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${url}"]`)) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = url;
        script.crossOrigin = "anonymous";
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
        document.head.appendChild(script);
      });
    };

    const initializeMediaPipe = async () => {
      try {
        // Load Holistic and Camera utilities
        await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/holistic/holistic.js");
        await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js");
        
        if (isUnmounted) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Initialize Holistic model
        holisticModel = new window.Holistic({
          locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`
        });

        holisticModel.setOptions({
          modelComplexity: 1,
          smoothLandmarks: true,
          enableSegmentation: false,
          smoothSegmentation: false,
          refineFaceLandmarks: false,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });

        // Set up results handler to draw on canvas
        holisticModel.onResults((results: any) => {
          if (isUnmounted) return;
          
          translateWebcamLandmarks(results.leftHandLandmarks, results.rightHandLandmarks, results.poseLandmarks);
          
          const w = canvas.width;
          const h = canvas.height;
          ctx.clearRect(0, 0, w, h);

          // 1. Draw the mirror video frame onto canvas
          ctx.save();
          ctx.scale(-1, 1);
          ctx.translate(-w, 0);
          ctx.drawImage(results.image, 0, 0, w, h);
          ctx.restore();

          // Helper to draw skeleton lines
          const drawPoints = (landmarks: any[], color: string, radius: number = 3) => {
            if (!landmarks) return;
            landmarks.forEach((pt) => {
              // Mirror the x coordinates because camera is mirrored
              const x = (1 - pt.x) * w;
              const y = pt.y * h;
              ctx.fillStyle = color;
              ctx.beginPath();
              ctx.arc(x, y, radius, 0, Math.PI * 2);
              ctx.fill();
            });
          };

          const drawLines = (landmarks: any[], connections: number[][], color: string) => {
            if (!landmarks || !connections) return;
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            connections.forEach(([i, j]) => {
              const p1 = landmarks[i!];
              const p2 = landmarks[j!];
              if (p1 && p2) {
                ctx.beginPath();
                ctx.moveTo((1 - p1.x) * w, p1.y * h);
                ctx.lineTo((1 - p2.x) * w, p2.y * h);
                ctx.stroke();
              }
            });
          };

          // Draw Face box / tracking landmarks (simplified)
          if (results.faceLandmarks) {
            ctx.strokeStyle = "rgba(0, 102, 255, 0.4)";
            ctx.lineWidth = 1;
            drawPoints([results.faceLandmarks[10], results.faceLandmarks[152]], "rgba(0, 102, 255, 0.6)", 2);
          }

          // Hand Connections indexes
          const HAND_CONNECTIONS = [
            [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
            [0, 5], [5, 6], [6, 7], [7, 8], // Index
            [9, 10], [10, 11], [11, 12],     // Middle
            [13, 14], [14, 15], [15, 16],    // Ring
            [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
            [5, 9], [9, 13], [13, 17]        // Palm boundary
          ];

          // Draw Left Hand (Green)
          if (results.leftHandLandmarks) {
            drawLines(results.leftHandLandmarks, HAND_CONNECTIONS, "#34C759");
            drawPoints(results.leftHandLandmarks, "#FF9500", 3.5);
          }

          // Draw Right Hand (Blue)
          if (results.rightHandLandmarks) {
            drawLines(results.rightHandLandmarks, HAND_CONNECTIONS, "#0066FF");
            drawPoints(results.rightHandLandmarks, "#FF9500", 3.5);
          }

          // Draw Pose (Shoulders and arms)
          if (results.poseLandmarks) {
            const poseConnections = [[11, 12], [11, 13], [13, 15], [12, 14], [14, 16]];
            drawLines(results.poseLandmarks, poseConnections, "rgba(255, 255, 255, 0.6)");
            drawPoints([results.poseLandmarks[11], results.poseLandmarks[12]], "#0066FF", 4);
          }
        });

        // Initialize and start Webcam stream
        activeCamera = new window.Camera(video, {
          onFrame: async () => {
            if (isUnmounted) return;
            await holisticModel.send({ image: video });
          },
          width: 640,
          height: 480
        });

        await activeCamera.start();
        setModelLoaded(true);
      } catch (err: any) {
        console.error("Camera/MediaPipe setup failed:", err.message);
        setErrorMsg("Camera access required. Please enable webcam permission.");
      }
    };

    initializeMediaPipe();

    return () => {
      isUnmounted = true;
      if (activeCamera) {
        activeCamera.stop();
      }
      if (holisticModel) {
        holisticModel.close();
      }
    };
  }, [translateWebcamLandmarks]);

  return (
    <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl border border-white/10 bg-[linear-gradient(140deg,rgba(20,22,54,0.95),rgba(12,12,30,0.98))]">
      {/* Hidden video element used for tracking feed */}
      <video
        ref={videoRef}
        style={{ display: "none" }}
        playsInline
        muted
      />
      
      {/* Canvas displaying feed and drawings */}
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Loading Overlay */}
      {!modelLoaded && !errorMsg && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-semibold tracking-wide text-muted-foreground animate-pulse">
            Loading MediaPipe Holistic models...
          </p>
        </div>
      )}

      {/* Error Overlay */}
      {errorMsg && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 p-4 text-center">
          <p className="text-sm font-bold text-destructive mb-2">⚠ System Warning</p>
          <p className="text-xs text-muted-foreground">{errorMsg}</p>
        </div>
      )}

      {/* Status Tags */}
      {modelLoaded && (
        <>
          <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium tracking-wide backdrop-blur-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-success" /> LIVE · WEBCAM
          </div>
          <div className="absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] text-muted-foreground backdrop-blur-sm">
            MediaPipe · Holistic Active
          </div>

          {/* Live Real-Time AI Detection Overlay */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-xl bg-black/75 px-3 py-2 text-xs font-semibold backdrop-blur-md border border-white/10">
            <span className="flex items-center gap-2 text-white">
              <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
              <span>{gestureStatus || "Listening for ISL gestures…"}</span>
            </span>
            {gestureOutput && gestureOutput !== "—" && (
              <span className="rounded-lg bg-primary/20 border border-primary/30 px-2.5 py-0.5 text-primary font-bold">
                {gestureOutput}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
