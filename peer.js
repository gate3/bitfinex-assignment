const rl = require('node:readline');
const { CHANNELS } = require('./constants');
const Peer = require('./src/peer');
const OrdersController = require('./src/controllers/orders-controller');

const controller = new OrdersController();
const cli = rl.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

const onConnectionEstablished = async (peer) => {
  await peer.assignClientId(CHANNELS.EXCHANGE);

  cli.question('Place your order?', async (input) => {
    try {
      const order = controller.processRequestPayload(peer.id, input);
      await peer.broadcast(CHANNELS.EXCHANGE, order.toString());
    } catch (e) {
      console.error('could not complete order placement!', e);
    }
  });

  cli.once('SIGINT', () => {
    peer.link.stop();
    cli.close();
  });
};

const onNewRequest = (peer, { rid, key, payload, handler }) => {
  const parsedReq = JSON.parse(payload);
  console.log({ parsedReq });
  if (!parsedReq?.type) {
    handler.reply('ack');
    return;
  }

  if (peer.id == parsedReq.peerId) {
    // avoid adding current peer's orders to orderbook
    handler.reply('ack');
    return;
  }

  const broadcastedOrder = controller.processBroadcast(peer.id, parsedReq);
  const order = controller.canProcessOrder(peer.id, broadcastedOrder);
  if (order) {
    const { completedOrderAmount, orderState } = controller.completeOrder(order, parsedReq);
    console.log({ orderState, completedOrderAmount });

    peer.client.transport(peer.address, {}).request(
      CHANNELS.EXCHANGE,
      JSON.stringify({
        amount: completedOrderAmount,
        message: `You just received - ${completedOrderAmount}`,
      }),
      {},
      (err, data) => {
        // publish finished transaction
        // handler.reply('ack');
      }
    );
  }
  handler.reply('ack');
};

(async () => {
  const portIdx = process.argv.indexOf('-p');
  if (portIdx < 1) {
    console.error('Please provide a peer id');
    process.exit(1);
  }
  const port = process.argv[portIdx + 1];

  const peer = new Peer(parseInt(port, 10));
  peer.link.announce(CHANNELS.EXCHANGE, peer.service.port, {}, () => onConnectionEstablished(peer));

  peer.service.on('request', (rid, key, payload, handler) => {
    onNewRequest(peer, { rid, key, payload, handler });
  });
})();
