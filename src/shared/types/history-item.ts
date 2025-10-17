import { StatusProcessing } from "./status-processing";

export interface HistoryItem {
  id: string;
  name: string;
  uploadedAt: string;
  originalSize?: number;
  processedAt?: string;
  compressedSize?: number;
  compressionRatio?: number;
  progress?: StatusProcessing;
}
