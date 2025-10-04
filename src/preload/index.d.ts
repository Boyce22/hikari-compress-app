import { ElectronAPI } from '@electron-toolkit/preload';
import { OptionsFileDialog } from '@shared/types/OptionsFileDialog';
import { SystemSpecifications } from '@shared/types/SystemSpecifications';

declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      openFileDialog: (options: OptionsFileDialog) => Promise<string[]>;
      compressVideo: (options: ConvertOptions) => Promise<{ size: number; outputPath: string }>;
      getSystemSpecs: () => Promise<SystemSpecifications>;
    };
    electron: typeof electronAPI;
  }
}
