import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Play, Square, Settings } from "lucide-react";
import { useState } from "react";

interface DetectionControlsProps {
  isActive: boolean;
  device: "webgpu" | "cpu";
  onToggleActive: () => void;
  onDeviceChange: (device: "webgpu" | "cpu") => void;
  selectedClasses: string[];
  onClassToggle: (className: string) => void;
}

const COMMON_CLASSES = [
  "person",
  "car",
  "chair",
  "bottle",
  "cup",
  "laptop",
  "cell phone",
  "book",
  "clock",
  "vase",
];

export const DetectionControls = ({
  isActive,
  device,
  onToggleActive,
  onDeviceChange,
  selectedClasses,
  onClassToggle,
}: DetectionControlsProps) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-4">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Settings className="h-5 w-5 text-primary" />
            Detection Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="device-toggle" className="text-foreground">
              Enable WebGPU Acceleration
            </Label>
            <Switch
              id="device-toggle"
              checked={device === "webgpu"}
              onCheckedChange={(checked) =>
                onDeviceChange(checked ? "webgpu" : "cpu")
              }
              disabled={isActive}
            />
          </div>

          <Button
            onClick={onToggleActive}
            className={
              isActive
                ? "w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                : "w-full bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-glow"
            }
            size="lg"
          >
            {isActive ? (
              <>
                <Square className="mr-2 h-5 w-5" />
                Stop Detection
              </>
            ) : (
              <>
                <Play className="mr-2 h-5 w-5" />
                Start Detection
              </>
            )}
          </Button>

          <div className="pt-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="w-full"
              size="sm"
            >
              {showFilters ? "Hide" : "Show"} Class Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {showFilters && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm text-foreground">Filter by Class</CardTitle>
            <p className="text-xs text-muted-foreground">
              {selectedClasses.length === 0
                ? "Showing all classes"
                : `Showing ${selectedClasses.length} class(es)`}
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {COMMON_CLASSES.map((className) => (
                <Badge
                  key={className}
                  variant={
                    selectedClasses.includes(className) ? "default" : "outline"
                  }
                  className="cursor-pointer transition-all hover:scale-105"
                  onClick={() => onClassToggle(className)}
                >
                  {className}
                </Badge>
              ))}
            </div>
            {selectedClasses.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => selectedClasses.forEach(onClassToggle)}
                className="w-full mt-4"
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
