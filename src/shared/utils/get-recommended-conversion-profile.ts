import { RecommendedProfile } from '@/shared/types/recommended-profile';
import { SystemSpecifications } from '@/shared/types/system-specifications';

export const getRecommendedConversionProfile = (specs: SystemSpecifications): RecommendedProfile => {
  const { cpu, cpuCores, gpu, gpuAvailable, ram, os } = specs;
  const osFlags = detectOS(os);

  const baseProfile: RecommendedProfile = {
    codec: 'h264',
    encoder: 'libx264',
    crf: 23,
    preset: 'medium',
    hardwareAcceleration: false,
    rationale: '',
  };

  if (gpuAvailable && gpu) {
    const gpuProfile = detectGPUProfile(gpu, osFlags);
    if (gpuProfile) return gpuProfile;
  }

  const cpuProfile = detectCPUProfile(cpu, cpuCores, ram, baseProfile);

  if (shouldUseAV1(cpu, cpuCores, ram, cpuProfile.hardwareAcceleration)) {
    return {
      codec: 'av1',
      encoder: 'libaom-av1',
      crf: 30,
      preset: 'good',
      hardwareAcceleration: false,
      rationale: 'CPU muito potente — usando AV1 (melhor compressão, codificação mais lenta).',
    };
  }

  return cpuProfile;
};

const detectOS = (os: string) => {
  const lower = os.toLowerCase();
  return {
    isLinux: lower.includes('linux'),
    isWindows: lower.includes('win'),
    isMac: lower.includes('mac'),
  };
};

const detectGPUProfile = (
  gpu: string,
  { isLinux, isWindows }: { isLinux: boolean; isWindows: boolean },
): RecommendedProfile | null => {
  const lower = gpu.toLowerCase();

  const GPU_MAP: Record<string, () => RecommendedProfile> = {
    nvidia: () => ({
      codec: 'h265',
      encoder: 'hevc_nvenc',
      crf: 23,
      preset: 'p4',
      hardwareAcceleration: true,
      rationale: 'GPU NVIDIA — NVENC HEVC (rápido e eficiente).',
    }),
    amd: () => ({
      codec: 'h265',
      encoder: 'hevc_amf',
      crf: 23,
      preset: 'balanced',
      hardwareAcceleration: true,
      rationale: 'GPU AMD — AMF HEVC (boa qualidade e desempenho).',
    }),
    intel: () => ({
      codec: 'h265',
      encoder: isLinux ? 'hevc_vaapi' : 'hevc_qsv',
      crf: 23,
      preset: 'balanced',
      hardwareAcceleration: true,
      rationale: 'GPU Intel — VAAPI/QSV HEVC.',
    }),
  };

  const match = Object.keys(GPU_MAP).find((key) => lower.includes(key));

  return match && (isLinux || isWindows) ? GPU_MAP[match]() : null;
};

const detectCPUProfile = (_cpu: string, cores: number, ram: number, base: RecommendedProfile): RecommendedProfile => {
  const CPU_MAP: Record<string, () => RecommendedProfile> = {
    high: () => ({
      ...base,
      codec: 'h265',
      encoder: 'libx265',
      crf: 23,
      preset: 'slow',
      rationale: 'CPU forte e RAM alta — H.265 (libx265) com preset lento.',
    }),
    mid: () => ({
      ...base,
      codec: 'h264',
      encoder: 'libx264',
      crf: 23,
      preset: 'medium',
      rationale: 'CPU intermediária — H.264 (libx264) para bom equilíbrio.',
    }),
    low: () => ({
      ...base,
      codec: 'h264',
      encoder: 'libx264',
      crf: 28,
      preset: 'ultrafast',
      rationale: 'CPU limitada — priorizando velocidade com H.264 ultrafast.',
    }),
  };

  if (cores >= 8 && ram >= 16) return CPU_MAP.high();

  if (cores >= 4 && ram >= 8) return CPU_MAP.mid();

  return CPU_MAP.low();
};

const shouldUseAV1 = (cpu: string, cores: number, ram: number, hwAccel: boolean): boolean => {
  const strongCPU = /(ryzen|intel core|xeon)/i.test(cpu);
  return !hwAccel && ram >= 16 && cores >= 12 && strongCPU;
};
