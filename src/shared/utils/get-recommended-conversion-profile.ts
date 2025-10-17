import { RecommendedProfile } from '@/shared/types/recommended-profile';
import { SystemSpecifications } from '@/shared/types/system-specifications';

const DEFAULT_PROFILE: RecommendedProfile = {
  codec: 'h264',
  encoder: 'libx264',
  crf: 23,
  preset: 'medium',
  hardwareAcceleration: false,
  rationale: 'Perfil padrão: bom equilíbrio entre qualidade e velocidade.',
  recommendedRam: 4,
  fps: 30,
  resolution: '1920x1080',
};

export const getRecommendedConversionProfile = (specs: SystemSpecifications): RecommendedProfile => {
  if (!specs || !specs.cpu) {
    return { ...DEFAULT_PROFILE, rationale: 'Falha ao ler especificações. Usando perfil padrão.' };
  }

  const { cpu, cpuCores, gpu, gpuAvailable, ram, os } = specs;
  const osFlags = detectOS(os);

  if (gpuAvailable && gpu) {
    const gpuProfile = detectGPUProfile(gpu, osFlags);
    if (gpuProfile) return { ...DEFAULT_PROFILE, ...gpuProfile };
  }

  const cpuProfile = detectCPUProfile(cpu, cpuCores, ram);

  if (shouldUseAV1(cpu, cpuCores, ram, !!cpuProfile.hardwareAcceleration)) {
    return {
      ...DEFAULT_PROFILE,
      codec: 'av1',
      encoder: 'libaom-av1',
      crf: 30,
      preset: 'good',
      hardwareAcceleration: false,
      rationale: 'CPU muito potente — usando AV1 (melhor compressão, codificação mais lenta).',
    };
  }

  return { ...DEFAULT_PROFILE, ...cpuProfile };
};

const detectOS = (os: string) => {
  const lower = os.toLowerCase().trim();
  return {
    isLinux: lower.includes('linux'),
    isWindows: lower.includes('win'),
    isMac: lower.includes('darwin'),
  };
};

const detectGPUProfile = (
  gpu: string,
  { isLinux, isWindows }: { isLinux: boolean; isWindows: boolean },
): Partial<RecommendedProfile> | null => {
  const lower = gpu.toLowerCase().trim();

  const GPU_MAP: Record<string, () => Partial<RecommendedProfile>> = {
    nvidia: () => ({
      codec: 'h265',
      encoder: 'hevc_nvenc',
      preset: 'medium', // Alterado de 'p4' para 'medium'
      hardwareAcceleration: true,
      rationale: 'GPU NVIDIA detectada — usando NVENC HEVC (rápido e eficiente).',
    }),
    amd: () => ({
      codec: 'h265',
      encoder: 'hevc_amf',
      preset: 'medium', // Alterado de 'balanced' para 'medium'
      hardwareAcceleration: true,
      rationale: 'GPU AMD detectada — usando AMF HEVC (boa qualidade e desempenho).',
    }),
    intel: () => ({
      codec: 'h265',
      encoder: isLinux ? 'hevc_vaapi' : 'hevc_qsv',
      preset: 'medium', // Alterado de 'balanced' para 'medium'
      hardwareAcceleration: true,
      rationale: 'GPU Intel detectada — usando VAAPI/QSV HEVC.',
    }),
  };

  const match = Object.keys(GPU_MAP).find((key) => lower.includes(key));

  return match && (isLinux || isWindows) ? GPU_MAP[match]() : null;
};

const detectCPUProfile = (_cpu: string, cores: number, ram: number): Partial<RecommendedProfile> => {
  if (cores >= 8 && ram >= 16) {
    return {
      codec: 'h265',
      encoder: 'libx265',
      preset: 'slow',
      recommendedRam: 8,
      rationale: 'CPU forte e RAM alta — H.265 (libx265) com preset lento para máxima qualidade.',
    };
  }

  if (cores >= 4 && ram >= 8) {
    return {
      codec: 'h264',
      encoder: 'libx264',
      preset: 'medium',
      recommendedRam: 4,
      rationale: 'CPU intermediária — H.264 (libx264) para bom equilíbrio entre velocidade e qualidade.',
    };
  }

  return {
    codec: 'h264',
    encoder: 'libx264',
    crf: 28,
    preset: 'ultrafast',
    recommendedRam: 2,
    rationale: 'Recursos limitados — priorizando velocidade com H.264 e preset ultrarrápido.',
  };
};

const shouldUseAV1 = (cpu: string, cores: number, ram: number, hwAccel: boolean): boolean => {
  const strongCPU = /(ryzen|core i\d|xeon)/i.test(cpu.toLowerCase().trim());
  return !hwAccel && ram >= 16 && cores >= 12 && strongCPU;
};
