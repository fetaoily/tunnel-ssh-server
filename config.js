const os = require('os');
const fs = require('fs-extra');
const jsonfile = require('jsonfile');
const Log = require('log');
const LOGGER = new Log('info');

const config = [{
  dstHost: '127.0.0.1',
  dstPort: 22,
  localHost: '127.0.0.1',
  localPort: 2222
}];

class Config {
  constructor() {
  }

  static init() {
    LOGGER.info('Init config file start...');
    let configDir = `${os.homedir()}/.tunnel_ssh_server`;
    let configFile = `${configDir}/config.json`;
    LOGGER.info(`Config file dir: ${configDir}`);
    LOGGER.info(`Config file path: ${configFile}`);
    fs.ensureDirSync(configDir);
    if (!fs.pathExistsSync(configFile)) {
      jsonfile.writeFileSync(configFile, config, {spaces: 2})
    }
    LOGGER.info('Init config file success!!!');
  }
}

Config.init();

module.exports.Config = Config;