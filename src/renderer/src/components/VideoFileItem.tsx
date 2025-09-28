import { Badge } from '@renderer/components/ui/badge';
import { Button } from '@renderer/components/ui/button';
import { Progress } from '@renderer/components/ui/progress';
import { Play, Download, Trash2, HardDrive, Clock } from 'lucide-react';

interface VideoFile {
  id: string;
  name: string;
  size: number;
  status: 'waiting' | 'processing' | 'completed' | 'error';
  progress: number;
  originalSize?: number;
  compressedSize?: number;
  estimatedTime?: string;
}

interface VideoFileItemProps {
  file: VideoFile;
  onStartCompression: (fileId: string) => void;
  onRemoveFile: (fileId: string) => void;
  formatFileSize: (bytes: number) => string;
}

export function VideoFileItem({ file, onStartCompression, onRemoveFile, formatFileSize }: VideoFileItemProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'processing':
        return 'secondary';
      case 'error':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'Aguardando';
      case 'processing':
        return 'Processando';
      case 'completed':
        return 'Concluído';
      case 'error':
        return 'Erro';
      default:
        return 'Desconhecido';
    }
  };

  return (
    <div className="p-5 border rounded-xl space-y-4 card-clean hover:border-primary/30 transition-all duration-300 hover-lift">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate text-foreground text-base">{file.name}</p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground mt-2">
            <span className="flex items-center gap-2">
              <HardDrive className="w-4 h-4" />
              {formatFileSize(file.size)}
            </span>
            {file.compressedSize && (
              <span className="text-success flex items-center gap-1">
                → {formatFileSize(file.compressedSize)}
                <span className="text-xs bg-success/20 text-success px-2 py-1 rounded-full">
                  -{Math.round(((file.size - file.compressedSize) / file.size) * 100)}%
                </span>
              </span>
            )}
            {file.estimatedTime && (
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {file.estimatedTime}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={getStatusVariant(file.status)} className="px-3 py-1">
            {getStatusLabel(file.status)}
          </Badge>
          {file.status === 'waiting' && (
            <Button
              size="sm"
              onClick={() => onStartCompression(file.id)}
              className="gap-2 bg-primary hover:bg-primary/90"
            >
              <Play className="w-4 h-4" />
              Iniciar
            </Button>
          )}
          {file.status === 'completed' && (
            <Button size="sm" variant="outline" className="gap-2 border-success/30 text-success hover:bg-success/10">
              <Download className="w-4 h-4" />
              Baixar
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onRemoveFile(file.id)}
            className="hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      {file.status === 'processing' && (
        <div className="space-y-2">
          <Progress value={file.progress} className="h-3 bg-muted/50 border border-primary/20" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progresso: {Math.round(file.progress)}%</span>
            <span>Tempo restante: {file.estimatedTime}</span>
          </div>
        </div>
      )}
    </div>
  );
}
