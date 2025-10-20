import { useCallback, useState } from 'react';
import { VideoFile } from '@/shared/types/video-file';
import { FiltersOptions } from '@/shared/types/filters-options';
import { StatusProcessing } from '@/shared/types/status-processing';
// import { historyMock } from '@/shared/mocks/video';

export const useVideoFiles = () => {
  const [videos, setVideos] = useState<VideoFile[]>([]);

  const addVideos = useCallback((newVideos: VideoFile[]) => {
    setVideos(prev => [...newVideos, ...prev]);
  }, []);

  const handleFileUpload = useCallback(async () => {
    if (!window.api) return;

    const filePaths = await window.api.openFileDialog({
      options: ['multiSelections'],
      filters: FiltersOptions.VIDEO_FILE_FILTERS,
    });

    if (!filePaths?.length) return;

    const newFiles: VideoFile[] = await Promise.all(
      filePaths.map(async (file) => {
        const name = file.path.split(/[\\/]/).pop() || file.path;
        return {
          id: crypto.randomUUID(),
          name,
          originalSize: file.originalSize,
          uploadedAt: new Date().toISOString(),
          progress: StatusProcessing.WAITING,
        };
      })
    );

    addVideos(newFiles);
  }, [addVideos]);

  const removeFile = useCallback((id: string) => {
    setVideos(prev => prev.filter(v => v.id !== id));
  }, []);

  const startCompression = useCallback((ids: string[]) => {
    setVideos(prev =>
      prev.map(v =>
        ids.includes(v.id)
          ? { ...v, progress: StatusProcessing.PROCESSING }
          : v
      )
    );
  }, []);

  return {
    videos,
    handleFileUpload,
    removeFile,
    startCompression,
    addVideos,
  };
};
