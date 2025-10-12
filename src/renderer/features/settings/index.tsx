import { memo } from 'react';

import { Separator } from '@/ui/separator';

import { VideoSettings } from '../../features/settings/components/video-settings';
import { AudioSettings } from '../../features/settings/components/audio-settings';
import { StorageSettings } from '../../features/settings/components/storage-settings';
import { BackgroundGallerySettings } from '../../features/settings/components/background-gallery-settings';

export const Settings = memo(() => {
  return (
    <div>
      <div className="space-y-8 p-10">
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
