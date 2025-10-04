export interface RecommendedProfile {
  codec: 'h264' | 'h265' | 'av1';
  encoder: string;
  crf: number;
  preset: string;
  hardwareAcceleration: boolean;
  rationale: string; // explicação para debug/log
}
