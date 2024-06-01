const BuyOrder = require('../orderbook/buy-order');
const OrderBook = require('../orderbook/orderbook');
const SellOrder = require('../orderbook/sell-order');
const { ORDERS } = require('../../constants');

class OrdersService {
  constructor() {
    this.orderBook = new OrderBook();
  }

  processBuyRequest(id, data) {
    const { quantity, price } = data;
    const order = new BuyOrder(id, quantity, price);
    this.orderBook.addBuyOrder(order);
    return order;
  }

  processPublishedBuyRequest(orderObject) {
    const order = new BuyOrder(orderObject.peerId, orderObject.quantity, orderObject.price, orderObject.createdAt);
    this.orderBook.addBuyOrder(order);
    return order;
  }

  getBuyOrder() {
    return this.orderBook.buyOrderBook.dequeue();
  }

  processSellRequest(id, data) {
    const { quantity, price } = data;
    const order = new SellOrder(id, quantity, price);
    this.orderBook.addSellOrder(order);
    return order;
  }

  processPublishedSellRequest(orderObject) {
    const order = new SellOrder(orderObject.peerId, orderObject.quantity, orderObject.price, orderObject.createdAt);
    this.orderBook.addSellOrder(order);
    return order;
  }

  getSellOrder() {
    return this.orderBook.sellOrderBook.dequeue();
  }
}

module.exports = OrdersService;
