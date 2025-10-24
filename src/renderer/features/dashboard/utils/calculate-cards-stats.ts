import { VideoFile } from '@/shared/types/video';
import { Archive, HardDrive, FileVideo, Zap } from 'lucide-react';

export interface CardStat {
  icon: React.ComponentType<any>;
  label: string;
  value: number | string;
  bytes: boolean;
  subtitle: string;
  trend: string;
}

export const calculateCardsStats = (videosCompletos: VideoFile[], days: number = 30): CardStat[] => {
  if (!videosCompletos.length) return [];

  const now = new Date();
  const startPeriod = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  const filterByRange = (from: Date, to: Date) =>
    videosCompletos.filter((v) => {
      const date = new Date(v.processedAt!);
      return date >= from && date <= to;
    });

  const current = filterByRange(startPeriod, now);
  const previous = filterByRange(new Date(startPeriod.getTime() - days * 24 * 60 * 60 * 1000), startPeriod);

  const sum = (arr: VideoFile[], fn: (v: VideoFile) => number) => arr.reduce((total, v) => total + fn(v), 0);
  const average = (arr: VideoFile[], fn: (v: VideoFile) => number) => (arr.length ? sum(arr, fn) / arr.length : 0);

  const calcTrend = (currentVal: number, prevVal: number) => {
    if (prevVal === 0) return currentVal === 0 ? '0%' : '—';
    return `${(((currentVal - prevVal) / prevVal) * 100).toFixed(1)}%`;
  };

  const totalProcessado = sum(current, (v) => v.originalSize ?? 0);
  const espacoEconomizado = sum(current, (v) => (v.originalSize ?? 0) - (v.compressedSize ?? 0));
  const arquivosProcessados = current.length;
  const taxaCompressaoMedia = average(current, (v) => v.compressionRatio ?? 0) * 100;

  return [
    {
      icon: Archive,
      label: 'Total Processado',
      value: totalProcessado,
      bytes: true,
      subtitle: `Últimos ${days} dias`,
      trend: calcTrend(
        totalProcessado,
        sum(previous, (v) => v.originalSize ?? 0),
      ),
    },
    {
      icon: HardDrive,
      label: 'Espaço Economizado',
      value: espacoEconomizado,
      bytes: true,
      subtitle: `Últimos ${days} dias`,
      trend: calcTrend(
        espacoEconomizado,
        sum(previous, (v) => (v.originalSize ?? 0) - (v.compressedSize ?? 0)),
      ),
    },
    {
      icon: FileVideo,
      label: 'Arquivos Processados',
      value: arquivosProcessados,
      bytes: false,
      subtitle: `Últimos ${days} dias`,
      trend: calcTrend(arquivosProcessados, previous.length),
    },
    {
      icon: Zap,
      label: 'Taxa de Compressão',
      value: `${taxaCompressaoMedia.toFixed(1)}%`,
      bytes: false,
      subtitle: `Últimos ${days} dias`,
      trend: calcTrend(taxaCompressaoMedia, average(previous, (v) => v.compressionRatio ?? 0) * 100),
    },
  ];
};
