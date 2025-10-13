import { memo, useCallback, useState } from 'react';
import { ImageIcon, LucideUpload } from 'lucide-react';

import { BACKGROUNDS } from '../lib/background';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { SectionConfig } from '@/components/common/section-config';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';

import { BackgroundImage } from '@/shared/types/background-image';
import { useSettingsContext } from 'src/renderer/app/providers/settings-provider';

interface BackgroundThumbnailProps {
  src: string;
  alt: string;
  className?: string;
}

interface BackgroundCarouselItemProps {
  bg: BackgroundImage;
  isActive: boolean;
  onSelect: () => void;
}

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

const BackgroundThumbnail = memo(({ src, alt, className = '' }: BackgroundThumbnailProps) => {
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

const BackgroundCarouselItem = memo(({ bg, isActive, onSelect }: BackgroundCarouselItemProps) => (
  <CarouselItem className="md:basis-1/4 lg:basis-1/4 xl:basis-1/5 2xl:basis-1/6">
    <div
      onClick={onSelect}
      data-active={isActive}
      className="cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 hover:border-primary border-border data-[active=true]:border-primary data-[active=true]:ring-2 data-[active=true]:ring-primary/50"
    >
      <BackgroundThumbnail src={bg.background.preview} alt={bg.name} />
      <div className="p-2 bg-card/80 backdrop-blur-sm">
        <p className="text-xs font-medium text-center">{bg.name}</p>
      </div>
    </div>
  </CarouselItem>
));

export const BackgroundGallerySettings = () => {
  const { settings, updateSetting, handleBackgroundImageUpload, removeBackgroundImage } = useSettingsContext();

  const handleApplyBackground = useCallback(
    (bg: BackgroundImage) => updateSetting('backgroundImage', bg),
    [updateSetting],
  );

  return (
    <section className="space-y-6">
      <SectionConfig
        icon={ImageIcon}
        label="Personalização da Interface"
        description="Escolha um plano de fundo para a interface ou envie uma imagem personalizada."
      />

      <div className="space-y-4">
        <Label className="text-sm font-medium">Galeria de fundos</Label>
        <Carousel opts={{ align: 'start', dragFree: true }} className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4 mb-4">
            {ANIME_BACKGROUNDS.map((bg) => (
              <BackgroundCarouselItem
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
          className="gap-2 border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors bg-transparent"
        >
          Remover
        </Button>

        <Button variant="default" onClick={handleBackgroundImageUpload} className="hover:cursor-pointer gap-2">
          <LucideUpload className="w-4 h-4" />
          Upload
        </Button>
      </div>
    </section>
  );
};
