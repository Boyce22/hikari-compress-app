import { TrendingUp } from "lucide-react";
import { Card } from "@/renderer/components/ui/card";
import { formatFileSize } from "@/shared/utils/format-file-size";

interface CardStatsProps {
  value: number | string;
  label: string;
  subtitle: string;
  trend: string;
  icon: React.ComponentType<any>;
  bytes?: boolean;
}

export const CardStats = ({ value, label, subtitle, trend, icon: Icon, bytes = true }: CardStatsProps) => (
  <Card className="p-6 bg-card border-border/50 hover:border-primary/30 transition-all duration-300">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <p className="text-2xl font-bold text-foreground mb-2">{bytes ? formatFileSize(value as number) : value}</p>
        <p className="text-xs text-muted-foreground mb-2">{subtitle}</p>
        <div className="flex items-center gap-1 text-xs font-medium text-primary">
          <TrendingUp className="w-3 h-3" />
          {trend}
        </div>
      </div>
      <div className="p-3 rounded-lg bg-primary/10">
        <Icon className="w-5 h-5 text-primary" />
      </div>
    </div>
  </Card>
);


