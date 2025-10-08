import { useEffect, useState } from 'react';
import { RecommendedProfile } from '@/shared/types/RecommendedProfile';
import { SystemSpecifications } from '@/shared/types/SystemSpecifications';
import { getRecommendedConversionProfile } from '@/shared/utils/getRecommendedConversionProfile';

export const useRecommendedConversionProfile = (specifications?: SystemSpecifications) => {
  const [profile, setProfile] = useState<RecommendedProfile>();

  useEffect(() => {
    if (!specifications) return;

    const recommended = getRecommendedConversionProfile(specifications);

    setProfile(recommended);
  }, [specifications]);

  return { profile, setProfile };
};
