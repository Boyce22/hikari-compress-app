import { useState, useCallback } from 'react';
import { FiltersOptions } from '@/shared/types/FiltersOptions';
import { BackgroundImage } from '@/shared/types/BackgroundImage';

interface Settings {
  codec: string;
  quality: string;
  preset: string;
  resolution: string;
  fps: number;
  keepSubtitles: boolean;
  keepAudio: boolean;
  audioCodec: string;
  audioBitrate: string;
  hardwareAcceleration: boolean;
  outputPath: string;
  backgroundImage: BackgroundImage | null;
}

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>({
    codec: 'h264',
    quality: '23',
    preset: 'medium',
    resolution: '1920x1080',
    fps: 30,
    keepSubtitles: true,
    keepAudio: true,
    audioCodec: 'aac',
    audioBitrate: '128',
    hardwareAcceleration: false,
    outputPath: '/Downloads/HikariCompress',
    backgroundImage: null,
  });

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleBackgroundImageUpload = useCallback(async () => {
    if (!window.api) return;

    const files: string[] = await window.api.openFileDialog({
      options: ['openFile'],
      filters: FiltersOptions.IMAGE_FILE_FILTERS,
    });

    if (!files?.length) return;

    const storedPath: string = await window.api.storeImage(files[0]);

    updateSetting('backgroundImage', {
      id: crypto.randomUUID(),
      name: files[0],
      background: {
        preview: storedPath,
        full: storedPath,
      },
    });
  }, []);

  const removeBackgroundImage = useCallback(() => updateSetting('backgroundImage', null), []);

  return {
    settings,
    setSettings,
    updateSetting,
    handleBackgroundImageUpload,
    removeBackgroundImage,
  };
};
