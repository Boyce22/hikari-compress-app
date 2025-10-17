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

  const { specifications, getSystemSpecs, loading } = useSystemSpecifications();
const { setSettings } = useSettingsContext();

// Carrega specs ao montar o componente
useEffect(() => {
  getSystemSpecs();
}, [getSystemSpecs]);

// Aplica perfil recomendado assim que specs estiverem disponíveis
useEffect(() => {
  if (specifications?.cpu) {
    console.log('Specs do sistema:', specifications);
    const profile = getRecommendedConversionProfile(specifications);
    console.log('Perfil recomendado gerado:', profile);
    const recommendedSettings = RecommendedToSettings(profile);
    console.log('Configurações mapeadas para settings:', recommendedSettings);
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