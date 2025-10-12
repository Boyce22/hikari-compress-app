import { useSettings } from '@/settings/hooks/use-settings';
import { createContext, useContext, ReactNode } from 'react';

type SettingsHook = ReturnType<typeof useSettings>;

const SettingsContext = createContext<SettingsHook | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const settingsHook = useSettings();
  return <SettingsContext.Provider value={settingsHook}>{children}</SettingsContext.Provider>;
};

export const useSettingsContext = (): SettingsHook => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettingsContext must be used within a SettingsProvider');
  }
  return context;
};
