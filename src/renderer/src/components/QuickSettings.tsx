import { InfoIcon, Settings } from 'lucide-react';
import { Card } from '@components/ui/card';
import { Label } from '@components/ui/label';
import { Switch } from '@components/ui/switch';
import { Separator } from '@components/ui/separator';
import { TooltipContent, TooltipTrigger, Tooltip } from './ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';

interface QuickSettingsProps {
  settings: {
    codec: string;
    quality: string;
    keepSubtitles: boolean;
    keepAudio: boolean;
  };
  onSettingsChange: (settings: any) => void;
}

const CLASSES = Object.freeze({
  selectTrigger: 'bg-muted/50 border-border/50 hover:border-primary/30 transition-colors',
  selectContent: 'card-clean border-border/50',
});

const SELECT_OPTIONS = Object.freeze([
  {
    key: 'codec',
    label: 'Codec de Vídeo',
    options: [
      { value: 'h264', label: 'H.264 (Compatível)' },
      { value: 'h265', label: 'H.265 (Eficiente)' },
      { value: 'av1', label: 'AV1 (Moderno)' },
    ],
  },
  {
    key: 'quality',
    label: 'Qualidade (CRF)',
    options: [
      { value: '18', label: '18 (Muito Alta - 95% qualidade)' },
      { value: '23', label: '23 (Alta - 85% qualidade)' },
      { value: '28', label: '28 (Média - 70% qualidade)' },
      { value: '32', label: '32 (Baixa - 50% qualidade)' },
    ],
  },
]);
const CODEC_DESCRIPTIONS = Object.freeze({
  h264: 'H.264: Padrão atual, boa compatibilidade e qualidade, compressão rápida. Arquivos maiores que H.265/AV1.',
  h265: 'H.265: Compressão melhor, arquivos menores, uso maior de CPU/GPU, compatibilidade menor.',
  av1: 'AV1: Melhor compressão e open-source, mas muito lento para codificar e suporte de hardware limitado.',
});

const SWITCH_OPTIONS = Object.freeze([
  {
    key: 'keepSubtitles',
    label: 'Manter legendas',
    description: 'Preservar faixas de legenda originais',
  },
  {
    key: 'keepAudio',
    label: 'Manter áudio',
    description: 'Preservar todas as faixas de áudio',
  },
]);

export function QuickSettings({ settings, onSettingsChange }: QuickSettingsProps) {
  const handleSelectChange = (key: string, value: string) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const handleSwitchChange = (key: string, checked: boolean) => {
    onSettingsChange({ ...settings, [key]: checked });
  };

  return (
    <Card className="p-6 card-clean">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
          <Settings className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Configurações Rápidas</h3>
      </div>

      <div className="space-y-6">
        {SELECT_OPTIONS.map(({ key, label, options }) => (
          <div key={key} className="space-y-3">
            <Label className="text-sm font-medium text-foreground flex items-center gap-1">
              {label}
              {key === 'codec' && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="w-4 h-4 text-muted-foreground cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs whitespace-pre-line">
                    {Object.values(CODEC_DESCRIPTIONS).join('\n\n')}
                  </TooltipContent>
                </Tooltip>
              )}
            </Label>
            <Select value={settings[key]} onValueChange={(value) => handleSelectChange(key, value)}>
              <SelectTrigger className={CLASSES.selectTrigger}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={CLASSES.selectContent}>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}

        <Separator className="bg-border/50" />

        {/* Switches */}
        <div className="space-y-4">
          {SWITCH_OPTIONS.map(({ key, label, description }) => (
            <div
              key={key}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/30"
            >
              <div>
                <Label className="text-sm font-medium text-foreground">{label}</Label>
                <p className="text-xs text-muted-foreground mt-1">{description}</p>
              </div>
              <Switch
                checked={settings[key]}
                onCheckedChange={(checked) => handleSwitchChange(key, checked)}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
