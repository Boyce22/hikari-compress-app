import { StatusProcessing } from './status-processing';

export interface VideoFile {
  id: string;
  name: string;
  uploadedAt: string;
  originalSize?: number;
  processedAt?: string;
  compressedSize?: number;
  compressionRatio?: number;
  progress: StatusProcessing;
  createdAt: string;
  updatedAt: string;
}

export const convertRawToVideoObject = (raw: Record<string, any>): VideoFile => {
  return {
    id: raw['id'],
    name: raw['name'],
    uploadedAt: raw['uploaded_at'],
    originalSize: Number(raw['original_size']),
    processedAt: raw['processed_at'] ?? undefined,
    compressedSize: raw['compressed_size'] ? Number(raw['compressed_size']) : undefined,
    compressionRatio: raw['compression_ratio'] ? Number(raw['compression_ratio']) : undefined,
    progress: raw['progress'],
    createdAt: raw['created_at'],
    updatedAt: raw['updated_at'],
  };
};

export interface FindAllVideoParams {
  page?: number;
  limit?: number;
  orderBy?: (keyof VideoFile)[];
  orderDir?: ('ASC' | 'DESC')[]
}

export interface PaginatedVideo {
  items: VideoFile[];
  total: number;
  page: number;
  limit: number;
}
