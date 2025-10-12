import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { VideoFile } from '@/shared/types/VideoFile';

import { StatusProcessing } from '@/shared/types/StatusProcessing';
import { Play, Download, Trash2, HardDrive, Clock } from 'lucide-react';

interface VideoFileItemProps {
  file: VideoFile;
  onStartCompression: (fileId: string) => void;
  onRemoveFile: (fileId: string) => void;
  formatFileSize: (bytes: number) => string;
}

const STATUS_VARIANTS = Object.freeze({
  waiting: 'outline',
  processing: 'secondary',
  completed: 'default',
  error: 'destructive',
});

const STATUS_LABELS = Object.freeze({
  waiting: 'Aguardando',
  processing: 'Processando',
  completed: 'Concluído',
  error: 'Erro',
});

export function VideoFileItem({ file, onStartCompression, onRemoveFile, formatFileSize }: VideoFileItemProps) {
  const { id, name, size, status, progress, compressedSize, estimatedTime } = file;

  const compressionPercentage = compressedSize ? Math.round(((size - compressedSize) / size) * 100) : undefined;

  return (
    <div className="p-5 border rounded-xl space-y-4 card-clean hover:border-primary/30 transition-all duration-300 hover-lift">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate text-foreground text-base">{name}</p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground mt-2">
            <span className="flex items-center gap-2">
              <HardDrive className="w-4 h-4" />
              {formatFileSize(size)}
            </span>

            {compressedSize && (
              <span className="flex items-center gap-1 text-success">
                → {formatFileSize(compressedSize)}
                <span className="text-xs bg-success/20 text-success px-2 py-1 rounded-full">
                  -{compressionPercentage}%
                </span>
              </span>
            )}

            {estimatedTime && (
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {estimatedTime}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant={STATUS_VARIANTS[status]} className="px-3 py-1">
            {STATUS_LABELS[status]}
          </Badge>

          {status === StatusProcessing.WAITING && (
            <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90" onClick={() => onStartCompression(id)}>
              <Play className="w-4 h-4" />
              Iniciar
            </Button>
          )}

          {status === StatusProcessing.COMPLETED && (
            <Button size="sm" variant="outline" className="gap-2 border-success/30 text-success hover:bg-success/10">
              <Download className="w-4 h-4" />
              Baixar
            </Button>
          )}

          <Button
            size="sm"
            variant="ghost"
            onClick={() => onRemoveFile(id)}
            className="hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {status === 'processing' && (
        <div className="space-y-2">
          <Progress value={progress} className="h-3 bg-muted/50 border border-primary/20" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progresso: {Math.round(progress)}%</span>
            <span>Tempo restante: {estimatedTime}</span>
          </div>
        </div>
      )}
    </div>
  );
}
