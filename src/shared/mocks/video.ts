import { HistoryItem } from '../types/HistoryItem';

export const historyMock: HistoryItem[] = [
  {
    id: '1',
    name: 'video-intro.mp4',
    originalSize: 120_000_000,
    compressedSize: 80_000_000,
    date: '2025-10-10T10:30:00Z',
    compressionRatio: 33,
  },
  {
    id: '2',
    name: 'tutorial-node.mp4',
    originalSize: 250_000_000,
    compressedSize: 175_000_000,
    date: '2025-10-09T15:20:00Z',
    compressionRatio: 30,
  },
  {
    id: '3',
    name: 'presentation.mp4',
    originalSize: 95_000_000,
    compressedSize: 57_000_000,
    date: '2025-10-08T08:45:00Z',
    compressionRatio: 40,
  },
  {
    id: '4',
    name: 'demo-video.mp4',
    originalSize: 180_000_000,
    compressedSize: 126_000_000,
    date: '2025-10-07T12:00:00Z',
    compressionRatio: 30,
  },
  {
    id: '5',
    name: 'webinar.mp4',
    originalSize: 300_000_000,
    compressedSize: 210_000_000,
    date: '2025-10-06T09:15:00Z',
    compressionRatio: 30,
  },
];
