import { useCallback, useState } from 'react';
import { SystemSpecifications } from '@/shared/types/system-specifications';

const DEFAULT_SPECFICATIONS: SystemSpecifications = {
  cpu: '',
  cpuCores: 4,
  gpu: '',
  os: '',
  ram: 2,
  gpuAvailable: false,
  ramTotalGB: 2,
  isGpuDedicated: false,
  isRamInteger: true,
  gpuMemoryMB: null,
};

export const useSystemSpecifications = () => {
  const [specifications, setSpecifications] = useState<SystemSpecifications>(DEFAULT_SPECFICATIONS);
  const [loading, setLoading] = useState(true);

  const getSystemSpecs = useCallback(async () => {
    setLoading(true);
    try {
      if (!window.api?.getSystemSpecs) {
        console.error('API getSystemSpecs não encontrada no preload.');
        setSpecifications(DEFAULT_SPECFICATIONS);
        return;
      }

      const specs: SystemSpecifications = await window.api.getSystemSpecs();
      console.log('Especificações do sistema obtidas:', specs);
      setSpecifications(specs || DEFAULT_SPECFICATIONS);
    } catch (error) {
      console.error('Falha ao obter especificações do sistema:', error);
      setSpecifications(DEFAULT_SPECFICATIONS);
    } finally {
      setLoading(false);
    }
  }, []);

  return { specifications, getSystemSpecs, loading };
};