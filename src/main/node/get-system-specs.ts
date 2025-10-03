const os = require('os');
const si = require('systeminformation');

export const getSystemSpecs = async () => {
  const mem = os.totalmem();
  const cpu = os.cpus()[0]?.model || 'Desconhecido';
  const platform = os.platform();
  let gpu = 'Desconhecido';

  const graphics = await si.graphics();

  if (graphics.controllers?.length) {
    gpu = graphics.controllers[0].model;
  }

  return {
    ram: Math.floor(mem / 1024 / 1024 / 1024), // GB
    cpu,
    os: platform,
    gpu,
    cpuCores: os.cpus().length,
    gpuAvailable: gpu !== 'Desconhecido',
  };
};
