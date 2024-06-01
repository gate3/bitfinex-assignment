const Link = require('grenache-nodejs-link');
const { PeerRPCServer, PeerRPCClient } = require('grenache-nodejs-http');
const { HOST, GRAPE_CONFIG, CHANNELS } = require('../constants');

class Peer {
  constructor(port) {
    this.link = new Link({
      grape: `http://${HOST}:${GRAPE_CONFIG[0].API_PORT}`,
    });
    this.link.start();
    this.port = port;
    const peer = new PeerRPCServer(this.link, {});
    peer.init();

    this.service = peer.transport('server');
    this.service.listen(port);

    this.client = new PeerRPCClient(this.link, {});
    this.client.init();

    this.id = null;
    this.address = `${HOST}:${port}`; // default to a guess of what the address should be
  }

  async assignClientId(channel) {
    return new Promise((resolve, reject) => {
      this.link.lookup(channel, {}, (err, dests) => {
        if (err) return reject(err);

        const currentPeerAddr = dests.filter((dest) => {
          const [host, port] = dest.split(':');
          return port == this.port; // weak compare
        });
        if (currentPeerAddr.length) {
          this.address = currentPeerAddr[0];
        }

        if (!dests) {
          this.id = 1;
        } else {
          this.id = dests.length;
        }

        return resolve(this.id);
      });
    });
  }

  broadcast(channel, payload) {
    return new Promise((resolve, reject) => {
      this.client.map(channel, payload, { timeout: 10000 }, (err, data) => {
        if (err) return reject(err);
        return resolve(data);
      });
    });
  }
}

module.exports = Peer;
