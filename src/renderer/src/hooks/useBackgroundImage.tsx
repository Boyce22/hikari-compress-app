import { useCallback, useState } from 'react';

import { VideoFile } from '@shared/types/VideoFile';
import { FiltersOptions } from '@shared/types/FiltersOptions';
import { StatusProcessing } from '@shared/types/StatusProcessing';

export const useVideoFiles = () => {
  const [videoFiles, setVideoFiles] = useState<VideoFile[]>([]);

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

    setVideoFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const removeFile = useCallback(() => {}, []);

  const startCompression = useCallback(() => {}, []);

  return { videoFiles, handleFileUpload, removeFile, startCompression, setVideoFiles };
};
