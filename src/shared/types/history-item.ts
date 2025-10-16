import { StatusProcessing } from './status-processing';

export interface HistoryItem {
  id: string;
  name: string;
  originalSize: number;
  compressedSize: number;
  date: string;
  compressionRatio: number;
}

export interface HistoryItemWithProgressCompress extends HistoryItem {
  progress?: StatusProcessing;
}
