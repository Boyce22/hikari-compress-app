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
