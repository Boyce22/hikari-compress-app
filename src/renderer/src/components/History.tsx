import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SectionConfig } from './SectionConfig';
import { useFileFormatter } from '@/hooks/useFileFormatter';
import { HistoryItem } from '@/shared/types/HistoryItem';
import { Clock, FileVideo, Play, TrendingDown } from 'lucide-react';

interface HistoryProps {
  historyArr?: HistoryItem[];
}

const HistoryItemRow: React.FC<{ video: HistoryItem; formatFileSize: (size: number) => string }> = ({
  video,
  formatFileSize,
}) => {
  const savedSpace = video.originalSize - video.compressedSize;
  
  const formattedDate = new Date(video.date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const INFO_MAP: { icon?: typeof Clock; label: string }[] = [
    { icon: Clock, label: formattedDate },
    { label: `Original: ${formatFileSize(video.originalSize)}` },
    { label: `Comprimido: ${formatFileSize(video.compressedSize)}` },
  ];

  return (
    <div className="flex items-center justify-between gap-6 py-4 border-b border-muted/20 last:border-none">
      <div className="flex items-start gap-4 flex-1 min-w-0">
        <div className="flex-shrink-0 p-2.5 rounded-lg bg-primary/10">
          <FileVideo className="w-5 h-5 text-primary" />
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <p className="font-semibold text-base text-foreground truncate">{video.name}</p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {Object.entries(INFO_MAP).map(([key, info]) => (
              <span key={key} className="flex items-center gap-1">
                {info.icon && <info.icon className="w-3.5 h-3.5 inline-block mr-1" />}
                {info.label}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Badge variant="secondary" className="bg-success/10 text-success border-success/20 font-medium">
              <TrendingDown className="w-3.5 h-3.5 mr-1" />
              {video.compressionRatio}% menor
            </Badge>
            <span className="text-muted-foreground">Economizou {formatFileSize(savedSpace)}</span>
          </div>
        </div>
      </div>

      <Button size="sm" variant="primary" className="ml-4">
        <Play className="w-4 h-4 mr-1" />
        Reproduzir
      </Button>
    </div>
  );
};

export const History: React.FC<HistoryProps> = ({ historyArr = [] }) => {
  const { formatFileSize } = useFileFormatter();

  if (!historyArr.length) {
    return (
      <div className="flex flex-col p-8 flex-1 items-center justify-center min-h-[24rem] text-center bg-background">
        <div className="inline-flex p-6 rounded-full bg-muted/50 mb-4">
          <Clock className="w-12 h-12 text-muted-foreground/50" />
        </div>
        <p className="text-lg font-medium text-foreground mb-2">Nenhum arquivo comprimido ainda</p>
        <p className="text-muted-foreground text-sm">Seus arquivos comprimidos aparecerão aqui</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-8 flex-1 overflow-auto bg-background">
      <div className="flex items-center justify-between mb-6">
        <SectionConfig
          icon={Clock}
          label="Histórico de Compressões"
          description="Seus arquivos processados recentemente"
        />
        <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 px-3 py-1">
          {historyArr.length} {historyArr.length === 1 ? 'arquivo' : 'arquivos'}
        </Badge>
      </div>

      <div className="flex flex-col flex-1 divide-y divide-muted/20">
        {historyArr.map((video) => (
          <HistoryItemRow key={video.id} video={video} formatFileSize={formatFileSize} />
        ))}
      </div>
    </div>
  );
};
