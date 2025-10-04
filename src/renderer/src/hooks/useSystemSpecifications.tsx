import { useCallback, useState } from 'react';
import { SystemSpecifications } from '@shared/types/SystemSpecifications';
export const useSystemSpecifications = () => {
  const [specifications, setSpecifications] = useState<SystemSpecifications>();

  const getSystemSpecs = useCallback(async () => {
    if (!window.api) return;
    const specs = await window.api.getSystemSpecs();

    setSpecifications(specs);
  }, []);

  return { specifications, getSystemSpecs };
};
