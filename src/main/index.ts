import fs from 'fs';
import { compress } from './node/compress';
import { join, basename, extname } from 'path';
import { getSystemSpecs } from './node/get-system-specs';
import { ConvertOptions } from '@/shared/types/convert-options';
import { OptionsFileDialog } from '@/shared/types/options-file-dialog';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import { app, shell, BrowserWindow, ipcMain, dialog, protocol } from 'electron';

const APP_CONFIG = Object.freeze({
  APP_ID: 'com.electron',
  PRELOAD_PATH: join(__dirname, '../preload/index.js'),
  RENDERER_PATH: join(__dirname, '../renderer/index.html'),
  ICON_PATH: join(__dirname, 'assets/ico.jpg'),
  ICON_LINUX_PATH: join(__dirname, 'assets/ico.jpg'),
  DEV_RENDERER_URL: process.env['ELECTRON_RENDERER_URL'] || '',
});

function createMainWindow(): BrowserWindow {
  // const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const window = new BrowserWindow({
    width: 1280,
    height: 720,
    frame: false,
    fullscreenable: true,
    autoHideMenuBar: true,
    titleBarStyle: 'hiddenInset',
    icon: process.platform === 'linux' ? APP_CONFIG.ICON_LINUX_PATH : APP_CONFIG.ICON_PATH,
    webPreferences: {
      preload: APP_CONFIG.PRELOAD_PATH,
      sandbox: false,
    },
  });

  window.webContents.openDevTools();
  window.on('ready-to-show', () => window.show());

  setupExternalLinks(window);
  loadWindowContent(window);

  return window;
}

function setupExternalLinks(window: BrowserWindow) {
  window.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

function loadWindowContent(window: BrowserWindow) {
  if (is.dev && APP_CONFIG.DEV_RENDERER_URL) {
    window.loadURL(APP_CONFIG.DEV_RENDERER_URL);
  } else {
    window.loadFile(APP_CONFIG.RENDERER_PATH);
  }
}

function registerIpcHandlers() {
  ipcMain.handle('open-file-dialog', async (_event, args: OptionsFileDialog) => {
    const win = BrowserWindow.getFocusedWindow();
    if (!win) return [];

    const result = await dialog.showOpenDialog(win, { properties: args.options, filters: args.filters });

    return result.filePaths;
  });

  ipcMain.handle('store-image', async (_, originalPath: string) => {
    const userDataPath = app.getPath('userData');
    const backgroundsPath = join(userDataPath, 'backgrounds');

    fs.mkdirSync(backgroundsPath, { recursive: true });

    const ext = extname(originalPath);
    const name = basename(originalPath, ext);
    const sanitizedName = name.replace(/[^a-zA-Z0-9_-]/g, '');
    const hash = crypto.randomUUID();
    const destName = `${sanitizedName}-${hash}${ext}`;
    const dest = join(backgroundsPath, destName);

    fs.copyFileSync(originalPath, dest);

    return `backgrounds:///${destName}`;
  });

  ipcMain.handle('maximize-restore', async () => {
    const focused = BrowserWindow.getFocusedWindow();

    if (!focused) return null;

    focused.isMaximized() ? focused.unmaximize() : focused.maximize();

    return focused.isMaximized();
  });

  ipcMain.handle('minimize', async () => {
    const focused = BrowserWindow.getFocusedWindow();
    if (!focused) return null;

    focused.minimize();

    return true;
  });

  ipcMain.handle('close', async () => {
    const focused = BrowserWindow.getFocusedWindow();
    if (!focused) return null;

    focused.close();

    return true;
  });

  ipcMain.handle('compress-video', async (_, options: ConvertOptions) => {
    const { size, outputPath } = await compress(options);
    return { size, outputPath };
  });

  ipcMain.handle('get-system-specs', async () => {
    return await getSystemSpecs();
  });
}

function initApp(): void {
  app.whenReady().then(() => {
    setupApp();
    registerBackgroundProtocol();
    registerIpcHandlers();
    createMainWindow();
    setupMacOSActivate();
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });
}

function registerBackgroundProtocol() {
  protocol.handle('backgrounds', async (request) => {
    const url = new URL(request.url);
    const fileName = url.pathname.replace(/^\//, '');
    const filePath = join(app.getPath('userData'), 'backgrounds', fileName);

    try {
      const data = await fs.promises.readFile(filePath);
      const encodeddata = new Uint8Array(data);
      const ext = extname(filePath).slice(1).toLowerCase();
      const mime = getMimeType(ext);

      return new Response(encodeddata, {
        headers: { 'Content-Type': mime },
      });
    } catch (err) {
      console.error('[backgrounds protocol]', err);
      return new Response('Not Found', { status: 404 });
    }
  });
}

function getMimeType(ext: string): string {
  const mimeMap: Record<string, string> = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
  };
  return mimeMap[ext] || 'application/octet-stream';
}

function setupApp() {
  electronApp.setAppUserModelId(APP_CONFIG.APP_ID);
  app.on('browser-window-created', (_, window) => optimizer.watchWindowShortcuts(window));
}

function setupMacOSActivate() {
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
}

initApp();
