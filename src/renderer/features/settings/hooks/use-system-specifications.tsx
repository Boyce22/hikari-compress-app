import { useCallback, useState } from 'react';
import { SystemSpecifications } from '@/shared/types/system-specifications';

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
      console.log('Especificações do sistema obtidas com sucesso:', specs);
      if (specs) {
        setSpecifications(specs);
      }
    } catch (error) {
      console.error('Falha ao obter especificações do sistema:', error);
      setSpecifications(DEFAULT_SPECFICATIONS); // Reverte para valores padrão em caso de erro
    }
  }, []);

  return { specifications, getSystemSpecs };
};
