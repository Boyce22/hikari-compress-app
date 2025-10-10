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

    try {
      const specs = await window.api.getSystemSpecs();
      if (specs) {
        setSpecifications(specs);
      }
    } catch (error) {
      console.error('Falha ao obter especificações do sistema:', error);
      // Opcional: reverter para o padrão ou mostrar um erro na UI
      setSpecifications(DEFAULT_SPECFICATIONS);
    }
  }, []);

  return { specifications, getSystemSpecs };
};
