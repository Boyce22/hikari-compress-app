import './globals.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HikariCompressApp } from './App';
import { SettingsProvider } from './providers/SettingsProvider';
import { NavigationButtons } from './components/NavigationButtons';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SettingsProvider>
      <div className="flex flex-col h-screen text-white">
        <NavigationButtons />
        <div className="flex-1 overflow-auto">
          <HikariCompressApp />
        </div>
      </div>
    </SettingsProvider>
  </StrictMode>,
);
