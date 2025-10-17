import { useEffect, useState } from 'react';
import { getRecommendedConversionProfile } from '@/shared/utils/get-recommended-conversion-profile';
import { SystemSpecifications } from '@/shared/types/system-specifications';
import { RecommendedToSettings } from '@/shared/adapters/recommended-to-settings';
import { Settings } from '@/shared/types/use-settings';

export const useRecommendedConversionProfile = (specifications?: SystemSpecifications) => {
  const [profile, setProfile] = useState<Partial<Settings>>();

  useEffect(() => {
    if (!specifications) return;

    const recommendedRaw = getRecommendedConversionProfile(specifications);
    const recommendedSettings = RecommendedToSettings(recommendedRaw);

    setProfile(recommendedSettings);
  }, [specifications]);

  return { profile, setProfile };
};
