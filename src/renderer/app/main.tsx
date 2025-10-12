import './styles/globals.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HikariCompressApp } from './app';
import { SettingsProvider } from '@/providers/settings-provider';
import { NavigationButtons } from '../features/videos/components/navigation-buttons';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SettingsProvider>
      <NavigationButtons/>
      <HikariCompressApp />
    </SettingsProvider>
  </StrictMode>,
);
