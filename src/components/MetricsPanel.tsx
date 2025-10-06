import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Cpu, Gauge, Zap } from "lucide-react";

interface MetricsPanelProps {
  fps: number;
  inferenceTime: number;
  device: "webgpu" | "cpu";
  totalDetections: number;
}

export const MetricsPanel = ({
  fps,
  inferenceTime,
  device,
  totalDetections,
}: MetricsPanelProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-foreground">FPS</CardTitle>
          <Gauge className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{fps}</div>
          <p className="text-xs text-muted-foreground mt-1">Frames per second</p>
          <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-primary transition-all duration-300"
              style={{ width: `${Math.min((fps / 60) * 100, 100)}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-foreground">
            Inference Time
          </CardTitle>
          <Zap className="h-4 w-4 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {inferenceTime.toFixed(0)}ms
          </div>
          <p className="text-xs text-muted-foreground mt-1">Per frame</p>
          <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-300"
              style={{ width: `${Math.min((inferenceTime / 200) * 100, 100)}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-foreground">Device</CardTitle>
          <Cpu className="h-4 w-4 text-success" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground uppercase">
            {device}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {device === "webgpu" ? "Hardware accelerated" : "Software rendering"}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-foreground">
            Detections
          </CardTitle>
          <Activity className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{totalDetections}</div>
          <p className="text-xs text-muted-foreground mt-1">Objects detected</p>
        </CardContent>
      </Card>
    </div>
  );
};
