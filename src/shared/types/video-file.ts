import type { StatusProcessing } from '@/shared/types/status-processing';

export interface VideoFile {
  id: string;
  name: string;
  uploadedAt: string;
  originalSize?: number;
  processedAt?: string;
  compressedSize?: number;
  compressionRatio?: number;
  progress: StatusProcessing;
}
