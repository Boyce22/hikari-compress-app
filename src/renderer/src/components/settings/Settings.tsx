import { memo } from 'react';

import { Card } from '../ui/card';
import { Separator } from '../ui/separator';

import { VideoSettings } from './VideoSettings';
import { AudioSettings } from './AudioSettings';
import { StorageSettings } from './StorageSettings';
import { BackgroundGallerySettings } from './BackgroundGallerySettings';

export const Settings = memo(() => {
  return (
    <Card className="p-8 mx-auto bg-card border w-5xl">
      <div className="space-y-8">
        <StorageSettings />
        <Separator />
        <BackgroundGallerySettings />
        <Separator />
        <VideoSettings />
        <Separator />
        <AudioSettings />
      </div>
    </Card>
  );
});
