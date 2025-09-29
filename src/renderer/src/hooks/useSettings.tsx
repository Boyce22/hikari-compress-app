import { useState } from 'react';

export const useSettings = () => {
  const [settings, setSettings] = useState({
    codec: 'h264',
    quality: '23',
    keepSubtitles: true,
    keepAudio: true,
    outputPath: '/Downloads/HikariCompress',
    backgroundImage: '',
  });

  const handleBackgroundImageUpload = () => {
    console.log('handleBackgroundImageUpload');
  };

  return {
    settings,
    setSettings,
    updateSetting: (key: string, value: any) => setSettings({ ...settings, [key]: value }),
    handleBackgroundImageUpload,
    removeBackgroundImage: () => setSettings({ ...settings, backgroundImage: '' }),
  };
};
