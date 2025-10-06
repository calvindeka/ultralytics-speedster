import { useState } from "react";
import { WebcamDetector } from "@/components/WebcamDetector";
import { MetricsPanel } from "@/components/MetricsPanel";
import { ObjectCounter } from "@/components/ObjectCounter";
import { DetectionControls } from "@/components/DetectionControls";
import { Camera, Github, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Detection {
  label: string;
  score: number;
  box: { xmin: number; ymin: number; xmax: number; ymax: number };
}

const Index = () => {
  const [isActive, setIsActive] = useState(false);
  const [device, setDevice] = useState<"webgpu" | "cpu">("webgpu");
  const [fps, setFps] = useState(0);
  const [inferenceTime, setInferenceTime] = useState(0);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);

  const handleClassToggle = (className: string) => {
    setSelectedClasses((prev) =>
      prev.includes(className)
        ? prev.filter((c) => c !== className)
        : [...prev, className]
    );
  };

  const handleDeviceChange = (newDevice: "webgpu" | "cpu") => {
    if (isActive) {
      setIsActive(false);
      setTimeout(() => {
        setDevice(newDevice);
      }, 100);
    } else {
      setDevice(newDevice);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <header className="border-b border-border bg-background/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg shadow-glow">
                <Camera className="h-6 w-6 text-background" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Vision AI Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">
                  Real-time object detection with WebGPU
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <Sparkles className="h-3 w-3" />
                Browser ML
              </Badge>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <Github className="h-5 w-5 text-foreground" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Metrics Panel */}
          <MetricsPanel
            fps={fps}
            inferenceTime={inferenceTime}
            device={device}
            totalDetections={detections.length}
          />

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Video Feed - Takes 2 columns */}
            <div className="lg:col-span-2">
              <WebcamDetector
                isActive={isActive}
                device={device}
                onFpsUpdate={setFps}
                onDetectionsUpdate={setDetections}
                onInferenceTimeUpdate={setInferenceTime}
                selectedClasses={selectedClasses}
              />
            </div>

            {/* Controls Sidebar */}
            <div className="space-y-6">
              <DetectionControls
                isActive={isActive}
                device={device}
                onToggleActive={() => setIsActive(!isActive)}
                onDeviceChange={handleDeviceChange}
                selectedClasses={selectedClasses}
                onClassToggle={handleClassToggle}
              />

              <ObjectCounter detections={detections} />
            </div>
          </div>

          {/* Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">
                30+ FPS Performance
              </h3>
              <p className="text-sm text-muted-foreground">
                Real-time object detection optimized for browser execution with WebGPU
                acceleration
              </p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">
                Zero Installation
              </h3>
              <p className="text-sm text-muted-foreground">
                Runs entirely in your browser - no Python, no downloads, no complex
                setup required
              </p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">
                Privacy First
              </h3>
              <p className="text-sm text-muted-foreground">
                All processing happens locally on your device - your camera feed never
                leaves your browser
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
