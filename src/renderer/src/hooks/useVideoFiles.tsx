import { useCallback, useState } from 'react';

import { VideoFile } from '@shared/types/VideoFile';

export const useVideoFiles = () => {
  const [videoFiles, setVideoFiles] = useState<VideoFile[]>([]);

  const handleFileUpload = useCallback(async () => {
    if (!window.api) return;

    const filePaths: string[] = await window.api.openFileDialog();
    if (!filePaths?.length) return;

    const newFiles: VideoFile[] = filePaths.map((path, idx) => {
      const name = path.split(/[\\/]/).pop() || path;
      return { id: `${Date.now()}-${idx}`, name, size: 0, status: 'waiting', progress: 0 };
    });

    setVideoFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const removeFile = useCallback(() => {}, []);

  const startCompression = useCallback(() => {}, []);

  return { videoFiles, handleFileUpload, removeFile, startCompression, setVideoFiles };
};
