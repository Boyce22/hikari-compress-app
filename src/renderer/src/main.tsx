import './globals.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HikariCompressApp } from './App';
import { SettingsProvider } from './providers/SettingsProvider';
import { SidebarProvider } from './components/ui/sidebar';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SidebarProvider>
      <SettingsProvider>
        <HikariCompressApp />
      </SettingsProvider>
    </SidebarProvider>
  </StrictMode>,
);
