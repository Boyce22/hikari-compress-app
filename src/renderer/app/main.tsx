import './styles/globals.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HikariCompressApp } from './app';
import { SettingsProvider } from '@/providers/settings-provider';
import { NavigationButtons } from '../components/common/navigation-buttons';
import { VideoFilesProvider } from './providers/videos-provider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <VideoFilesProvider>
      <SettingsProvider>
        <NavigationButtons />
        <HikariCompressApp />
      </SettingsProvider>
    </VideoFilesProvider>
  </StrictMode>,
);
