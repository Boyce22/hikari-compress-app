import { useCallback, useState } from 'react';

import { VideoFile } from '@/shared/types/video';

export const useVideoFiles = () => {
  const [videos, setVideos] = useState<VideoFile[]>([]);

  const fetchVideos = useCallback(async () => {
    const videos = await window.api.findAllVideos();
    setVideos(videos);
    return videos;
  }, []);

  return {
    videos,
    setVideos,
    fetchVideos
  };
};
