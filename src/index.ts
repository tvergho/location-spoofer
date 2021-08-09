import { app, BrowserWindow, ipcMain } from 'electron';
const childProcess = require('child_process');
// This allows TypeScript to pick up the magic constant that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    minWidth: 400,
    minHeight: 400,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, 
      enableRemoteModule: true
    }
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on('coordsChange', (event, latLng) => {
  childProcess.execFile("idevicesetlocation", [
    "--",
    latLng.lat,
    latLng.lng,
  ], (err: any, stdout: string, stderr: string) => {
    event.reply('output', stdout);
    console.log(stdout);
    console.log(stderr);
  });
});

ipcMain.on('reset', (event) => {
  childProcess.execFile("idevicesetlocation", [
    "reset"
  ], (err: any, stdout: string, stderr: string) => {
    console.log(stdout);
    console.log(stderr);
  });
});

ipcMain.on('getDevices', (event) => {
  childProcess.execFile("idevicename", [], (err: any, stdout: string, stderr: string) => {
    if (stdout.includes('No device found') || stdout.length == 0) event.reply('deviceNames', []);
    else event.reply('deviceNames', stdout.split(','));

    console.log(stdout);
    console.log(stderr);
  });
});

ipcMain.on('checkImage', (event) => {
  childProcess.execFile("ideviceimagemounter", ['-l'], (err: any, stdout: string, stderr: string) => {
    if (stdout.includes('No device found')) event.reply('imageMounted', false);
    else event.reply('imageMounted', true);

    console.log(stdout);
    console.log(stderr);
  });
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
