const { ORDERS } = require('../../constants');
const BaseOrder = require('./order');

class BuyOrder extends BaseOrder {
  constructor(peerId, quantity, price, createdAt = Date.now(), status) {
    super(peerId, ORDERS.TYPE.BUY, quantity, price, createdAt, status);
  }
}

module.exports = BuyOrder;
