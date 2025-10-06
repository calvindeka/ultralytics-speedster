import { useEffect, useRef, useState } from "react";
import { pipeline } from "@huggingface/transformers";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Loader2 } from "lucide-react";

interface Detection {
  label: string;
  score: number;
  box: { xmin: number; ymin: number; xmax: number; ymax: number };
}

interface WebcamDetectorProps {
  isActive: boolean;
  device: "webgpu" | "cpu";
  onFpsUpdate: (fps: number) => void;
  onDetectionsUpdate: (detections: Detection[]) => void;
  onInferenceTimeUpdate: (time: number) => void;
  selectedClasses: string[];
}

export const WebcamDetector = ({
  isActive,
  device,
  onFpsUpdate,
  onDetectionsUpdate,
  onInferenceTimeUpdate,
  selectedClasses,
}: WebcamDetectorProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const detectorRef = useRef<any>(null);
  const animationFrameRef = useRef<number>();
  const fpsCounterRef = useRef({ frames: 0, lastTime: performance.now() });

  // Initialize webcam
  useEffect(() => {
    if (!isActive) return;

    const initWebcam = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        setError("Failed to access webcam. Please grant camera permissions.");
        console.error("Webcam error:", err);
      }
    };

    initWebcam();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isActive]);

  // Initialize detector
  useEffect(() => {
    if (!isActive) return;

    const initDetector = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const detector = await pipeline(
          "object-detection",
          "Xenova/detr-resnet-50",
          { device }
        );
        
        detectorRef.current = detector;
        setIsLoading(false);
      } catch (err) {
        setError(`Failed to load model on ${device.toUpperCase()}. ${err instanceof Error ? err.message : ""}`);
        setIsLoading(false);
        console.error("Model loading error:", err);
      }
    };

    initDetector();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive, device]);

  // Detection loop
  useEffect(() => {
    if (!isActive || isLoading || !detectorRef.current || !videoRef.current) return;

    const detect = async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      if (!video || !canvas || video.readyState !== 4) {
        animationFrameRef.current = requestAnimationFrame(detect);
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Set canvas size to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw video frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      try {
        const startTime = performance.now();
        
        // Run detection
        const output = await detectorRef.current(canvas);
        
        const inferenceTime = performance.now() - startTime;
        onInferenceTimeUpdate(inferenceTime);

        // Filter detections by selected classes and confidence threshold
        const filteredDetections = output.filter(
          (det: Detection) =>
            det.score > 0.5 &&
            (selectedClasses.length === 0 || selectedClasses.includes(det.label))
        );

        onDetectionsUpdate(filteredDetections);

        // Draw bounding boxes
        filteredDetections.forEach((detection: Detection) => {
          const { box, label, score } = detection;
          
          // Draw box
          ctx.strokeStyle = "#06b6d4";
          ctx.lineWidth = 3;
          ctx.strokeRect(box.xmin, box.ymin, box.xmax - box.xmin, box.ymax - box.ymin);

          // Draw label background
          ctx.fillStyle = "rgba(6, 182, 212, 0.9)";
          const text = `${label} ${(score * 100).toFixed(1)}%`;
          const textMetrics = ctx.measureText(text);
          ctx.fillRect(
            box.xmin,
            box.ymin - 25,
            textMetrics.width + 10,
            25
          );

          // Draw label text
          ctx.fillStyle = "#0f172a";
          ctx.font = "bold 14px sans-serif";
          ctx.fillText(text, box.xmin + 5, box.ymin - 7);
        });

        // Update FPS
        fpsCounterRef.current.frames++;
        const now = performance.now();
        if (now - fpsCounterRef.current.lastTime >= 1000) {
          onFpsUpdate(fpsCounterRef.current.frames);
          fpsCounterRef.current.frames = 0;
          fpsCounterRef.current.lastTime = now;
        }
      } catch (err) {
        console.error("Detection error:", err);
      }

      animationFrameRef.current = requestAnimationFrame(detect);
    };

    detect();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive, isLoading, device, selectedClasses]);

  if (!isActive) {
    return (
      <Card className="aspect-video flex items-center justify-center bg-card">
        <div className="text-center space-y-4">
          <Camera className="w-16 h-16 mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">Click "Start Detection" to begin</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="aspect-video flex items-center justify-center bg-card">
        <div className="text-center space-y-4 p-6">
          <Camera className="w-16 h-16 mx-auto text-destructive" />
          <p className="text-destructive">{error}</p>
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="aspect-video flex items-center justify-center bg-card">
        <div className="text-center space-y-4">
          <Loader2 className="w-16 h-16 mx-auto text-primary animate-spin" />
          <p className="text-foreground">Loading {device.toUpperCase()} model...</p>
          <p className="text-sm text-muted-foreground">This may take a moment</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden bg-card">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover opacity-0"
      />
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ imageRendering: "crisp-edges" }}
      />
      <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground shadow-glow">
        {device.toUpperCase()} Mode
      </Badge>
    </Card>
  );
};
