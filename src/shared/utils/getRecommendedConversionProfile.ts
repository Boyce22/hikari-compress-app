import { RecommendedProfile } from '@/shared/types/RecommendedProfile';
import { SystemSpecifications } from '@/shared/types/SystemSpecifications';

const defaultBaseProfile: RecommendedProfile = {
  codec: 'h264',
  encoder: 'libx264',
  crf: 23,
  preset: 'medium',
  hardwareAcceleration: false,
  rationale: 'Perfil padrão de fallback.',
};

export const getRecommendedConversionProfile = (
  specs: SystemSpecifications | null,
): RecommendedProfile => {
  if (!specs) {
    return defaultBaseProfile;
  }

  const { cpu, cpuCores, gpu, gpuAvailable, ram, os } = specs;
  const osFlags = detectOS(os);

  if (gpuAvailable && gpu) {
    const gpuProfile = detectGPUProfile(gpu, osFlags);
    if (gpuProfile) return gpuProfile;
  }

  const cpuProfile = detectCPUProfile(cpu, cpuCores, ram, defaultBaseProfile);

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
    isMac: lower.includes('darwin'), // 'darwin' é mais confiável para macOS
  };
};

const detectGPUProfile = (
  gpu: string,
  { isLinux, isWindows }: { isLinux: boolean; isWindows: boolean },
): RecommendedProfile | null => {
  const lower = gpu.toLowerCase();

  // A ordem importa: 'nvidia' antes de outras chaves que possam aparecer em nomes de laptop
  if (lower.includes('nvidia')) {
    return {
      codec: 'h265',
      encoder: 'hevc_nvenc',
      crf: 23,
      preset: 'p4', // p4 é um bom equilíbrio para NVENC
      hardwareAcceleration: true,
      rationale: 'GPU NVIDIA detectada — usando NVENC HEVC (rápido e eficiente).',
    };
  }
  if (lower.includes('amd')) {
    return {
      codec: 'h265',
      encoder: 'hevc_amf',
      crf: 23,
      preset: 'balanced',
      hardwareAcceleration: true,
      rationale: 'GPU AMD detectada — usando AMF HEVC (boa qualidade e desempenho).',
    };
  }
  if (lower.includes('intel')) {
    return {
      codec: 'h265',
      encoder: isLinux ? 'hevc_vaapi' : 'hevc_qsv',
      crf: 23,
      preset: 'balanced',
      hardwareAcceleration: true,
      rationale: `GPU Intel detectada — usando ${isLinux ? 'VAAPI' : 'QSV'} HEVC.`,
    };
  }

  // TODO: Adiciona isWindows e isMac se necessário para outras GPUs : declare 'isWindows' is declared but its value is never read. 

  return null;
};

const detectCPUProfile = (
  _cpu: string,
  cores: number,
  ram: number,
  base: RecommendedProfile,
): RecommendedProfile => {
  // Perfil para CPUs potentes (Ex: Ryzen 7/9, Core i7/i9) com bastante RAM
  if (cores >= 8 && ram >= 16) {
    return {
      ...base,
      codec: 'h265',
      encoder: 'libx265',
      crf: 23,
      preset: 'medium', // 'slow' pode ser lento demais para uso geral
      rationale: 'CPU forte e RAM alta — H.265 (libx265) com preset medium para alta qualidade.',
    };
  }

  // Perfil para CPUs intermediárias (Ex: Ryzen 5, Core i5)
  if (cores >= 4 && ram >= 8) {
    return {
      ...base,
      codec: 'h264',
      encoder: 'libx264',
      crf: 23,
      preset: 'medium',
      rationale: 'CPU intermediária — H.264 (libx264) para bom equilíbrio entre velocidade e qualidade.',
    };
  }

  // Perfil para CPUs de baixa performance
  return {
    ...base,
    codec: 'h264',
    encoder: 'libx264',
    crf: 28, // CRF maior para arquivos menores em troca de qualidade
    preset: 'fast', // 'ultrafast' tem qualidade muito baixa
    rationale: 'CPU limitada — priorizando velocidade com H.264 e preset fast.',
  };
};

const shouldUseAV1 = (cpu: string, cores: number, ram: number, hwAccel: boolean): boolean => {
  // Condição mais estrita para AV1, que é muito pesado
  const strongCPU = /(ryzen 9|ryzen 7|core i9|core i7|xeon)/i.test(cpu);
  return !hwAccel && ram >= 32 && cores >= 12 && strongCPU;
};
