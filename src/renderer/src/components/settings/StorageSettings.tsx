import { Label } from '@/components/ui/label';

import { Folder, FoldersIcon } from 'lucide-react';
import { SectionConfig } from '@/components/SectionConfig';
import { useSettingsContext } from '@/renderer/providers/SettingsProvider';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';

export const StorageSettings = () => {
  const { settings, handleFolderStorage } = useSettingsContext();
  return (
    <>
      <SectionConfig
        icon={Folder}
        label="Armazenamento de Vídeo"
        description={'Defina onde os vídeos processados serão salvos e gerencie o diretório de saída.'}
      />
      <div className="space-y-3">
        <Label className="text-sm font-medium">Pasta de saída</Label>
        <InputGroup>
          <InputGroupInput
            value={settings.outputPath}
            placeholder="Selecione o diretório de saída..."
            className="bg-background"
            disabled={true}
          />
          <InputGroupAddon onClick={handleFolderStorage} align="inline-end" className="hover:cursor-pointer hover:text-foreground">
            <FoldersIcon />
          </InputGroupAddon>
        </InputGroup>
      </div>
    </>
  );
};
