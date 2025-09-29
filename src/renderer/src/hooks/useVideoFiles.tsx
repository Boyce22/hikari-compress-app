import { useCallback, useState } from 'react';
import { VideoFile } from '@renderer/types/VideoFile';

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

  const removeFile = useCallback((fileId: string) => {
    setVideoFiles((prev) => prev.filter((f) => f.id !== fileId));
  }, []);

  const startCompression = useCallback((fileId: string) => {
    setVideoFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, status: 'processing', progress: 0, estimatedTime: '5 min' } : f)),
    );

    const interval = setInterval(() => {
      setVideoFiles((prev) =>
        prev.map((f) => {
          if (f.id !== fileId || f.status !== 'processing') return f;

          const newProgress = Math.min(f.progress + Math.random() * 15, 100);
          if (newProgress >= 100) {
            clearInterval(interval);
            return {
              ...f,
              status: 'completed',
              progress: 100,
              compressedSize: Math.floor(f.size * 0.4),
              estimatedTime: undefined,
            };
          }
          return { ...f, progress: newProgress };
        }),
      );
    }, 500);
  }, []);

  return { videoFiles, handleFileUpload, removeFile, startCompression, setVideoFiles };
};
