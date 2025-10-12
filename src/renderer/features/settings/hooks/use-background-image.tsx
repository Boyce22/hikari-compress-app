import { useCallback, useState } from 'react';

import { VideoFile } from '@/shared/types/video-file';
import { FiltersOptions } from '@/shared/types/filters-options';
import { StatusProcessing } from '@/shared/types/status-processing';

export const useVideoFiles = () => {
  const [videos, setVideos] = useState<VideoFile[]>([]);

  const handleFileUpload = useCallback(async () => {
    if (!window.api) return;

    const filePaths: string[] = await window.api.openFileDialog({
      options: ['multiSelections'],
      filters: FiltersOptions.VIDEO_FILE_FILTERS,
    });

    if (!filePaths?.length) return;

    const newFiles: VideoFile[] = filePaths.map((path, idx) => {
      const name = path.split(/[\\/]/).pop() || path;
      return { id: `${Date.now()}-${idx}`, name, size: 0, status: StatusProcessing.WAITING, progress: 0 };
    });

    setVideos((prev) => [...prev, ...newFiles]);
  }, []);

  const removeFile = useCallback(() => {}, []);

  const startCompression = useCallback(() => {}, []);

  return { videos, handleFileUpload, removeFile, startCompression, setVideos };
};
