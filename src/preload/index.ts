import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';
import { ConvertOptions } from '@/shared/types/ConvertOptions';
import { OptionsFileDialog } from '@/shared/types/OptionsFileDialog';

// Custom APIs for renderer
const api = {
  openFileDialog: async (args: OptionsFileDialog) => await ipcRenderer.invoke('open-file-dialog', args),
  compressVideo: async (args: ConvertOptions) => await ipcRenderer.invoke('compress-video', args),
  getSystemSpecs: async () => await ipcRenderer.invoke('get-system-specs'),
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
