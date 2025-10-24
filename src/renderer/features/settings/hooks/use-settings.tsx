import { useState, useCallback } from 'react';
import { Settings } from '@/shared/types/settings';
import { FiltersOptions } from '@/shared/types/filters-options';

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>({
    id: '',
    codec: 'h264',
    quality: '23',
    preset: 'medium',
    resolution: '1920x1080',
    fps: 30,
    keepSubtitles: 1,
    keepAudio: 1,
    audioCodec: 'aac',
    audioBitrate: '128',
    ram: 2,
    hardwareAcceleration: 0,
    outputPath: '/Downloads/HikariCompress',
    backgroundImage: null,
  });

  const persistSettings = useCallback(async () => {
    const { backgroundImage, ...rest } = settings
    await window.api.updateSettings({ data: rest });
  }, []);


  const updateSetting = useCallback(<K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
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
      preview: storedPath,
      full: storedPath,
    });
  }, [updateSetting]);

  const removeBackgroundImage = useCallback(() => updateSetting('backgroundImage', null), [updateSetting]);

  return {
    settings,
    updateSetting,
    persistSettings,
    handleFolderStorage,
    handleBackgroundImageUpload,
    removeBackgroundImage,
  };
};
