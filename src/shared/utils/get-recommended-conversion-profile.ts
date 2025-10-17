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
  resolution: '1280x720',
};

export const getRecommendedConversionProfile = (specs: SystemSpecifications): RecommendedProfile => {
  if (!specs || !specs.cpu) {
    return { ...DEFAULT_PROFILE, rationale: 'Falha ao ler specs. Usando perfil padrão.' };
  }

  const { cpu, cpuCores, gpu, gpuAvailable, ram, os } = specs;

  const osFlags = detectOS(os);

  // GPU detectada primeiro
  if (gpuAvailable && gpu) {
    const gpuProfile = detectGPUProfile(gpu, osFlags, ram, cpuCores);
    if (gpuProfile) return gpuProfile;
  }

  // CPU fallback
  return detectCPUProfile(cpu, cpuCores, ram);
};

// ---------------------- Helpers ----------------------

const detectOS = (os: string) => {
  const lower = os.toLowerCase().trim();
  return {
    isLinux: lower.includes('linux'),
    isWindows: lower.includes('win'),
    isMac: lower.includes('darwin'),
  };
};

// GPU profile agora ajusta RAM, resolução e FPS também
const detectGPUProfile = (
  gpu: string,
  { isLinux, isWindows }: { isLinux: boolean; isWindows: boolean },
  ram: number,
  cores: number
): RecommendedProfile | null => {
  const lower = gpu.toLowerCase().trim();

  let profile: RecommendedProfile | null = null;

  if (lower.includes('nvidia')) {
    profile = {
      codec: 'h265',
      encoder: 'hevc_nvenc',
      preset: 'medium',
      hardwareAcceleration: true,
      recommendedRam: Math.min(Math.floor(ram / 4) * 2, 8), // escala RAM
      resolution: ram >= 16 ? '2560x1440' : '1920x1080', // PCs gamers maiores
      fps: cores >= 8 ? 60 : 30,
      crf: ram >= 16 ? 20 : 23,
      rationale: 'GPU NVIDIA detectada — ajustando resolução, FPS e CRF conforme RAM e CPU.',
    };
  } else if (lower.includes('amd')) {
    profile = {
      codec: 'h265',
      encoder: 'hevc_amf',
      preset: 'medium',
      hardwareAcceleration: true,
      recommendedRam: Math.min(Math.floor(ram / 4) * 2, 8),
      resolution: ram >= 16 ? '2560x1440' : '1920x1080',
      fps: cores >= 8 ? 60 : 30,
      crf: ram >= 16 ? 20 : 23,
      rationale: 'GPU AMD detectada — ajustando resolução, FPS e CRF conforme RAM e CPU.',
    };
  } else if (lower.includes('intel')) {
    profile = {
      codec: 'h265',
      encoder: isLinux ? 'hevc_vaapi' : 'hevc_qsv',
      preset: 'medium',
      hardwareAcceleration: true,
      recommendedRam: Math.min(Math.floor(ram / 4) * 2, 8),
      resolution: ram >= 16 ? '1920x1080' : '1280x720',
      fps: cores >= 8 ? 60 : 30,
      crf: 23,
      rationale: 'GPU Intel detectada — usando VAAPI/QSV, ajustando resolução e FPS.',
    };
  }

  return profile;
};

// CPU fallback agora também ajusta tudo baseado em cores e RAM
const detectCPUProfile = (_cpu: string, cores: number, ram: number): RecommendedProfile => {
  if (cores >= 12 && ram >= 16) {
    return {
      codec: 'av1',
      encoder: 'libaom-av1',
      preset: 'good',
      hardwareAcceleration: false,
      recommendedRam: 8,
      resolution: '2560x1440',
      fps: 60,
      crf: 25,
      rationale: 'CPU muito potente e RAM alta — usando AV1 para melhor compressão.',
    };
  }

  if (cores >= 8 && ram >= 8) {
    return {
      codec: 'h265',
      encoder: 'libx265',
      preset: 'slow',
      hardwareAcceleration: false,
      recommendedRam: 6,
      resolution: '1920x1080',
      fps: 30,
      crf: 23,
      rationale: 'CPU forte — H.265 com preset lento para qualidade máxima.',
    };
  }

  if (cores >= 4 && ram >= 4) {
    return {
      codec: 'h264',
      encoder: 'libx264',
      preset: 'medium',
      hardwareAcceleration: false,
      recommendedRam: 4,
      resolution: '1280x720',
      fps: 30,
      crf: 25,
      rationale: 'CPU intermediária — H.264, equilibrando velocidade e qualidade.',
    };
  }

  return {
    codec: 'h264',
    encoder: 'libx264',
    preset: 'ultrafast',
    hardwareAcceleration: false,
    recommendedRam: 2,
    resolution: '854x480',
    fps: 24,
    crf: 28,
    rationale: 'Recursos limitados — priorizando velocidade e compatibilidade.',
  };
};
