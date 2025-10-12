'use client';

import { memo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Trash2, CheckCircle2, Loader2 } from 'lucide-react';

import { VideoFile } from '@/shared/types/VideoFile';
import { useFileFormatter } from '@/renderer/hooks/use-file-formatter';

interface CompressionQueueProps {
  videos: VideoFile[];
  onStartCompression: (id: string) => void;
  onRemoveVideo: (id: string) => void;
}

export const CompressionQueue = memo(function CompressionQueue({
  videos,
  onStartCompression,
  onRemoveVideo,
}: CompressionQueueProps) {
  const { formatFileSize } = useFileFormatter();

  const totalSize = videos.reduce((acc, v) => acc + v.size, 0);
  const pendingCount = videos.filter((v) => v.status === 'waiting').length;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Fila de Compressão</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {videos.length} {videos.length === 1 ? 'vídeo' : 'vídeos'} • {formatFileSize(totalSize)}
          </p>
        </div>
        {pendingCount > 0 && (
          <Badge variant="secondary" className="text-sm px-3 py-1">
            {pendingCount} pendente{pendingCount !== 1 ? 's' : ''}
          </Badge>
        )}
      </div>

      <div className="space-y-3">
        {videos.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>Nenhum vídeo na fila</p>
            <p className="text-sm mt-2">Adicione vídeos para começar a comprimir</p>
          </div>
        ) : (
          videos.map((video) => (
            <div
              key={video.id}
              className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{video.name}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm text-muted-foreground">{formatFileSize(video.size)}</span>
                  {video.status === 'processing' && (
                    <div className="flex-1 max-w-xs">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${video.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {video.status === 'completed' && video.compressedSize && (
                    <span className="text-sm text-primary">→ {formatFileSize(video.compressedSize)}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {video.status === 'waiting' && (
                  <Button
                    size="sm"
                    onClick={() => onStartCompression(video.id)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Comprimir
                  </Button>
                )}
                {video.status === 'processing' && (
                  <Badge variant="secondary" className="gap-2">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Comprimindo
                  </Badge>
                )}
                {video.status === 'completed' && (
                  <Badge className="gap-2 bg-primary/20 text-primary hover:bg-primary/30">
                    <CheckCircle2 className="h-3 w-3" />
                    Concluído
                  </Badge>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onRemoveVideo(video.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
});
