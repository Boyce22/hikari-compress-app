import type React from 'react';
import { useState } from 'react';
import { Card } from '@renderer/components/ui/card';
import { Button } from '@renderer/components/ui/button';
import { Badge } from '@renderer/components/ui/badge';
import { Tabs, TabsContent } from '@renderer/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@renderer/components/ui/select';
import { Label } from '@renderer/components/ui/label';
import { Input } from '@renderer/components/ui/input';
import { Separator } from '@renderer/components/ui/separator';
import { Download, ImageIcon } from 'lucide-react';

import { HikariHeader } from '@renderer/components/HikariHeader';
import { FileUploadZone } from '@renderer/components/FIleUploadZone';
import { VideoFileItem } from '@renderer/components/VideoFileItem';
import { QuickSettings } from '@renderer/components/QuickSettings';
import { HikariTabs } from '@renderer/components/HikariTabs';

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

interface HistoryItem {
  id: string;
  name: string;
  originalSize: number;
  compressedSize: number;
  date: string;
  compressionRatio: number;
}

export const HikariCompressApp: React.FC = () => {
  const [videoFiles, setVideoFiles] = useState<VideoFile[]>([]);
  const [history] = useState<HistoryItem[]>([
    {
      id: '1',
      name: 'Attack on Titan S4E21.mkv',
      originalSize: 1024 * 1024 * 800, // 800MB
      compressedSize: 1024 * 1024 * 320, // 320MB
      date: '2024-01-15',
      compressionRatio: 60,
    },
    {
      id: '2',
      name: 'Demon Slayer Movie.mp4',
      originalSize: 1024 * 1024 * 1200, // 1.2GB
      compressedSize: 1024 * 1024 * 480, // 480MB
      date: '2024-01-14',
      compressionRatio: 60,
    },
    {
      id: '3',
      name: 'Jujutsu Kaisen S2E23.mkv',
      originalSize: 1024 * 1024 * 950, // 950MB
      compressedSize: 1024 * 1024 * 380, // 380MB
      date: '2024-01-13',
      compressionRatio: 60,
    },
  ]);

  const [settings, setSettings] = useState({
    codec: 'h264',
    quality: '23',
    keepSubtitles: true,
    keepAudio: true,
    outputPath: '/Downloads/HikariCompress',
    backgroundImage: '',
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles: VideoFile[] = Array.from(files).map((file, index) => ({
        id: `${Date.now()}-${index}`,
        name: file.name,
        size: file.size,
        status: 'waiting',
        progress: 0,
      }));
      setVideoFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleBackgroundImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setSettings((prev) => ({ ...prev, backgroundImage: imageUrl }));
        if (imageUrl) {
          document.documentElement.style.setProperty('--custom-bg-image', `url(${imageUrl})`);
        } else {
          document.documentElement.style.removeProperty('--custom-bg-image');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const startCompression = (fileId: string) => {
    setVideoFiles((prev) =>
      prev.map((file) =>
        file.id === fileId ? { ...file, status: 'processing', progress: 0, estimatedTime: '5 min' } : file,
      ),
    );

    const interval = setInterval(() => {
      setVideoFiles((prev) =>
        prev.map((file) => {
          if (file.id === fileId && file.status === 'processing') {
            const newProgress = Math.min(file.progress + Math.random() * 15, 100);
            if (newProgress >= 100) {
              clearInterval(interval);
              return {
                ...file,
                status: 'completed',
                progress: 100,
                compressedSize: Math.floor(file.size * 0.4),
                estimatedTime: undefined,
              };
            }
            return { ...file, progress: newProgress };
          }
          return file;
        }),
      );
    }, 500);
  };

  const removeFile = (fileId: string) => {
    setVideoFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-6 max-w-7xl flex flex-col items-center justify-center min-h-screen fade-in">
        <HikariHeader />

        <div className="w-full max-w-6xl">
          <Tabs defaultValue="compress" className="space-y-8">
            <HikariTabs value="compress" onValueChange={() => {}} />

            <TabsContent value="compress" className="space-y-8">
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

                <div className="space-y-6">
                  <QuickSettings settings={settings} onSettingsChange={setSettings} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history">
              <Card className="p-6 card-clean max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-foreground">Histórico de Compressões</h3>
                  <Badge variant="outline" className="border-accent/30 text-accent bg-accent/5">
                    {history.length} arquivo(s) processado(s)
                  </Badge>
                </div>
                <div className="space-y-4">
                  {history.map((item) => (
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

            <TabsContent value="settings">
              <Card className="p-8 card-clean max-w-3xl mx-auto">
                <h3 className="text-xl font-semibold mb-8 text-foreground">Configurações Avançadas</h3>
                <div className="space-y-8">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-foreground">Pasta de saída</Label>
                    <Input
                      value={settings.outputPath}
                      onChange={(e) => setSettings((prev) => ({ ...prev, outputPath: e.target.value }))}
                      className="bg-muted/50 border-border/50 hover:border-primary/30 transition-colors"
                    />
                  </div>

                  <Separator className="bg-border/50" />

                  <div className="space-y-6">
                    <h4 className="font-semibold text-lg text-foreground">Personalização da Interface</h4>
                    <div className="space-y-4">
                      <Label className="text-sm font-medium text-foreground">Imagem de fundo personalizada</Label>
                      <div className="flex items-center gap-3">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleBackgroundImageUpload}
                          className="hidden"
                          id="background-upload"
                        />
                        <label htmlFor="background-upload">
                          <Button
                            variant="outline"
                            className="cursor-pointer gap-2 border-accent/30 text-accent hover:bg-accent/10"
                          >
                            <ImageIcon className="w-4 h-4" />
                            Escolher Imagem
                          </Button>
                        </label>
                        {settings.backgroundImage && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSettings((prev) => ({ ...prev, backgroundImage: '' }));
                              document.documentElement.style.removeProperty('--custom-bg-image');
                            }}
                            className="text-destructive hover:bg-destructive/10"
                          >
                            Remover
                          </Button>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Adicione qualquer imagem como fundo da aplicação. A imagem será aplicada com transparência.
                      </p>
                    </div>
                  </div>

                  <Separator className="bg-border/50" />

                  <div className="space-y-6">
                    <h4 className="font-semibold text-lg text-foreground">Configurações de Vídeo</h4>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-foreground">Bitrate máximo (Mbps)</Label>
                        <Input
                          type="number"
                          placeholder="Auto"
                          className="bg-muted/50 border-border/50 hover:border-primary/30 transition-colors"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-foreground">FPS máximo</Label>
                        <Input
                          type="number"
                          placeholder="Original"
                          className="bg-muted/50 border-border/50 hover:border-primary/30 transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-border/50" />

                  <div className="space-y-6">
                    <h4 className="font-semibold text-lg text-foreground">Configurações de Áudio</h4>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-foreground">Codec de áudio</Label>
                        <Select defaultValue="aac">
                          <SelectTrigger className="bg-muted/50 border-border/50 hover:border-primary/30 transition-colors">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="card-clean border-border/50">
                            <SelectItem value="aac">AAC (Recomendado)</SelectItem>
                            <SelectItem value="mp3">MP3 (Universal)</SelectItem>
                            <SelectItem value="opus">Opus (Qualidade)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-foreground">Bitrate de áudio (kbps)</Label>
                        <Select defaultValue="128">
                          <SelectTrigger className="bg-muted/50 border-border/50 hover:border-primary/30 transition-colors">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="card-clean border-border/50">
                            <SelectItem value="96">96 kbps</SelectItem>
                            <SelectItem value="128">128 kbps</SelectItem>
                            <SelectItem value="192">192 kbps</SelectItem>
                            <SelectItem value="256">256 kbps</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
