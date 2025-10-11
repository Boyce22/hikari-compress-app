import { memo } from 'react';

import { Separator } from '../ui/separator';

import { VideoSettings } from './VideoSettings';
import { AudioSettings } from './AudioSettings';
import { StorageSettings } from './StorageSettings';
import { BackgroundGallerySettings } from './BackgroundGallerySettings';

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
