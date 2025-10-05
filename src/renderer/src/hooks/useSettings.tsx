import { useState, useCallback } from 'react';
import { FiltersOptions } from '@shared/types/FiltersOptions';

export const useSettings = () => {
  const [settings, setSettings] = useState({
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
    backgroundImage: '',
  });

  const updateSetting = (key: string, value: any) => setSettings((prev) => ({ ...prev, [key]: value }));

  const handleBackgroundImageUpload = useCallback(async () => {
    if (!window.api) return;

    const files: string[] = await window.api.openFileDialog({
      options: ['openFile'],
      filters: FiltersOptions.IMAGE_FILE_FILTERS,
    });

    if (!files?.length) return;

    const storedPath: string = await window.api.storeImage(files[0]);

    updateSetting('backgroundImage', storedPath);
  }, []);

  const removeBackgroundImage = useCallback(() => updateSetting('backgroundImage', ''), []);

  return {
    settings,
    setSettings,
    updateSetting,
    handleBackgroundImageUpload,
    removeBackgroundImage,
  };
};
