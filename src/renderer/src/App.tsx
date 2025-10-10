import type React from 'react';
import { FileVideo, History, Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Videos } from '@/components/Videos';
import { History as HistoryComponent } from '@/components/History';
import { Settings as SettingsComponent } from './components/Settings';

const TABS = [
  { value: 'compress', label: 'Comprimir', icon: FileVideo },
  { value: 'history', label: 'Histórico', icon: History },
  { value: 'settings', label: 'Configurações', icon: Settings },
];

const TRIGGER_CLASSES =
  'cursor-pointer flex items-center justify-center gap-2 h-10 rounded-lg font-medium ' +
  'text-foreground/70 hover:text-foreground transition-all duration-300 ' +
  'data-[state=active]:bg-primary/15 data-[state=active]:text-primary ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50';

export const HikariCompressApp: React.FC = () => {
  return (
    <div className="self-center container mx-auto p-6 max-w-7xl flex flex-col items-center justify-center fade-in min-h-screen">
      <div className="w-full max-w-5xl flex flex-col items-center">
        <Tabs defaultValue="compress" className="w-full flex flex-col items-center space-y-8">
          <div className="flex justify-center w-full mb-8">
            <TabsList className="grid grid-cols-3 w-full max-w-md h-12 rounded-xl border border-border/40 bg-card/80 backdrop-blur p-1 shadow-sm">
              {TABS.map(({ value, label, icon: Icon }) => (
                <TabsTrigger key={value} value={value} className={TRIGGER_CLASSES}>
                  <Icon className="w-4 h-4" />
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="compress">
            <Videos />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsComponent />
          </TabsContent>

          <TabsContent value="history">
            <HistoryComponent />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
