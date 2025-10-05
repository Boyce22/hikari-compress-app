import type React from 'react';
import { useEffect } from 'react';
import { Download } from 'lucide-react';

import { Card } from '@components/ui/card';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { HikariHeader } from '@components/HikariHeader';
import { Tabs, TabsContent } from '@components/ui/tabs';
import { QuickSettings } from '@components/QuickSettings';
import { VideoFileItem } from '@components/VideoFileItem';
import { FileUploadZone } from '@components/FileUploadZone';

import { Settings } from './components/Settings';
import { HikariTabs } from '@components/HikariTabs';
import { HistoryItem } from '@shared/types/HistoryItem';
import { useFileFormatter } from '@hooks/useFileFormatter';
import { useSystemSpecifications } from './hooks/useSystemSpecifications';
import { useVideoFiles } from './hooks/useBackgroundImage';

const HISTORY: HistoryItem[] = [
  {
    id: '1',
    name: 'Attack on Titan S4E21.mkv',
    originalSize: 1024 * 1024 * 800,
    compressedSize: 1024 * 1024 * 320,
    date: '2024-01-15',
    compressionRatio: 60,
  },
  {
    id: '2',
    name: 'Demon Slayer Movie.mp4',
    originalSize: 1024 * 1024 * 1200,
    compressedSize: 1024 * 1024 * 480,
    date: '2024-01-14',
    compressionRatio: 60,
  },
  {
    id: '3',
    name: 'Jujutsu Kaisen S2E23.mkv',
    originalSize: 1024 * 1024 * 950,
    compressedSize: 1024 * 1024 * 380,
    date: '2024-01-13',
    compressionRatio: 60,
  },
];

export const HikariCompressApp: React.FC = () => {
  const { formatFileSize } = useFileFormatter();
  const { getSystemSpecs } = useSystemSpecifications();
  const { videoFiles, handleFileUpload, removeFile, startCompression } = useVideoFiles();

  useEffect(() => {
    getSystemSpecs();
  }, []);

  return (
    <div className="min-h-screen container mx-auto p-6 max-w-7xl flex flex-col items-center justify-center fade-in">
      <HikariHeader />

      <div className="w-full max-w-6xl">
        <Tabs defaultValue="compress" className="space-y-8">
          <HikariTabs value="compress" onValueChange={() => {}} />

          <TabsContent value="compress">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2 space-y-6">
                <FileUploadZone onFileUpload={handleFileUpload} />

                {videoFiles.length > 0 && (
                  <Card className="p-6 card-clean">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-foreground">Fila de Compressão</h3>
                      <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5">
                        {videoFiles.length} arquivo(s)
                      </Badge>
                    </div>
                    <div className="space-y-4">
                      {videoFiles.map((file) => (
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
          </TabsContent>

          <TabsContent value="history">
            <Card className="p-6 card-clean max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-foreground">Histórico de Compressões</h3>
                <Badge variant="outline" className="border-accent/30 text-accent bg-accent/5">
                  {HISTORY.length} arquivo(s) processado(s)
                </Badge>
              </div>
              <div className="space-y-4">
                {HISTORY.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 border rounded-xl card-clean hover:border-primary/30 transition-all duration-300 hover-lift"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-semibold text-foreground text-base">{item.name}</p>
                      <Badge variant="secondary" className="bg-success/20 text-success border-success/30">
                        {item.compressionRatio}% redução
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-6">
                        <span className="flex items-center gap-2">
                          {formatFileSize(item.originalSize)} →
                          <span className="text-success font-medium">{formatFileSize(item.compressedSize)}</span>
                        </span>
                        <span>{new Date(item.date).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-primary/30 text-primary hover:bg-primary/10"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Configurações avançadas */}
          <TabsContent value="settings">
            <Settings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
