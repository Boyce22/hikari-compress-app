import { ElectronAPI } from '@electron-toolkit/preload';
import { ConvertOptions } from '@/shared/types/convert-options';
import { OptionsFileDialog } from '@/shared/types/open-file-dialog';
import { SystemSpecifications } from '@/shared/types/system-specifications';
import { FileDialog } from '@/shared/types/file-dialog';

declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      openFileDialog: (options: OptionsFileDialog) => Promise<FileDialog[]>;
      compressVideo: (options: ConvertOptions) => Promise<{ size: number; outputPath: string }>;
      getSystemSpecs: () => Promise<SystemSpecifications>;
      storeImage: (originalPath: string) => Promise<string>;
      close: () => Promise<void>;
      maximizeRestore: () => Promise<boolean>;
      minimize: () => Promise<void>;
    };
    electron: typeof electronAPI;
  }
}
