import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { QuickSettings } from '@/components/QuickSettings';
import { VideoFileItem } from '@/components/VideoFileItem';
import { FileUploadZone } from '@/components/FileUploadZone';
import { useFileFormatter } from '@/hooks/useFileFormatter';
import { useVideoFiles } from '@/hooks/useBackgroundImage';

export const Videos: React.FC = () => {
  const { formatFileSize } = useFileFormatter();
  const { videos, handleFileUpload, removeFile, startCompression } = useVideoFiles();

  const hasVideos = videos.length > 0;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div className="xl:col-span-2 space-y-6">
        <FileUploadZone onFileUpload={handleFileUpload} />

        {hasVideos && (
          <Card className="p-6 card-clean">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-foreground">Fila de Compressão</h3>
              <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5">
                {videos.length} arquivo(s)
              </Badge>
            </div>

            <div className="space-y-4">
              {videos.map((file) => (
                <VideoFileItem
                  key={file.id}
                  file={file}
                  onStartCompression={startCompression}
                  onRemoveFile={removeFile}
                  formatFileSize={formatFileSize}
                />
              ))}
            </div>
          </Card>
        )}
      </div>

      <QuickSettings />
    </div>
  );
};
