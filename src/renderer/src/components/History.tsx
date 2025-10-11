import type React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useFileFormatter } from '@/hooks/useFileFormatter';
import type { HistoryItem } from '@/shared/types/HistoryItem';
import { Clock, FileVideo, Play, TrendingDown, HardDrive, Zap, Archive, Download, MoreVertical } from 'lucide-react';
import { SectionConfig } from './SectionConfig';

interface HistoryProps {
  historyArr?: HistoryItem[];
}

const StatCard: React.FC<{
  icon: typeof Clock;
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
}> = ({ icon: Icon, label, value, trend, trendUp }) => {
  return (
    <Card className="p-6 bg-card border-border/50 hover:border-primary/30 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">{label}</span>
          </div>
          <p className="text-2xl font-bold text-foreground mb-1">{value}</p>
          {trend && (
            <p className={`text-xs font-medium ${trendUp ? 'text-success' : 'text-muted-foreground'}`}>{trend}</p>
          )}
        </div>
      </div>
    </Card>
  );
};

const HistoryItemRow: React.FC<{
  video: HistoryItem;
  formatFileSize: (size: number) => string;
}> = ({ video, formatFileSize }) => {
  const savedSpace = video.originalSize - video.compressedSize;

  const formattedDate = new Date(video.date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const formattedTime = new Date(video.date).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Card className="p-5 bg-card border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="flex-shrink-0 p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <FileVideo className="w-6 h-6 text-primary" />
          </div>

          <div className="flex-1 min-w-0 space-y-3">
            <div>
              <p className="font-semibold text-base text-foreground truncate mb-1">{video.name}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {formattedDate} às {formattedTime}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Original:</span>
                <span className="font-medium text-foreground">{formatFileSize(video.originalSize)}</span>
              </div>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Comprimido:</span>
                <span className="font-medium text-foreground">{formatFileSize(video.compressedSize)}</span>
              </div>
              <div className="w-px h-4 bg-border" />
              <Badge variant="secondary" className="bg-success/10 text-success border-success/20 font-semibold">
                <TrendingDown className="w-3.5 h-3.5 mr-1.5" />
                {video.compressionRatio}% menor
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <HardDrive className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                Economizou <span className="font-semibold text-success">{formatFileSize(savedSpace)}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="border-border/50 hover:border-primary/50 bg-transparent">
            <Download className="w-4 h-4" />
          </Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            <Play className="w-4 h-4 mr-2" />
            Reproduzir
          </Button>
          <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export const History: React.FC<HistoryProps> = ({ historyArr = [] }) => {
  const { formatFileSize } = useFileFormatter();

  // Calculate statistics
  const totalOriginalSize = historyArr.reduce((acc, item) => acc + item.originalSize, 0);
  const totalCompressedSize = historyArr.reduce((acc, item) => acc + item.compressedSize, 0);
  const totalSaved = totalOriginalSize - totalCompressedSize;
  const averageCompression =
    historyArr.length > 0
      ? Math.round(historyArr.reduce((acc, item) => acc + item.compressionRatio, 0) / historyArr.length)
      : 0;

  if (!historyArr.length) {
    return (
      <div className="flex flex-col p-8 flex-1 items-center justify-center min-h-[32rem] text-center bg-background">
        <div className="inline-flex p-8 rounded-2xl bg-muted/30 mb-6 border border-border/50">
          <Archive className="w-16 h-16 text-muted-foreground/40" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">Nenhum arquivo comprimido ainda</h3>
        <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
          Comece a comprimir seus vídeos e acompanhe todo o histórico de processamento aqui
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-10 flex-1 overflow-auto bg-background">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <SectionConfig
            icon={Clock}
            label="Histórico de Compressões"
            description={'Seus arquivos processados recentemente'}
          />

          <Badge
            variant="outline"
            className="border-primary/30 text-primary bg-primary/5 px-4 py-2 text-sm font-semibold"
          >
            {historyArr.length} {historyArr.length === 1 ? 'arquivo' : 'arquivos'}
          </Badge>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Archive} label="Total Processado" value={formatFileSize(totalOriginalSize)} />
        <StatCard
          icon={HardDrive}
          label="Espaço Economizado"
          value={formatFileSize(totalSaved)}
          trend="Total salvo"
          trendUp
        />
        <StatCard icon={Zap} label="Compressão Média" value={`${averageCompression}%`} trend="Taxa de redução" />
        <StatCard icon={FileVideo} label="Arquivos" value={historyArr.length.toString()} trend="Total comprimido" />
      </div>

      {/* History List */}
      <div className="space-y-4">
        {historyArr.map((video) => (
          <HistoryItemRow key={video.id} video={video} formatFileSize={formatFileSize} />
        ))}
      </div>
    </div>
  );
};
