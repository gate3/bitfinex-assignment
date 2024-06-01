const { ORDERS } = require('../../constants');
const OrderQueue = require('./order-queue');

class OrderBook {
  constructor() {
    this.sellOrderBook = new OrderQueue(ORDERS.TYPE.SELL);
    this.buyOrderBook = new OrderQueue(ORDERS.TYPE.BUY);
  }

  addBuyOrder(order) {
    this.buyOrderBook.enqueue(order);
  }

  addSellOrder(order) {
    this.sellOrderBook.enqueue(order);
  }
}

module.exports = OrderBook;
