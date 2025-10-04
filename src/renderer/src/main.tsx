import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HikariCompressApp } from './App';
import './globals.css';
import { SettingsProvider } from './providers/SettingsProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SettingsProvider>
      <HikariCompressApp />
    </SettingsProvider>
  </StrictMode>,
);
