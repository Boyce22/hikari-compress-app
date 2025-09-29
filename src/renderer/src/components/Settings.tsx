import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { ImageIcon } from 'lucide-react';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useSettings } from '@hooks/useSettings'; // seu hook

export const Settings = () => {
  const { settings, updateSetting, handleBackgroundImageUpload, removeBackgroundImage } = useSettings();

  return (
    <Card className="p-8 max-w-3xl mx-auto card-clean">
      <h3 className="text-xl font-semibold mb-8 text-foreground">Configurações Avançadas</h3>
      <div className="space-y-8">
        {/* Pasta de saída */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Pasta de saída</Label>
          <Input
            value={settings.outputPath}
            onChange={(e) => updateSetting('outputPath', e.target.value)}
            className="bg-muted/50 border-border/50 hover:border-primary/30 transition-colors"
          />
        </div>

        <Separator className="bg-border/50" />

        {/* Personalização da Interface */}
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
                  onClick={removeBackgroundImage}
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

        {/* <div className="space-y-6">
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
              <Select value={settings.codec} onValueChange={(value) => updateSetting('codec', value)}>
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
              <Select value={settings.quality} onValueChange={(value) => updateSetting('quality', value)}>
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
        </div> */}
      </div>
    </Card>
  );
};
