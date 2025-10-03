export interface SystemSpecifications {
  gpu: string;
  ram: number;
  cpu: string;
  cpuCores: number;
  os: string;
  gpuAvailable?: boolean; // opcional, define se pode usar NVENC/VAAPI
}
