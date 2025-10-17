export interface RecommendedProfile {
  recommendedRam: number;
  fps: number;
  resolution: string;
  codec: 'h264' | 'h265' | 'av1';
  encoder: string;
  crf: number;
  preset: string;
  hardwareAcceleration: boolean;
  rationale: string; // explicação para debug/log
}
