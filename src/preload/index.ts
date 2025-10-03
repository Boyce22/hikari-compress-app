import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';
import { ConvertOptions } from '@shared/types/ConvertOptions';

// Custom APIs for renderer
const api = {
  openFileDialog: async () => await ipcRenderer.invoke('open-file-dialog'),
  compressVideo: async (options: ConvertOptions) => await ipcRenderer.invoke('compress-video', options),
  getSystemSpecs: async () => await ipcRenderer.invoke('get-system-specs'),
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
