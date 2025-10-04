import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { ImageIcon, Video, Gauge, Zap, Monitor, Film, Music, Volume2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { useSettings } from '@hooks/useSettings';

export const VIDEO_CODECS = [
  { value: 'h264', label: 'H.264' },
  { value: 'h265', label: 'H.265 (HEVC)' },
  { value: 'av1', label: 'AV1' },
];

export const VIDEO_QUALITIES = [
  { value: '18', label: '18 - Muito Alta' },
  { value: '23', label: '23 - Alta' },
  { value: '28', label: '28 - Média' },
  { value: '32', label: '32 - Baixa' },
];

export const PRESETS = [
  { value: 'ultrafast', label: 'Ultra Rápido' },
  { value: 'fast', label: 'Rápido' },
  { value: 'medium', label: 'Médio' },
  { value: 'slow', label: 'Lento' },
  { value: 'veryslow', label: 'Muito Lento' },
];

export const FPS = [
  { value: '24', label: '24' },
  { value: '25', label: '25' },
  { value: '30', label: '30' },
  { value: '60', label: '60' },
];

export const RESOLUTIONS = [
  { value: 'original', label: 'Original' },
  { value: '1920x1080', label: '1080p (Full HD)' },
  { value: '1280x720', label: '720p (HD)' },
  { value: '854x480', label: '480p (SD)' },
];

export const AUDIO_CODECS = [
  { value: 'aac', label: 'AAC' },
  { value: 'mp3', label: 'MP3' },
  { value: 'opus', label: 'Opus' },
  { value: 'copy', label: 'Copiar Original' },
];

export const AUDIO_BITRATES = ['96', '128', '192', '256', '320'];

const SelectField = ({
  label,
  icon: Icon,
  value,
  options,
  onChange,
}: {
  label: string;
  icon?: any;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) => (
  <Card className="p-4 bg-background/50 border">
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-primary" />}
        <Label className="text-sm font-medium">{label}</Label>
      </div>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-background">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </Card>
);

const SwitchField = ({
  label,
  checked,
  onChange,
  description,
  fullWidth = false,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  description?: string;
  fullWidth?: boolean;
}) => (
  <Card className={`p-4 bg-background/50 border ${fullWidth ? 'md:col-span-2' : ''}`}>
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <Label className="text-sm font-medium cursor-pointer">{label}</Label>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  </Card>
);

export const Settings = () => {
  const { settings, updateSetting, handleBackgroundImageUpload, removeBackgroundImage } = useSettings();

  return (
    <Card className="p-8 max-w-4xl mx-auto bg-card border">
      <h3 className="text-xl font-semibold mb-8">Configurações Avançadas</h3>

      <div className="space-y-8">
        {/* Pasta de saída */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Pasta de saída</Label>
          <Input
            value={settings.outputPath}
            onChange={(e) => updateSetting('outputPath', e.target.value)}
            className="bg-background"
          />
        </div>

        <Separator />

        {/* Personalização da Interface */}
        <div className="space-y-6">
          <h4 className="font-semibold text-lg flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Personalização da Interface
          </h4>

          <div className="flex items-center gap-">
            <label htmlFor="background-upload">
              <Button
                variant="outline"
                onClick={handleBackgroundImageUpload}
                className="cursor-pointer gap-2 bg-transparent"
              >
                <span className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Escolher Imagem
                </span>
              </Button>
            </label>

            {settings.backgroundImage && (
              <Button
                variant="ghost"
                size="sm"
                onClick={removeBackgroundImage}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                Remover
              </Button>
            )}
          </div>
          <div className="mt-2 flex items-start gap-2 ">
            <p className="text-sm text-muted-foreground mt-1">
              Personalize a aparência do aplicativo com uma imagem de fundo. A seleção será aplicada imediatamente e
              mantida mesmo após fechar ou reiniciar a aplicação.
            </p>
          </div>
        </div>

        <Separator />

        {/* Vídeo */}
        <div className="space-y-6">
          <h4 className="font-semibold text-lg flex items-center gap-2">
            <Video className="w-5 h-5" />
            Configurações de Vídeo
          </h4>
          <p className="text-sm text-muted-foreground mt-1">
            Configure codec, qualidade e parâmetros de codificação do vídeo
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <SelectField
              label="Codec de vídeo"
              icon={Film}
              value={settings.codec}
              options={VIDEO_CODECS}
              onChange={(v) => updateSetting('codec', v)}
            />
            <SelectField
              label="Qualidade (CRF)"
              icon={Gauge}
              value={settings.quality}
              options={VIDEO_QUALITIES}
              onChange={(v) => updateSetting('quality', v)}
            />
            <SelectField
              label="Preset"
              icon={Zap}
              value={settings.preset}
              options={PRESETS}
              onChange={(v) => updateSetting('preset', v)}
            />
            <SelectField
              label="Resolução"
              icon={Monitor}
              value={settings.resolution}
              options={RESOLUTIONS}
              onChange={(v) => updateSetting('resolution', v)}
            />
            <SelectField
              label="FPS"
              icon={Film}
              value={settings.fps.toString()}
              options={FPS}
              onChange={(v) => updateSetting('fps', Number.parseInt(v))}
            />
          </div>
        </div>

        <Separator />

        {/* Áudio */}
        <div className="space-y-6">
          <h4 className="font-semibold text-lg flex items-center gap-2">
            <Music className="w-5 h-5" />
            Configurações de Áudio
          </h4>
          <p className="text-sm text-muted-foreground mt-1">Configure codec, bitrate e opções de preservação</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              label="Codec de áudio"
              icon={Volume2}
              value={settings.audioCodec}
              options={AUDIO_CODECS}
              onChange={(v) => updateSetting('audioCodec', v)}
            />
            <SelectField
              label="Bitrate (kbps)"
              icon={Gauge}
              value={settings.audioBitrate}
              options={AUDIO_BITRATES.map((b) => ({ value: b, label: b }))}
              onChange={(v) => updateSetting('audioBitrate', v)}
            />

            <SwitchField
              label="Manter faixas de áudio"
              checked={settings.keepAudio}
              onChange={(v) => updateSetting('keepAudio', v)}
            />
            <SwitchField
              label="Manter legendas"
              checked={settings.keepSubtitles}
              onChange={(v) => updateSetting('keepSubtitles', v)}
            />
            <SwitchField
              label="Aceleração de hardware"
              checked={settings.hardwareAcceleration}
              description="Usa GPU para acelerar a codificação (requer suporte de hardware)"
              onChange={(v) => updateSetting('hardwareAcceleration', v)}
              fullWidth
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
