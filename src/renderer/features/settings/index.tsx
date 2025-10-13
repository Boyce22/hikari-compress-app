import { memo } from 'react';

import { Separator } from '@/ui/separator';

import { VideoSettings } from '../../features/settings/components/video-settings';
import { AudioSettings } from '../../features/settings/components/audio-settings';
import { StorageSettings } from '../../features/settings/components/storage-settings';
import { BackgroundGallerySettings } from '../../features/settings/components/background-gallery-settings';

export const Settings = memo(() => {
  return (
    <div className="flex-1 overflow-auto bg-background p-12">
      <div className="p-8 space-y-6">
        <StorageSettings />
        <Separator />
        <BackgroundGallerySettings />
        <Separator />
        <VideoSettings />
        <Separator />
        <AudioSettings />
      </div>
    </div>
  );
});
