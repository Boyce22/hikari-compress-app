import { JSX, useEffect, useState } from 'react';

import { Dash } from '@/features/dashboard';
import { Settings as SettingsComponent } from '@/features/settings';
import VerticalMenu from '../components/common/vertical-menu';
import { useSettingsContext } from './providers/settings-provider';
import { useSystemSpecifications } from '../features/settings/hooks/use-system-specifications';
import { getRecommendedConversionProfile } from '@/shared/utils/get-recommended-conversion-profile';
import { RecommendedToSettings } from '@/shared/adapters/recommended-to-settings';


const TAB_TITLES = {
  dash: 'Comprimir Vídeos',
  settings: 'Configurações',
} as const;

type TabKey = keyof typeof TAB_TITLES;

export const HikariCompressApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('dash');

  const { specifications, getSystemSpecs } = useSystemSpecifications();
const { setSettings } = useSettingsContext();

useEffect(() => {
  getSystemSpecs();
}, [getSystemSpecs]);

useEffect(() => {
  if (specifications?.cpu) {
    const profile = getRecommendedConversionProfile(specifications);
    const recommendedSettings = RecommendedToSettings(profile);
    setSettings(prev => ({ ...prev, ...recommendedSettings }));
  }
}, [specifications, setSettings]);


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