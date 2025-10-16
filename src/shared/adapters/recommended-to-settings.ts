import { RecommendedProfile } from '../types/recommended-profile';
import { Settings } from '../types/use-settings';  

export const RecommendedToSettings = (profile: RecommendedProfile | null): Partial<Settings> | null => {
  if (!profile) {
    return null;
  }

  return {
    codec: profile.codec,
    quality: profile.crf.toString(),
    preset: profile.preset,
    hardwareAcceleration: profile.hardwareAcceleration,
  };
};