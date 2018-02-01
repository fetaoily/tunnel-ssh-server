const tunnel = require('tunnel-ssh');
const Log = require('log');
const LOGGER = new Log('info');
const process = require('process');
const pkg = require('../package.json');

/**
 * Default Config
 * @type {{host: (*|string), port: (*|number), username: (*|string), password: (*|string), dstHost: string, dstPort: number, localHost: string, localPort: number, keepAlive: boolean}}
 */
const configDefault = {
  // ssh config
  host: process.env['tunnel_ssh_server_host'] || '127.0.0.1',
  port: process.env['tunnel_ssh_server_port'] || 22,
  username: process.env['tunnel_ssh_server_username'] || 'root',
  password: process.env['tunnel_ssh_server_password'] || '****',
  // dst config
  dstHost: '127.0.0.1',
  dstPort: 22,
  // local config
  localHost: '127.0.0.1',
  localPort: 2222,
  // keep alive
  keepAlive: true
};

const servers = [];

/**
 * Create New Tunnel
 * @param config
 */
const createNewTunnel = (config) => {
  LOGGER.info(`Create New Tunnel: ${JSON.stringify(config)}`);
  config = Object.assign({}, configDefault, config);
  let server = tunnel(config, (err, server) => {
    if (err) {
      LOGGER.error(err);
    }
    server.config = config;
    // LOGGER.info('server', server);
  });
  let dstServerInfo = `dst[${config.dstHost}:${config.dstPort}]`;
  server.on('connection', () => {
    LOGGER.info(`on.connection ${dstServerInfo}`);
  });
  server.on('close', () => {
    LOGGER.info(`on.close ${dstServerInfo}`);
  });
  server.on('error', (err) => {
    LOGGER.error('===================================================================================================');
    LOGGER.error('on.err', err);
    LOGGER.error(`server.config ${dstServerInfo}`);
    LOGGER.error('===================================================================================================');
  });
  servers.push(server);
};

const proxyTable = pkg.config.proxyTable;

proxyTable.forEach((config) => {
  createNewTunnel(config);
});
