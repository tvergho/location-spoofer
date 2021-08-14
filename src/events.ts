const {ipcMain} = require('electron');
const log = require('electron-log');
const childProcess = require('child_process');

const logHelper = (funcName: string, err: any, stdout: string, stderr: string) => {
  if (err) log.error(`${funcName} error: `, err);
  log.info(`${funcName} output: `, stdout);
  if (stderr) log.info(`${funcName} error output: `, stderr);
};

ipcMain.on('coordsChange', (event, latLng) => {
  childProcess.execFile(`idevicesetlocation`, [
    '--',
    latLng.lat,
    latLng.lng,
  ], (err: any, stdout: string, stderr: string) => {
    logHelper('Set location', err, stdout, stderr);

    event.reply('output', stdout);
    console.log(stdout);
    console.log(stderr);
  });
});

ipcMain.on('reset', (event) => {
  childProcess.execFile(`idevicesetlocation`, [
    'reset',
  ], (err: any, stdout: string, stderr: string) => {
    logHelper('Reset', err, stdout, stderr);

    console.log(stdout);
    console.log(stderr);
  });
});

ipcMain.on('getDevices', (event) => {
  childProcess.execFile(`idevicename`, [], (err: any, stdout: string, stderr: string) => {
    logHelper('Get devices', err, stdout, stderr);

    if (stdout.includes('No device found') || stdout.length === 0) event.reply('deviceNames', []);
    else event.reply('deviceNames', stdout.split(','));

    console.log(stdout);
    console.log(stderr);
  });
});

ipcMain.on('checkImage', (event) => {
  childProcess.execFile(`ideviceimagemounter`, ['-l'], (err: any, stdout: string, stderr: string) => {
    logHelper('Check image mounted', err, stdout, stderr);

    if (stdout.includes('No device found')) event.reply('imageMounted', false);
    else event.reply('imageMounted', true);

    console.log(stdout);
    console.log(stderr);
  });
});