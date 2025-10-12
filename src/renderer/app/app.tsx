import { JSX, useState } from 'react';
import { historyMock } from '@/shared/mocks/video';

import { Videos } from '@/features/videos';
import { History as HistoryComponent } from '@/features/history';
import { Settings as SettingsComponent } from '@/features/settings';
import VerticalMenu from '../components/common/vertical-menu';

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
      <VerticalMenu activeTab={activeTab} onSelect={(tab) => setActiveTab(tab as TabKey)} />
      <main className="overflow-auto flex flex-1 justify-center h-screen">{CONTENT_MAP[activeTab]}</main>
    </div>
  );
};
