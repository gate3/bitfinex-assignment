const { ORDERS } = require('../../constants');
const BaseOrder = require('./order');

class SellOrder extends BaseOrder {
  constructor(peerId, quantity, price, createdAt = Date.now(), status) {
    super(peerId, ORDERS.TYPE.SELL, quantity, price, createdAt, status);
  }
}

module.exports = SellOrder;
