export interface SystemSpecifications {
   cpu: string;
  cpuCores: number;
  gpu: string;
  os: string;
  ram: number;
  gpuAvailable: boolean;
  ramTotalGB?: number;
  isGpuDedicated?: boolean;
  isRamInteger?: boolean;
  gpuMemoryMB?: number | null;
}
