import type { StatusProcessing } from '@/shared/types/StatusProcessing';

export interface VideoFile {
  id: string;
  name: string;
  size: number;
  status: StatusProcessing;
  progress: number;
  originalSize?: number;
  compressedSize?: number;
  estimatedTime?: string;
}
