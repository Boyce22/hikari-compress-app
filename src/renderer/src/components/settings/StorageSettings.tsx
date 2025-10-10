import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Folder } from 'lucide-react';
import { SectionConfig } from '@/components/SectionConfig';
import { useSettingsContext } from '@/renderer/providers/SettingsProvider';

export const StorageSettings = () => {
  const { settings, updateSetting } = useSettingsContext();
  return (
    <>
      <SectionConfig
        icon={Folder}
        label="Armazenamento de Vídeo"
        description={'Defina onde os vídeos processados serão salvos e gerencie o diretório de saída.'}
      />
      <div className="space-y-3">
        <Label className="text-sm font-medium">Pasta de saída</Label>
        <Input
          value={settings.outputPath}
          onChange={(e) => updateSetting('outputPath', e.target.value)}
          placeholder="Selecione o diretório de saída..."
          className="bg-background"
        />
      </div>
    </>
  );
};
