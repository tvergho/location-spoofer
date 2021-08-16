const childProcess = require('child_process');
const util = require('util');
const fs = require('fs');
const path = require('path');
const log = require('electron-log');
const sudoPrompt = require('sudo-prompt');
const exec = util.promisify(childProcess.exec);
const sudoExec = util.promisify(sudoPrompt.exec);

const prefix = process.env.NODE_ENV === 'production' ? `${process.resourcesPath}/homebrew`.split(/\ /).join('\ ') : path.join(__dirname, '..', 'homebrew2').split(/\ /).join('\ ');;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const installLib = (resolve) => {
  const install = childProcess.spawn('bash', [`${prefix}/bin/brew`, 'install', 'libimobiledevice']);
  install.stdout.on('data', (data) => {
    log.info(`stdout: ${data}`);
    console.log(`stdout: ${data}`);
  });
  install.stderr.on('data', (data) => {
    log.info(`stderr: ${data}`);
    console.log(`stderr: ${data}`);
  });
  install.on('close', (code) => {
    console.log(`Installation of libimobiledevice exited with code ${code}`);
    log.info(`Installation of libimobiledevice exited with code ${code}`);
    resolve();
  });
}

const installSsl = (resolve) => {
  const sslInstall = childProcess.spawn('bash', [`${prefix}/bin/brew`, 'install', 'openssl@1.1', '--force-bottle']);
  sslInstall.stdout.on('data', (data) => {
    log.info(`stdout: ${data}`);
    console.log(`stdout: ${data}`);
  });
  sslInstall.stderr.on('data', async (data) => {
    log.info(`stderr: ${data}`);
    console.log(`stderr: ${data}`);
    if (data.includes('Xcode license')) {
      try {
        await sudoExec('xcodebuild -license accept');
        installSsl(resolve);
      } catch (e) {
        console.log(e);
      }
    }
  });

  sslInstall.on('close', (code) => {
    console.log(`Installation of openssl exited with code ${code}`);
    log.info(`Installation of openssl exited with code ${code}`);
    installLib(resolve);
  });
}

const checkCommandLineTools = () => new Promise(async (resolve, reject) => {
  childProcess.exec('xcode-select --print-path', (err, stdout, stderr) => {
    if (err) resolve(false);
    else resolve(true);
  });
});

const main = async () => {
  childProcess.exec('xcode-select --install');
  let installed = false;
  while (!installed) {
    installed = await checkCommandLineTools();
    await sleep(1000);
  }

  console.log(`Checking for brew at ${prefix}...`);
  log.info(`Checking for brew at ${prefix}...`);
  const brewInstalled = fs.existsSync(`${prefix}/bin/brew`);

  if (!brewInstalled) {
    console.log('Brew not installed, installing brew...');
    log.info(`Brew not installed, installing brew...`);
    if (fs.existsSync(prefix)) {
      await exec(`rm -rf "${prefix}"`);
    }
    await exec(`mkdir "${prefix}" && curl -L https://github.com/Homebrew/brew/tarball/master | tar xz --strip 1 -C "${prefix}"`);
  }

  console.log('Checking for libimobiledevice...');
  log.info(`Checking for libimobiledevice...`);
  const libiInstalled = fs.existsSync(`${prefix}/bin/ideviceinfo`);
  if (!libiInstalled) {
    console.log('Installing libimobiledevice...');
    log.info(`Installing libimobiledevice...`);

    return new Promise((resolve, reject) => {
      console.log(`Spawning ${prefix}/bin/brew`);
      log.info(`Spawning ${prefix}/bin/brew`);
      installSsl(resolve);
    });
  }
}

exports.default = main;
