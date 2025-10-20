

import { createContext, useContext, ReactNode } from 'react';
import { useVideoFiles } from '@/renderer/hooks/use-video-files';

type VideosContext = ReturnType<typeof useVideoFiles>;

const VideoFilesContext = createContext<VideosContext | undefined>(undefined);

export const VideoFilesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const videosHook = useVideoFiles();
    return <VideoFilesContext.Provider value={videosHook}>{children}</VideoFilesContext.Provider>;
};

export const useVideoFilesContext = (): VideosContext => {
    const context = useContext(VideoFilesContext);
    if (!context) {
        throw new Error('useVideoFilesContext must be used within a VideoFilesProvider');
    }
    return context;
};
