const os = require('os');
const si = require('systeminformation');


export const getSystemSpecs = async () => {
  const BYTES_TO_GB = 1024 * 1024 * 1024;

  // Obter informações da CPU e núcleos
  let cpu = 'Desconhecido';
  let cpuCores = 1;
  try {
    const cpuInfo = os.cpus();
    cpu = cpuInfo[0]?.model || cpuInfo[0]?.name || 'Desconhecido';
    cpuCores = cpuInfo.length || 1;
  } catch (err) {
    console.warn('Erro ao detectar CPU:', err);
  }

  // Obter memória total
  const mem = os.totalmem();
  const ramGB = (mem || 0) / BYTES_TO_GB;
  const isRamInteger = Math.abs(ramGB - Math.floor(ramGB)) < 0.0001; // Tolerância para ponto flutuante

  // Obter plataforma
  const platformName = os.platform();

  // Obter informações da GPU
  let gpu = 'Desconhecido';
  let gpuMemoryMB = null;
  try {
    const graphics = await si.graphics();
    if (graphics.controllers?.length) {
      gpu = graphics.controllers[0].model || 'Desconhecido';
      gpuMemoryMB = graphics.controllers[0].memoryTotal || null;
    }
  } catch (err) {
    console.warn('Erro ao detectar GPU:', err);
  }

  const gpuLower = gpu.toLowerCase();
  const gpuAvailable = [
    /nvidia.*(gtx|rtx|tesla|quadro|geforce)/i,
    /amd.*(radeon|rx|vega|firepro)/i,
    /intel.*(hd|iris|xe)/i
  ].some(pattern => pattern.test(gpuLower));

  return {
    ram: Math.floor(ramGB), // RAM arredondada para baixo
    cpu,
    os: platformName,
    gpu,
    cpuCores,
    gpuAvailable,
    ramTotalGB: ramGB, // RAM bruta, com decimais
    isGpuDedicated: gpuAvailable && !gpuLower.includes('integrated'),
    isRamInteger,
    gpuMemoryMB // Memória da GPU em MB (se disponível)
  };
};