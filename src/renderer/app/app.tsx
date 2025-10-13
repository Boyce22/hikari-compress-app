import { JSX, useState } from 'react';

import { Dash } from '@/features/dashboard';
import { Settings as SettingsComponent } from '@/features/settings';
import VerticalMenu from '../components/common/vertical-menu';

const TAB_TITLES = {
  dash: 'Comprimir Vídeos',
  settings: 'Configurações',
} as const;

type TabKey = keyof typeof TAB_TITLES;

export const HikariCompressApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('dash');

  const CONTENT_MAP: Record<TabKey, JSX.Element> = {
    dash: <Dash />,
    settings: <SettingsComponent />,
  };

  return (
    <div className="flex h-full overflow-hidden">
      <VerticalMenu activeTab={activeTab} onSelect={(tab) => setActiveTab(tab as TabKey)} />
      <main className="overflow-auto flex flex-1 justify-center h-screen">{CONTENT_MAP[activeTab]}</main>
    </div>
  );
};
