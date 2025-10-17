import { RecommendedProfile } from "../types/recommended-profile";

const mapCrfToQuality = (crf: number): string => {
  if (crf <= 20) return '18'; // Muito Alta
  if (crf <= 24) return '23'; // Alta
  if (crf <= 29) return '28'; // Média
  return '32'; // Baixa
};

export const RecommendedToSettings = (profile: RecommendedProfile) => ({
  codec: profile.codec || 'h264',
  quality: mapCrfToQuality(profile.crf ?? 23),
  preset: profile.preset || 'medium',
  resolution: profile.resolution || '1920x1080',
  fps: profile.fps ?? 30,
  ram: String(profile.recommendedRam ?? 2),
  hardwareAcceleration: !!profile.hardwareAcceleration,
});
