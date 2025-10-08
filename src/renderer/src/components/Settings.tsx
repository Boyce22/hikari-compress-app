import { memo, useCallback, useMemo, useState } from 'react';

import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { CarouselContent, CarouselItem, Carousel } from './ui/carousel';

import { BACKGROUNDS } from '../lib/background';
import { useSettings } from '@/hooks/useSettings';
import { ImageIcon, Video, Gauge, Zap, Monitor, Film, Music, Volume2, LucideUpload } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const VIDEO_CODECS = Object.freeze([
  { value: 'h264', label: 'H.264' },
  { value: 'h265', label: 'H.265 (HEVC)' },
  { value: 'av1', label: 'AV1' },
]);

const VIDEO_QUALITIES = Object.freeze([
  { value: '18', label: '18 - Muito Alta' },
  { value: '23', label: '23 - Alta' },
  { value: '28', label: '28 - Média' },
  { value: '32', label: '32 - Baixa' },
]);

const PRESETS = Object.freeze([
  { value: 'ultrafast', label: 'Ultra Rápido' },
  { value: 'fast', label: 'Rápido' },
  { value: 'medium', label: 'Médio' },
  { value: 'slow', label: 'Lento' },
  { value: 'veryslow', label: 'Muito Lento' },
]);

const FPS = Object.freeze(['24', '25', '30', '60'].map((v) => ({ value: v, label: v })));

const RESOLUTIONS = Object.freeze([
  { value: 'original', label: 'Original' },
  { value: '1920x1080', label: '1080p (Full HD)' },
  { value: '1280x720', label: '720p (HD)' },
  { value: '854x480', label: '480p (SD)' },
]);

const AUDIO_CODECS = Object.freeze([
  { value: 'aac', label: 'AAC' },
  { value: 'mp3', label: 'MP3' },
  { value: 'opus', label: 'Opus' },
  { value: 'copy', label: 'Copiar Original' },
]);

const AUDIO_BITRATES = Object.freeze(['96', '128', '192', '256', '320']);

const ANIME_BACKGROUNDS = Object.freeze([
  { id: 1, background: BACKGROUNDS.ANIME_BG_1, name: 'Osaka' },
  { id: 2, background: BACKGROUNDS.ANIME_BG_2, name: 'City' },
  { id: 3, background: BACKGROUNDS.ANIME_BG_3, name: 'Peace' },
  { id: 4, background: BACKGROUNDS.ANIME_BG_4, name: 'Dragon' },
  { id: 5, background: BACKGROUNDS.ANIME_BG_5, name: 'Mirror' },
  { id: 6, background: BACKGROUNDS.ANIME_BG_6, name: 'Sunset' },
  { id: 7, background: BACKGROUNDS.ANIME_BG_7, name: 'Night' },
  { id: 8, background: BACKGROUNDS.ANIME_BG_8, name: 'Moon' },
]);

const SelectField = memo(({ label, icon: Icon, value, options, onChange }: any) => {
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
            {options.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
});

const SwitchField = memo(({ label, checked, onChange, description, fullWidth = false }: any) => (
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

const LazyImage = memo(({ src, alt, className = '' }: any) => {
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
        className={`w-full h-32 object-cover select-none transition-opacity duration-500 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
});

const CarouselItemMemo = memo(({ bg, isActive, onSelect }: any) => (
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

export const Settings = memo(() => {
  const { settings, updateSetting, handleBackgroundImageUpload, removeBackgroundImage } = useSettings();

  const handleApplyBackground = useCallback(
    (url) => {
      if (typeof url === 'string' && url.trim()) updateSetting('backgroundImage', url);
    },
    [updateSetting],
  );

  const audioBitrateOptions = useMemo(() => AUDIO_BITRATES.map((b) => ({ value: b, label: `${b} kbps` })), []);

  if (!settings) return null;

  return (
    <Card className="p-8 max-w-4xl mx-auto bg-card border">
      <h3 className="text-xl font-semibold mb-8">Configurações Avançadas</h3>

      <div className="space-y-8">
        <div className="space-y-3">
          <Label className="text-sm font-medium">Pasta de saída</Label>
          <Input
            value={settings.outputPath ?? ''}
            onChange={(e) => updateSetting('outputPath', e.target.value)}
            placeholder="Selecione o diretório de saída..."
            className="bg-background"
          />
        </div>

        <Separator />

        <section className="space-y-6">
          <h4 className="font-semibold text-lg flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Personalização da Interface
          </h4>

          <p className="text-sm text-muted-foreground mt-1">
            Escolha uma imagem de fundo da galeria ou envie uma personalizada.
          </p>

          <div className="space-y-4">
            <Label className="text-sm font-medium">Galeria de fundos</Label>
            <Carousel opts={{ align: 'start', loop: true, dragFree: true }} className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4">
                {ANIME_BACKGROUNDS.map((bg) => (
                  <CarouselItemMemo
                    key={bg.id}
                    bg={bg}
                    isActive={settings.backgroundImage === bg.background.preview}
                    onSelect={() => handleApplyBackground(bg.background.preview)} // trocar para imagem full
                  />
                ))}
              </CarouselContent>
            </Carousel>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="secondary" onClick={handleBackgroundImageUpload} className="gap-2">
              <LucideUpload className="w-4 h-4" />
              Upload
            </Button>

            {settings.backgroundImage && (
              <Button
                variant="outline"
                size="sm"
                onClick={removeBackgroundImage}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                Remover
              </Button>
            )}
          </div>
        </section>

        <Separator />

        {/* Vídeo */}
        <section className="space-y-6">
          <h4 className="font-semibold text-lg flex items-center gap-2">
            <Video className="w-5 h-5" />
            Configurações de Vídeo
          </h4>

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
          </div>
        </section>

        <Separator />

        {/* Áudio */}
        <section className="space-y-6">
          <h4 className="font-semibold text-lg flex items-center gap-2">
            <Music className="w-5 h-5" />
            Configurações de Áudio
          </h4>

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
              options={audioBitrateOptions}
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
