import { app, shell, BrowserWindow, ipcMain, screen, dialog } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import icon from '../../resources/toji-pfp.jpg?asset';

/**
 * Configurações imutáveis do app e da janela principal
 */
const APP_CONFIG = Object.freeze({
  APP_ID: 'com.electron',
  PRELOAD_PATH: join(__dirname, '../preload/index.js'),
  RENDERER_PATH: join(__dirname, '../renderer/index.html'),
  ICON_PATH: icon,
  ICON_LINUX_PATH: join(__dirname, 'assets/icon.png'),
  DEV_RENDERER_URL: process.env['ELECTRON_RENDERER_URL'] || '',
  VIDEO_FILE_FILTERS: [{ name: 'Vídeos', extensions: ['mp4', 'mkv', 'avi', 'mov'] }],
});

/**
 * Cria a janela principal do Electron
 */
function createMainWindow(): BrowserWindow {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const window = new BrowserWindow({
    titleBarStyle: process.platform === 'darwin' ? 'hidden' : undefined,
    width,
    height,
    fullscreenable: true,
    autoHideMenuBar: true,
    icon: process.platform === 'linux' ? APP_CONFIG.ICON_LINUX_PATH : APP_CONFIG.ICON_PATH,
    webPreferences: {
      preload: APP_CONFIG.PRELOAD_PATH,
      sandbox: false,
    },
  });

  // Mostrar janela quando pronta
  window.on('ready-to-show', () => window.show());

  // Abrir links externos no browser padrão
  window.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Carregar conteúdo
  if (is.dev && APP_CONFIG.DEV_RENDERER_URL) {
    window.loadURL(APP_CONFIG.DEV_RENDERER_URL);
  } else {
    window.loadFile(APP_CONFIG.RENDERER_PATH);
  }

  return window;
}

/**
 * Handlers IPC do Electron
 */
const IPC_HANDLERS = Object.freeze({
  init: () => {
    // Ping teste
    ipcMain.on('ping', () => console.log('pong'));

    // Abrir diálogo de arquivos
    ipcMain.handle('open-file-dialog', async () => {
      const win = BrowserWindow.getFocusedWindow();
      if (!win) return [];
      const result = await dialog.showOpenDialog(win, {
        properties: ['openFile', 'multiSelections'],
        filters: APP_CONFIG.VIDEO_FILE_FILTERS,
      });
      return result.filePaths;
    });
  },
});

/**
 * Inicializa a aplicação
 */
function initApp(): void {
  app.whenReady().then(() => {
    // Configura app ID para Windows
    electronApp.setAppUserModelId(APP_CONFIG.APP_ID);

    // Otimiza atalhos
    app.on('browser-window-created', (_, window) => optimizer.watchWindowShortcuts(window));

    // Inicializa handlers IPC
    IPC_HANDLERS.init();

    // Cria janela principal
    createMainWindow();

    // Recria janela no macOS quando clicar no dock
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
    });
  });

  // Fecha app em todas plataformas exceto macOS
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });
}

// Inicialização
initApp();
