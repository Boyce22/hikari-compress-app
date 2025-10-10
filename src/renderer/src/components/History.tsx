import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { SectionConfig } from './SectionConfig';

import { useFileFormatter } from '@/hooks/useFileFormatter';
import { HistoryItem } from '@/shared/types/HistoryItem';
import { Clock, FileVideo, Play, TrendingDown } from 'lucide-react';

interface HistoryProps {
  historyArr?: HistoryItem[];
}

const HistoryCardItem = ({ item, formatFileSize }: { item: HistoryItem; formatFileSize: (size: number) => string }) => {
  const savedSpace = item.originalSize - item.compressedSize;

  return (
    <div className="p-5 border rounded-xl card-clean hover:border-primary/30 transition-all duration-300 hover-lift">
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="p-2.5 rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors flex-shrink-0">
            <FileVideo className="w-5 h-5 text-primary" />
          </div>

          <div className="flex-1 min-w-0 space-y-3">
            <div>
              <p className="font-semibold text-foreground truncate text-base">{item.name}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {new Date(item.date).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Tamanho original:</span>
                <span className="font-medium text-foreground">{formatFileSize(item.originalSize)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Comprimido:</span>
                <span className="font-medium text-foreground">{formatFileSize(item.compressedSize)}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-success/10 text-success border-success/20 font-medium">
                <TrendingDown className="w-3.5 h-3.5 mr-1" />
                {item.compressionRatio}% menor
              </Badge>
              <span className="text-sm text-muted-foreground">Economizou {formatFileSize(savedSpace)}</span>
            </div>
          </div>
        </div>

        <Button size="sm" className="hover:cursor-pointer" variant="primary">
          <Play className="w-4 h-4" />
          Reproduzir
        </Button>
      </div>
    </div>
  );
};

export const History = ({ historyArr }: HistoryProps) => {
  const videos = historyArr || [];

  const { formatFileSize } = useFileFormatter();

  return (
    <Card className="p-8 card-clean w-6xl">
      <div className="flex items-center justify-between mb-6">
        <SectionConfig
          icon={Clock}
          label="Histórico de Compressões"
          description="Seus arquivos processados recentemente"
        />
        <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 px-3 py-1">
          {videos.length} {videos.length === 1 ? 'arquivo' : 'arquivos'}
        </Badge>
      </div>

      {videos.length === 0 ? (
        <div className="text-center py-16 min-h-96">
          <div className="inline-flex p-4 rounded-full bg-muted/50 mb-4">
            <Clock className="w-12 h-12 text-muted-foreground/50" />
          </div>
          <p className="text-lg font-medium text-foreground mb-2">Nenhum arquivo comprimido ainda</p>
          <p className="text-muted-foreground text-sm">Seus arquivos comprimidos aparecerão aqui</p>
        </div>
      ) : (
        <div className="space-y-4">
          {videos.map((item) => (
            <HistoryCardItem key={item.id} item={item} formatFileSize={formatFileSize} />
          ))}
        </div>
      )}
    </Card>
  );
};
