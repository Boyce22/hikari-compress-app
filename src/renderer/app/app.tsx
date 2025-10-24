import { JSX, useEffect, useState } from 'react';

import { Dash } from '@/features/dashboard';
import VerticalMenu from '../components/common/vertical-menu';
import { Settings as SettingsComponent } from '@/features/settings';
import { useVideoFilesContext } from './providers/videos-provider';

const TAB_TITLES = {
  dash: 'Comprimir Vídeos',
  settings: 'Configurações',
} as const;

type TabKey = keyof typeof TAB_TITLES;

export const HikariCompressApp: React.FC = () => {
  const { fetchVideos } = useVideoFilesContext()
  const [activeTab, setActiveTab] = useState<TabKey>('dash');

  useEffect(() => {
    fetchVideos();
  }, []);

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
