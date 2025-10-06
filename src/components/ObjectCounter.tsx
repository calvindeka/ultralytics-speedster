import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3 } from "lucide-react";

interface Detection {
  label: string;
  score: number;
}

interface ObjectCounterProps {
  detections: Detection[];
}

export const ObjectCounter = ({ detections }: ObjectCounterProps) => {
  // Count objects by class
  const classCounts = detections.reduce((acc, det) => {
    acc[det.label] = (acc[det.label] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedClasses = Object.entries(classCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10); // Top 10 classes

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <BarChart3 className="h-5 w-5 text-primary" />
          Object Count by Class
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedClasses.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No objects detected yet
          </p>
        ) : (
          <div className="space-y-3">
            {sortedClasses.map(([label, count]) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-sm font-medium text-foreground capitalize">
                    {label}
                  </span>
                  <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-primary transition-all duration-300"
                      style={{
                        width: `${(count / Math.max(...Object.values(classCounts))) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <Badge variant="secondary" className="ml-2">
                  {count}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
