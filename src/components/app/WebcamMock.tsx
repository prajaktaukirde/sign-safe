import { useEffect, useRef, useState, useCallback } from "react";
import { RefreshCw, AlertCircle } from "lucide-react";
import { useDemo } from "@/lib/demo-store";

declare global {
  interface Window {
    Holistic: any;
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
  const [retryKey, setRetryKey] = useState(0);
  const { translateWebcamLandmarks, gestureStatus, gestureOutput } = useDemo();

  const handleRetry = useCallback(() => {
    setErrorMsg("");
    setRetryKey((k) => k + 1);
  }, []);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let holisticModel: any = null;
    let animId: number | null = null;
    let isUnmounted = false;
    let isSending = false;

    // Load MediaPipe scripts from CDN dynamically
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
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // 1. Start browser camera stream directly
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 640 },
              height: { ideal: 480 },
              facingMode: "user"
            },
            audio: false
          });
        } catch (mediaErr: any) {
          console.error("Camera access error:", mediaErr);
          if (mediaErr.name === "NotAllowedError" || mediaErr.name === "PermissionDeniedError") {
            setErrorMsg("Camera permission was denied. Please allow camera access in your browser address bar.");
          } else if (mediaErr.name === "NotReadableError" || mediaErr.name === "TrackStartError") {
            setErrorMsg("Camera is in use by another application. Please close other camera apps and retry.");
          } else {
            setErrorMsg("Camera access required. Please enable webcam permission.");
          }
          return;
        }

        if (isUnmounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        video.srcObject = stream;
        video.muted = true;
        await video.play();

        // 2. Load Holistic model
        await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/holistic/holistic.js");
        
        if (isUnmounted) return;

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
          if (results.image) {
            ctx.drawImage(results.image, 0, 0, w, h);
          } else if (video.readyState >= 2) {
            ctx.drawImage(video, 0, 0, w, h);
          }
          ctx.restore();

          // Helper to draw skeleton lines
          const drawPoints = (landmarks: any[], color: string, radius: number = 3.5) => {
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
            ctx.lineWidth = 2.5;
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

        setModelLoaded(true);

        // Continuous processing loop
        const processLoop = async () => {
          if (isUnmounted) return;
          if (video && video.readyState >= 2 && !isSending && holisticModel) {
            isSending = true;
            try {
              await holisticModel.send({ image: video });
            } catch (err) {
              // Ignore single frame error
            } finally {
              isSending = false;
            }
          }
          if (!isUnmounted) {
            animId = requestAnimationFrame(processLoop);
          }
        };

        animId = requestAnimationFrame(processLoop);
      } catch (err: any) {
        console.error("Camera/MediaPipe setup failed:", err.message);
        setErrorMsg(err?.message || "Camera access required. Please enable webcam permission.");
      }
    };

    initializeMediaPipe();

    return () => {
      isUnmounted = true;
      if (animId) {
        cancelAnimationFrame(animId);
      }
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
      if (holisticModel) {
        try {
          holisticModel.close();
        } catch (e) {
          // Ignore
        }
      }
    };
  }, [retryKey, translateWebcamLandmarks]);

  return (
    <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl border border-border bg-slate-950 shadow-inner">
      {/* Video element for active stream capture */}
      <video
        ref={videoRef}
        playsInline
        muted
        autoPlay
        className="absolute top-0 left-0 w-1 h-1 opacity-0 pointer-events-none"
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
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 p-6 text-center space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/20 text-destructive">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-destructive">System Notice</p>
            <p className="text-xs text-muted-foreground max-w-xs">{errorMsg}</p>
          </div>
          <button
            onClick={handleRetry}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Retry Camera
          </button>
        </div>
      )}

      {/* Status Tags */}
      {modelLoaded && !errorMsg && (
        <>
          <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium tracking-wide backdrop-blur-sm text-white">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> LIVE · WEBCAM
          </div>
          <div className="absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] text-muted-foreground backdrop-blur-sm">
            MediaPipe · Holistic Active
          </div>

          {/* Live Real-Time AI Detection Overlay */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 rounded-xl bg-slate-900/85 px-3.5 py-2.5 text-xs font-semibold backdrop-blur-md border border-white/15 text-white shadow-lg">
            <span className="flex items-center gap-2 truncate">
              <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400 animate-ping" />
              <span className="truncate text-slate-200">{gestureStatus || "Listening for ISL gestures…"}</span>
            </span>
            {gestureOutput && gestureOutput !== "—" && (
              <span className="shrink-0 rounded-lg bg-primary text-white px-2.5 py-1 font-bold shadow-xs">
                {gestureOutput}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
