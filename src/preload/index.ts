import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';
import { ConvertOptions } from '@/shared/types/convert-options';
import { OptionsFileDialog } from '@/shared/types/options-file-dialog';
import { SystemSpecifications } from '@/shared/types/system-specifications';

// Custom APIs for renderer
const api = {
  close: async () => await ipcRenderer.invoke('close'),
  maximizeRestore: async () => await ipcRenderer.invoke('maximize-restore'),
  minimize: async () => await ipcRenderer.invoke('minimize'),
  openFileDialog: async (args: OptionsFileDialog) => await ipcRenderer.invoke('open-file-dialog', args),
  compressVideo: async (args: ConvertOptions) => await ipcRenderer.invoke('compress-video', args),
  getSystemSpecs: async (): Promise<SystemSpecifications> => await ipcRenderer.invoke('get-system-specs'),
  storeImage: async (originalPath: string) => await ipcRenderer.invoke('store-image', originalPath),
};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore
  window.electron = electronAPI;
  // @ts-ignore
  window.api = api;
}
