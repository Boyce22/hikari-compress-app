import type React from 'react';
import { useEffect } from 'react';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HikariHeader } from '@/components/HikariHeader';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { QuickSettings } from '@/components/QuickSettings';
import { VideoFileItem } from '@/components/VideoFileItem';
import { FileUploadZone } from '@/components/FileUploadZone';

import { Settings } from './components/Settings';
import { HikariTabs } from '@/components/HikariTabs';

import { useFileFormatter } from '@/hooks/useFileFormatter';
import { useSystemSpecifications } from './hooks/useSystemSpecifications';
import { useVideoFiles } from './hooks/useBackgroundImage';
import { HikariFooter } from './components/HikariFooter';
import { History } from './components/History';

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

      <div className="w-full max-w-5xl">
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

          <TabsContent value="settings">
            <Settings />
          </TabsContent>

          <TabsContent value="history">
            <History />
          </TabsContent>
        </Tabs>
      </div>
      <HikariFooter />
    </div>
  );
};
