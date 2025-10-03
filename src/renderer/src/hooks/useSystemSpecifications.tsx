import { useCallback, useState } from 'react';
import { SystemSpecifications } from '@shared/types/SystemSpecifications';

const DEFAULT_SPECS: SystemSpecifications = {
  cpu: '',
  gpu: '',
  ram: 0,
  os: '',
  cpuCores: 0,
};

export const useSystemSpecifications = () => {
  const [specifications, setSpecifications] = useState<SystemSpecifications>(DEFAULT_SPECS);

  const getSystemSpecs = useCallback(async () => {
    if (!window.api) return;
    const specs = await window.api.getSystemSpecs();

    setSpecifications(specs);
  }, []);

  return { specifications, getSystemSpecs };
};
