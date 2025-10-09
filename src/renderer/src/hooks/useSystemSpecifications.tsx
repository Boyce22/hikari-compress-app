import { useCallback, useState } from 'react';
import { SystemSpecifications } from '@/shared/types/SystemSpecifications';

const DEFAULT_SPECFICATIONS: SystemSpecifications = {
  cpu: '',
  cpuCores: 4,
  gpu: '',
  os: '',
  ram: 2,
  gpuAvailable: false,
};

export const useSystemSpecifications = () => {
  const [specifications, setSpecifications] = useState<SystemSpecifications>(DEFAULT_SPECFICATIONS);

  const getSystemSpecs = useCallback(async () => {
    if (!window.api) return;
    const specs = await window.api.getSystemSpecs();

    if (!specs) {
      throw new Error('Não foi possível obter as especificações do sistema.');
    }

    setSpecifications(specs);
  }, []);

  return { specifications, getSystemSpecs };
};
