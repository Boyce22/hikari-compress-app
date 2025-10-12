import './styles/globals.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HikariCompressApp } from './app';
import { SettingsProvider } from '@/providers/settings-provider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SettingsProvider>
      <HikariCompressApp />
    </SettingsProvider>
  </StrictMode>,
);
