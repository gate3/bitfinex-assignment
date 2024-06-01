const { GRAPE_CONFIG, HOST } = require('./constants');

const Grape = require('grenache-grape').Grape;

class DHT {
  constructor(id, { dht_port, dht_bootstrap, api_port }) {
    this.id = id;
    const grape = new Grape({
      dht_port,
      dht_bootstrap: [`${HOST}:${dht_bootstrap}`],
      api_port,
      dht_concurrency: 3,
    });

    grape.start();
    grape.once('ready', () => {
      console.log('bootstrap complete', this.id);
    });

    grape.once('listening', () => {
      console.log('listening for connections complete', this.id);
    });

    grape.on('announce', (name) => {
      console.log('announce for connections complete', { name }, this.id);
    });

    grape.on('peer', (p) => {
      console.log('peer found', { p }, this.id);
    });

    grape.on('node', () => {
      console.log('node found', this.id);
    });

    grape.on('warning', () => {
      console.log('warning for nodes found', this.id);
    });
  }
}

// Create Grapes
GRAPE_CONFIG.forEach(({ API_PORT: api_port, DHT_PORT: dht_port, BOOTSTRAP_PORT: dht_bootstrap }, idx) => {
  new DHT(idx, { api_port, dht_bootstrap, dht_port });
});
