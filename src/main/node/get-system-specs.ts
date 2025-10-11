const os = require('os');
const si = require('systeminformation');

export const getSystemSpecs = async () => {
  const mem = os.totalmem();
  const cpu = os.cpus()[0]?.model || 'Desconhecido';
  const platform = os.platform();
  let gpu = 'Desconhecido';

  try {
    const graphics = await si.graphics();

    if (graphics.controllers?.length) {
      gpu = graphics.controllers[0].model || 'Desconhecido';
    }
  } catch (err) {
    console.warn('Erro ao detectar GPU:', err);
  }

  const gpuLower = gpu.toLowerCase();
  const gpuAvailable = /nvidia|amd|intel/i.test(gpuLower);

  return {
    ram: Math.floor(mem / 1024 / 1024 / 1024), // GB
    cpu,
    os: platform,
    gpu,
    cpuCores: os.cpus().length,
    gpuAvailable,
  };
};

// TODO: Criar função async getRecommendedSettings(): Promise<Settings>
// Objetivo: Retornar um objeto Settings completo baseado nas specs do sistema

// TODO 1: Chamar getSystemSpecs() para obter informações reais do sistema
// const specs = await getSystemSpecs();

// TODO 2: Aplicar a lógica de recomendação diretamente dentro desta função
// - Usar cpu, cores, ram, gpu, gpuAvailable e os flags para decidir:
//   codec, encoder, preset, hardwareAcceleration, rationale
// - Esta é a lógica que antes estava no getRecommendedConversionProfile

// TODO 3: Criar um objeto Settings baseado nos resultados da recomendação
// Preencher todos os campos obrigatórios de Settings:
// - codec
// - quality
// - preset
// - resolution
// - fps
// - ram
// - keepSubtitles
// - keepAudio
// - audioCodec
// - audioBitrate
// - hardwareAcceleration
// - outputPath
// - backgroundImage

// TODO 4: Garantir valores default caso algum campo esteja ausente ou null

// TODO 5: Retornar o objeto Settings completo


