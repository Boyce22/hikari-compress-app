import { memo, useCallback, useState } from 'react';

import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { CarouselContent, CarouselItem, Carousel } from './ui/carousel';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

import { BACKGROUNDS } from '../lib/background';
import { BackgroundImage } from '@/shared/types/BackgroundImage';

import {
  ImageIcon,
  Video,
  Gauge,
  Zap,
  Monitor,
  Film,
  Music,
  Volume2,
  LucideUpload,
  Folder,
  SettingsIcon,
  MemoryStick,
} from 'lucide-react';

import { useSettingsContext } from '../providers/SettingsProvider';
import { SystemSpecifications } from '@/shared/types/SystemSpecifications';

interface Option {
  value: string;
  label: string;
}

interface SectionConfigProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

interface SelectFieldProps {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
}

interface SwitchFieldProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
  fullWidth?: boolean;
}

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
}

interface CarouselItemMemoProps {
  bg: BackgroundImage;
  isActive: boolean;
  onSelect: () => void;
}

interface SettingsProps {
  specifications: SystemSpecifications;
}

const VIDEO_CODECS: Option[] = [
  { value: 'h264', label: 'H.264' },
  { value: 'h265', label: 'H.265 (HEVC)' },
  { value: 'av1', label: 'AV1' },
];

const VIDEO_QUALITIES: Option[] = [
  { value: '18', label: '18 - Muito Alta' },
  { value: '23', label: '23 - Alta' },
  { value: '28', label: '28 - Média' },
  { value: '32', label: '32 - Baixa' },
];

const PRESETS: Option[] = [
  { value: 'ultrafast', label: 'Ultra Rápido' },
  { value: 'fast', label: 'Rápido' },
  { value: 'medium', label: 'Médio' },
  { value: 'slow', label: 'Lento' },
  { value: 'veryslow', label: 'Muito Lento' },
];

const FPS: Option[] = ['24', '25', '30', '60'].map((v) => ({ value: v, label: v }));

const RESOLUTIONS: Option[] = [
  { value: 'original', label: 'Original' },
  { value: '1920x1080', label: '1080p (Full HD)' },
  { value: '1280x720', label: '720p (HD)' },
  { value: '854x480', label: '480p (SD)' },
];

const AUDIO_CODECS: Option[] = [
  { value: 'aac', label: 'AAC' },
  { value: 'mp3', label: 'MP3' },
  { value: 'opus', label: 'Opus' },
  { value: 'copy', label: 'Copiar Original' },
];

const MEMORY: Option[] = [
  { value: '2', label: '2GB' },
  { value: '4', label: '4GB' },
  { value: '8', label: '8GB' },
  { value: '16', label: '16GB' },
  { value: '32', label: '32GB' },
  { value: '64', label: '64GB' },
];

const AUDIO_BITRATES: Option[] = [
  { value: '96', label: '96 kbps' },
  { value: '128', label: '128 kbps' },
  { value: '192', label: '192 kbps' },
  { value: '256', label: '256 kbps' },
  { value: '320', label: '320 kbps' },
];

const ANIME_BACKGROUNDS: BackgroundImage[] = [
  { id: '1', background: BACKGROUNDS.ANIME_BG_1, name: 'Osaka' },
  { id: '2', background: BACKGROUNDS.ANIME_BG_2, name: 'City' },
  { id: '3', background: BACKGROUNDS.ANIME_BG_3, name: 'Peace' },
  { id: '4', background: BACKGROUNDS.ANIME_BG_4, name: 'Dragon' },
  { id: '5', background: BACKGROUNDS.ANIME_BG_5, name: 'Mirror' },
  { id: '6', background: BACKGROUNDS.ANIME_BG_6, name: 'Sunset' },
  { id: '7', background: BACKGROUNDS.ANIME_BG_7, name: 'Night' },
  { id: '8', background: BACKGROUNDS.ANIME_BG_8, name: 'Moon' },
];

const SectionConfig = memo(({ icon: Icon, label }: SectionConfigProps) => (
  <div className="flex items-center gap-3">
    <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
      <Icon className="w-5 h-5 text-primary" />
    </div>
    <h3 className="text-lg font-semibold text-foreground">{label}</h3>
  </div>
));

const SelectField = memo(({ label, icon: Icon, value, options, onChange }: SelectFieldProps) => {
  if (!label || !Array.isArray(options)) return null;

  return (
    <Card className="p-4 bg-background/50 border">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-primary" />}
          <Label className="text-sm font-medium">{label}</Label>
        </div>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Selecione..." />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={String(opt.value)} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
});

const SwitchField = memo(({ label, checked, onChange, description, fullWidth = false }: SwitchFieldProps) => (
  <Card className={`p-4 bg-background/50 border ${fullWidth ? 'md:col-span-2' : ''}`}>
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <Label className="text-sm font-medium cursor-pointer">{label}</Label>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  </Card>
));

const LazyImage = memo(({ src, alt, className = '' }: LazyImageProps) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative w-full h-32 bg-muted overflow-hidden rounded ${className}`}>
      {!loaded && <div className="absolute inset-0 animate-pulse bg-muted-foreground/20" />}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`w-full h-32 object-cover select-none transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
});

const CarouselItemMemo = memo(({ bg, isActive, onSelect }: CarouselItemMemoProps) => (
  <CarouselItem className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
    <div
      onClick={onSelect}
      data-active={isActive}
      className="cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 hover:border-primary border-border data-[active=true]:border-primary data-[active=true]:ring-2 data-[active=true]:ring-primary/50"
    >
      <LazyImage src={bg.background.preview} alt={bg.name} />
      <div className="p-2 bg-card/80 backdrop-blur-sm">
        <p className="text-xs font-medium text-center">{bg.name}</p>
      </div>
    </div>
  </CarouselItem>
));

export const Settings = memo(({ specifications }: SettingsProps) => {
  const { settings, updateSetting, handleBackgroundImageUpload, removeBackgroundImage } = useSettingsContext();

  const handleApplyBackground = useCallback(
    (bg: BackgroundImage) => updateSetting('backgroundImage', bg),
    [updateSetting],
  );

  const availableRam = MEMORY.filter((ram) => Number(ram.value) <= Number(specifications?.ram) * 0.8);

  if (!settings) return null;

  return (
    <Card className="p-8 mx-auto bg-card border">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 rounded-lg bg-primary/10">
          <SettingsIcon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-foreground">Configurações Avançadas</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Acesse opções detalhadas para personalizar armazenamento, interface, vídeo e áudio.
          </p>
        </div>
      </div>

      {/* Armazenamento */}
      <SectionConfig icon={Folder} label="Armazenamento de Vídeo" />
      <div className="space-y-8">
        <div className="space-y-3">
          <Label className="text-sm font-medium">Pasta de saída</Label>
          <Input
            value={settings.outputPath}
            onChange={(e) => updateSetting('outputPath', e.target.value)}
            placeholder="Selecione o diretório de saída..."
            className="bg-background"
          />
        </div>

        <Separator />

        {/* Personalização */}
        <section className="space-y-6">
          <SectionConfig icon={ImageIcon} label="Personalização da Interface" />
          <p className="text-sm text-muted-foreground mt-1">
            Escolha uma imagem de fundo da galeria ou envie uma personalizada.
          </p>

          <div className="space-y-4">
            <Label className="text-sm font-medium">Galeria de fundos</Label>
            <Carousel opts={{ align: 'start', loop: true, dragFree: true }} className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4 mb-4">
                {ANIME_BACKGROUNDS.map((bg) => (
                  <CarouselItemMemo
                    key={bg.id}
                    bg={bg}
                    isActive={settings.backgroundImage?.id === bg.id}
                    onSelect={() => handleApplyBackground(bg)}
                  />
                ))}
              </CarouselContent>
            </Carousel>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              disabled={!settings?.backgroundImage?.id}
              variant="outline"
              onClick={removeBackgroundImage}
              className="gap-2 hover:cursor-pointer border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors bg-transparent"
            >
              Remover
            </Button>

            <Button variant="default" className="hover:cursor-pointer" onClick={handleBackgroundImageUpload}>
              <LucideUpload className="w-4 h-4" />
              Upload
            </Button>
          </div>
        </section>

        <Separator />

        {/* Vídeo */}
        <section className="space-y-6">
          <SectionConfig label="Configurações de Vídeo" icon={Video} />
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
              value={String(settings.fps)}
              options={FPS}
              onChange={(v) => updateSetting('fps', parseInt(v, 10))}
            />
            <SelectField
              label="Memória Ram"
              icon={MemoryStick}
              value={settings.ram}
              options={availableRam}
              onChange={(v) => updateSetting('ram', v)}
            />
          </div>
        </section>

        <Separator />

        {/* Áudio */}
        <section className="space-y-6">
          <SectionConfig icon={Music} label="Configurações de Áudio" />
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
              options={AUDIO_BITRATES}
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
              onChange={(v) => updateSetting('hardwareAcceleration', v)}
              description="Usa GPU para acelerar a codificação (requer suporte)"
              fullWidth
            />
          </div>
        </section>
      </div>
    </Card>
  );
});
