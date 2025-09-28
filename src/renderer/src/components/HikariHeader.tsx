import { Sparkles, Zap } from "lucide-react";
import { Badge } from "@renderer/components/ui/badge";

export function HikariHeader() {
  return (
    <div className="flex items-center justify-between mb-8 w-full">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-primary/20 border border-primary/30 subtle-glow">
          <Sparkles className="w-7 h-7 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-1">HikariCompress</h1>
          <p className="text-muted-foreground">Compressão profissional de vídeos de anime</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Badge variant="secondary" className="gap-2 px-4 py-2 text-sm bg-secondary/20 border border-secondary/30">
          <Zap className="w-4 h-4" />
          v1.0.0
        </Badge>
      </div>
    </div>
  );
}