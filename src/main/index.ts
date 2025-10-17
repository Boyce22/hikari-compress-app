import fs from 'fs';
import crypto from 'crypto';
import { compress } from './node/compress';
import { join, basename, extname } from 'path';
import iconDev from '../../resources/icon.ico?asset';
import { getSystemSpecs } from './node/get-system-specs';
import { ConvertOptions } from '@/shared/types/convert-options';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import { OptionsFileDialog } from '@/shared/types/options-file-dialog';
import { app, shell, BrowserWindow, ipcMain, dialog, protocol } from 'electron';

const ICON_PATH =
  process.platform === 'darwin' ? join(process.resourcesPath, 'icon.icns') : join(process.resourcesPath, 'icon.ico');

const APP_CONFIG = Object.freeze({
  ICON_PATH: is.dev ? iconDev : ICON_PATH,
  APP_ID: 'br.tsukuyomi-labs.hikari-compress',
  PRELOAD_PATH: join(__dirname, '../preload/index.js'),
  RENDERER_PATH: join(__dirname, '../renderer/index.html'),
  DEV_RENDERER_URL: process.env['ELECTRON_RENDERER_URL'] || '',
});

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

function createMainWindow(): BrowserWindow {
  const window = new BrowserWindow({
    width: 1280,
    height: 720,
    frame: false,
    fullscreenable: true,
    autoHideMenuBar: true,
    titleBarStyle: 'hiddenInset',
    icon: APP_CONFIG.ICON_PATH,
    webPreferences: { preload: APP_CONFIG.PRELOAD_PATH, sandbox: false },
  });

  window.webContents.openDevTools();
  window.on('ready-to-show', () => window.show());

  setupExternalLinks(window);
  loadWindowContent(window);

  return window;
}

function loadWindowContent(window: BrowserWindow) {
  if (is.dev && APP_CONFIG.DEV_RENDERER_URL) {
    window.loadURL(APP_CONFIG.DEV_RENDERER_URL);
  } else {
    window.loadFile(APP_CONFIG.RENDERER_PATH);
  }
}

function setupExternalLinks(window: BrowserWindow) {
  window.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

function registerIpcHandlers() {
  ipcMain.handle('open-file-dialog', handleOpenFileDialog);
  ipcMain.handle('store-image', handleStoreImage);
  ipcMain.handle('maximize-restore', handleMaximizeRestore);
  ipcMain.handle('minimize', handleMinimize);
  ipcMain.handle('close', handleClose);
  ipcMain.handle('compress-video', handleCompressVideo);
  ipcMain.handle('get-system-specs', handleGetSystemSpecs);
}

async function handleOpenFileDialog(_event: any, args: OptionsFileDialog) {
  const win = BrowserWindow.getFocusedWindow();
  if (!win) return [];
  const result = await dialog.showOpenDialog(win, { properties: args.options, filters: args.filters });
  return result.filePaths;
}

async function handleStoreImage(_event: any, originalPath: string) {
  const backgroundsPath = join(app.getPath('userData'), 'backgrounds');
  fs.mkdirSync(backgroundsPath, { recursive: true });

  const { sanitizedName, ext } = sanitizeFileName(originalPath);
  const destName = `${sanitizedName}-${crypto.randomUUID()}${ext}`;
  const dest = join(backgroundsPath, destName);

  fs.copyFileSync(originalPath, dest);
  return `backgrounds:///${destName}`;
}

function sanitizeFileName(filePath: string) {
  const ext = extname(filePath);
  const name = basename(filePath, ext).replace(/[^a-zA-Z0-9_-]/g, '');
  return { sanitizedName: name, ext };
}

function handleMaximizeRestore() {
  const win = BrowserWindow.getFocusedWindow();
  if (!win) return null;
  win.isMaximized() ? win.unmaximize() : win.maximize();
  return win.isMaximized();
}

function handleMinimize() {
  const win = BrowserWindow.getFocusedWindow();
  if (!win) return null;
  win.minimize();
  return true;
}

function handleClose() {
  const win = BrowserWindow.getFocusedWindow();
  if (!win) return null;
  win.close();
  return true;
}

async function handleCompressVideo(_event: any, options: ConvertOptions) {
  const { size, outputPath } = await compress(options);
  return { size, outputPath };
}

async function handleGetSystemSpecs() {
  return await getSystemSpecs();
}

function registerBackgroundProtocol() {
  protocol.handle('backgrounds', async (request) => {
    const filePath = join(app.getPath('userData'), 'backgrounds', new URL(request.url).pathname.replace(/^\//, ''));

    try {
      const data = await fs.promises.readFile(filePath);
      const ext = extname(filePath).slice(1).toLowerCase();
      return new Response(new Uint8Array(data), { headers: { 'Content-Type': getMimeType(ext) } });
    } catch (err) {
      console.error('[backgrounds protocol]', err);
      return new Response('Not Found', { status: 404 });
    }
  });
}

function getMimeType(ext: string): string {
  return (
    {
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      gif: 'image/gif',
      webp: 'image/webp',
      svg: 'image/svg+xml',
    }[ext] || 'application/octet-stream'
  );
}

function setupApp() {
  electronApp.setAppUserModelId(APP_CONFIG.APP_ID);
  app.on('browser-window-created', (_, win) => optimizer.watchWindowShortcuts(win));
}

function setupMacOSActivate() {
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
}

initApp();
