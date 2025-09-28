import { Settings } from 'lucide-react';
import { Card } from '@renderer/components/ui/card';
import { Label } from '@renderer/components/ui/label';
import { Switch } from '@renderer/components/ui/switch';
import { Separator } from '@renderer/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@renderer/components/ui/select';

interface QuickSettingsProps {
  settings: {
    codec: string;
    quality: string;
    keepSubtitles: boolean;
    keepAudio: boolean;
  };
  onSettingsChange: (settings: any) => void;
}

export function QuickSettings({ settings, onSettingsChange }: QuickSettingsProps) {
  return (
    <Card className="p-6 card-clean">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
          <Settings className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Configurações Rápidas</h3>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Codec de Vídeo</Label>
          <Select value={settings.codec} onValueChange={(value) => onSettingsChange({ ...settings, codec: value })}>
            <SelectTrigger className="bg-muted/50 border-border/50 hover:border-primary/30 transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="card-clean border-border/50">
              <SelectItem value="h264">H.264 (Compatível)</SelectItem>
              <SelectItem value="h265">H.265 (Eficiente)</SelectItem>
              <SelectItem value="av1">AV1 (Moderno)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Qualidade (CRF)</Label>
          <Select value={settings.quality} onValueChange={(value) => onSettingsChange({ ...settings, quality: value })}>
            <SelectTrigger className="bg-muted/50 border-border/50 hover:border-primary/30 transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="card-clean border-border/50">
              <SelectItem value="18">18 (Muito Alta - 95% qualidade)</SelectItem>
              <SelectItem value="23">23 (Alta - 85% qualidade)</SelectItem>
              <SelectItem value="28">28 (Média - 70% qualidade)</SelectItem>
              <SelectItem value="32">32 (Baixa - 50% qualidade)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator className="bg-border/50" />

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/30">
            <div>
              <Label className="text-sm font-medium text-foreground">Manter legendas</Label>
              <p className="text-xs text-muted-foreground mt-1">Preservar faixas de legenda originais</p>
            </div>
            <Switch
              checked={settings.keepSubtitles}
              onCheckedChange={(checked) => onSettingsChange({ ...settings, keepSubtitles: checked })}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/30">
            <div>
              <Label className="text-sm font-medium text-foreground">Manter áudio</Label>
              <p className="text-xs text-muted-foreground mt-1">Preservar todas as faixas de áudio</p>
            </div>
            <Switch
              checked={settings.keepAudio}
              onCheckedChange={(checked) => onSettingsChange({ ...settings, keepAudio: checked })}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
