<<<<<<< Updated upstream
import { JSX, useState } from 'react';
=======
import { JSX, useEffect, useState } from 'react';
import { historyMock } from '@/shared/mocks/video';
>>>>>>> Stashed changes

import { Dash } from '@/features/dashboard';
import { Settings as SettingsComponent } from '@/features/settings';
import VerticalMenu from '../components/common/vertical-menu';
import { getRecommendedConversionProfile } from '@/shared/utils/get-recommended-conversion-profile';
import { RecommendedToSettings } from '@/shared/adapters/recommended-to-settings';
import { useSettings } from '../features/settings/hooks/use-settings';
import { useSettingsContext } from './providers/settings-provider';
import { useSystemSpecifications } from '../features/settings/hooks/use-system-specifications';

const TAB_TITLES = {
  dash: 'Comprimir Vídeos',
  settings: 'Configurações',
} as const;

type TabKey = keyof typeof TAB_TITLES;

export const HikariCompressApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('dash');

  // ===== Sistema e configurações =====
  const { specifications, getSystemSpecs } = useSystemSpecifications();
  const { setSettings } = useSettingsContext();
  const { settings } = useSettings();
   
  useEffect(() => {
    getSystemSpecs();
  }, [getSystemSpecs]);


  // Aplica configurações recomendadas quando specs estiverem disponíveis
  useEffect(() => {
    if (specifications?.cpu) {
    try {
      const profile = getRecommendedConversionProfile(specifications);
      const recommendedSettings = RecommendedToSettings(profile);
      if (recommendedSettings) setSettings((prev) => ({ ...prev, ...recommendedSettings }));
    } catch (error) {
      console.error( 'Erro ao aplicar configurações recomendadas:', error);
    }
  }
}, [specifications, setSettings]);

  // Log de teste
  useEffect(() => {
    console.log('Configurações automáticas carregadas:', settings);
  }, [settings]);
  // ==================================

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
