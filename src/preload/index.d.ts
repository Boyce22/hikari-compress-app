import { ElectronAPI } from '@electron-toolkit/preload';

declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      openFileDialog: () => Promise<string[]>;
      compressVideo: (options: ConvertOptions) => Promise<{ size: number; outputPath: string }>;
    };
    electron: typeof electronAPI;
  }
}
