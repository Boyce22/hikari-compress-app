import { useEffect, useState } from 'react';
import { RecommendedProfile } from '@/shared/types/recommended-profile';
import { SystemSpecifications } from '@/shared/types/system-specifications';
import { getRecommendedConversionProfile } from '@/shared/utils/get-recommended-conversion-profile';

export const useRecommendedConversionProfile = (specifications?: SystemSpecifications) => {
  const [profile, setProfile] = useState<RecommendedProfile>();

  useEffect(() => {
    if (!specifications) return;

    const recommended = getRecommendedConversionProfile(specifications);

    setProfile(recommended);
  }, [specifications]);

  return { profile, setProfile };
};
