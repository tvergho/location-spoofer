const {ipcMain} = require('electron');
const log = require('electron-log');
const childProcess = require('child_process');
const util = require('util');
const path = require('path');
const install = require('./install').default;
const exec = util.promisify(childProcess.exec);
const execFile = util.promisify(childProcess.execFile);

const prefix = process.env.NODE_ENV === 'production' ? `${process.resourcesPath}/homebrew/bin` : path.join(__dirname, '..', 'homebrew2/bin');

const logHelper = (funcName: string, stdout: string, stderr: string) => {
  log.info(`${funcName} output: `, stdout);
  if (stderr) log.info(`${funcName} error output: `, stderr);
};

ipcMain.on('coordsChange', async (event, latLng) => {
  try {
    const { stdout, stderr } = await execFile(`${prefix}/idevicesetlocation`, [
      '--',
      latLng.lat,
      latLng.lng,
    ]);
    logHelper('Set location', stdout, stderr);
    event.reply('output', stdout);
    console.log(stdout);
    console.log(stderr);
  } catch (e) {
    console.log(e);
    log.error(e);
  }
});

ipcMain.on('reset', async (event) => {
  try {
    const { stdout, stderr } = await execFile(`${prefix}/idevicesetlocation`, ['reset']);
    logHelper('Reset', stdout, stderr);
    console.log(stdout);
    console.log(stderr);
  } catch (e) {
    console.log(e);
    log.error(e);
  }
});

ipcMain.on('getDevices', async (event) => {
  try {
    const { stdout, stderr } = await execFile(`${prefix}/idevicename`, []);
    logHelper('Get devices', stdout, stderr);

    if (stdout.includes('No device found') || stdout.length === 0) event.reply('deviceNames', []);
    else event.reply('deviceNames', stdout.split(','));

    console.log(stdout);
    console.log(stderr);
  } catch (e) {
    event.reply('deviceNames', []);
    console.log(e);
    log.error(e);
  }
});

ipcMain.on('checkImage', async (event) => {
  try {
    const { stdout, stderr } = await execFile(`${prefix}/ideviceimagemounter`, ['-l']);
    logHelper('Check image mounted', stdout, stderr);

    if (stdout.includes('ImageSignature')) event.reply('imageMounted', true);
    else event.reply('imageMounted', false);
  } catch (e) {
    event.reply('imageMounted', false);
    console.log(e);
    log.error(e);
  }
});

ipcMain.on('checkInstall', async (event) => {
  try {
    await install();
    event.reply('installed', true);
  } catch (e) {
    console.log(e);
    log.error(e);
  }
});