export interface VideoFile {
  id: string;
  name: string;
  size: number;
  status: 'waiting' | 'processing' | 'completed' | 'error';
  progress: number;
  originalSize?: number;
  compressedSize?: number;
  estimatedTime?: string;
}