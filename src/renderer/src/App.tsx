import { JSX, useState } from 'react';
import { Videos } from '@/components/Videos';
import { historyMock } from '@/shared/mocks/video';
import { Separator } from '@/components/ui/separator';
import { HikariSidebar } from '@/components/HikariSidebar';
import { History as HistoryComponent } from '@/components/History';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Settings as SettingsComponent } from '@/components/settings/Settings';
import { NavigationButtons } from './components/NavigationButtons';

const TAB_TITLES = {
  videos: 'Comprimir Vídeos',
  settings: 'Configurações',
  history: 'Histórico',
} as const;

type TabKey = keyof typeof TAB_TITLES;

export const HikariCompressApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('settings');

  const CONTENT_MAP: Record<TabKey, JSX.Element> = {
    videos: <Videos />,
    settings: <SettingsComponent />,
    history: <HistoryComponent historyArr={historyMock} />,
  };

  return (
    <div className="flex h-full overflow-hidden">
      
      <HikariSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <SidebarInset className="w-screen h-screen flex-col">
        <header className="flex h-14 items-center gap-2 border-b px-4 shrink-0">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-6" />
          <h1 className="font-semibold">{TAB_TITLES[activeTab]}</h1>
        </header>

        <main className="overflow-auto">{CONTENT_MAP[activeTab]}</main>
      </SidebarInset>
    </div>
  );
};
