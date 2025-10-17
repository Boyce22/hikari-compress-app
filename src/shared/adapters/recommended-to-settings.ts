import { RecommendedProfile } from "../types/recommended-profile";

export const RecommendedToSettings = (profile: RecommendedProfile) => ({
  codec: profile.codec,
  quality: profile.crf.toString(),
  preset: profile.preset,
  resolution: profile.resolution ?? '1920x1080',
  fps: profile.fps ?? 30,
  ram: (profile.recommendedRam ?? 2).toString(),
  keepSubtitles: true,
  keepAudio: true,
  audioCodec: 'aac',
  audioBitrate: '192',
  hardwareAcceleration: profile.hardwareAcceleration,
  outputPath: '',
  backgroundImage: null,
});
