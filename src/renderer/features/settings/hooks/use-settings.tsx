import { useState, useCallback } from 'react';
import { FiltersOptions } from '@/shared/types/filters-options';
import { BackgroundImage } from '@/shared/types/background-image';

interface Settings {
  codec: string;
  quality: string;
  preset: string;
  resolution: string;
  fps: number;
  ram: string;
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
    ram: '2',
    hardwareAcceleration: false,
    outputPath: '/Downloads/HikariCompress',
    backgroundImage: null,
  });

  const updateSetting = useCallback(<K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleFolderStorage = useCallback(async () => {
    if (!window.api) return;
    const folders = await window.api.openFileDialog({ options: ['openDirectory'] });
    if (folders?.length) updateSetting('outputPath', folders[0].path);
  }, [updateSetting]);

  const handleBackgroundImageUpload = useCallback(async () => {
    if (!window.api) return;
    const files = await window.api.openFileDialog({
      options: ['openFile'],
      filters: FiltersOptions.IMAGE_FILE_FILTERS,
    });
    if (!files?.length) return;

    const storedPath = await window.api.storeImage(files[0].path);
    updateSetting('backgroundImage', {
      id: crypto.randomUUID(),
      name: files[0].path,
      background: { preview: storedPath, full: storedPath },
    });
  }, [updateSetting]);

  const removeBackgroundImage = useCallback(() => updateSetting('backgroundImage', null), [updateSetting]);

  return {
    settings,
    updateSetting,
    handleFolderStorage,
    handleBackgroundImageUpload,
    removeBackgroundImage,
  };
};
