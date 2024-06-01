const { ORDERS } = require('../../constants');
const OrdersService = require('../services/orders-service');

class OrdersController {
  constructor() {
    this.service = new OrdersService();
  }

  // Parse over-stringified json recursively
  jsonParser(blob) {
    let parsed = JSON.parse(blob);
    if (typeof parsed === 'string') parsed = this.jsonParser(parsed);
    return parsed;
  }

  processRequestPayload(peerId, payload) {
    const parsedOrder = this.jsonParser(payload);

    let order = null;
    if (parsedOrder.type === ORDERS.TYPE.BUY) {
      order = this.service.processBuyRequest(peerId, parsedOrder);
    }
    if (parsedOrder.type === ORDERS.TYPE.SELL) {
      order = this.service.processSellRequest(peerId, parsedOrder);
    }

    return order;
  }

  processBroadcast(peerId, parsedOrder) {
    if (parsedOrder.peerId == peerId) return;

    let order = null;
    if (parsedOrder.type === ORDERS.TYPE.BUY) {
      order = this.service.processPublishedBuyRequest(parsedOrder);
    }
    if (parsedOrder.type === ORDERS.TYPE.SELL) {
      order = this.service.processPublishedSellRequest(parsedOrder);
    }

    return order;
  }

  canProcessOrder(peerId, currentOrder) {
    const order = currentOrder.type === ORDERS.TYPE.BUY ? this.service.orderBook.sellOrderBook.peek() : this.service.orderBook.buyOrderBook.peek();
    if (!order) {
      return null;
    }

    if (order.peerId !== peerId) {
      return null; // only owner can process
    }

    // other peers should dequeue order for now if true at any point
    if (currentOrder.type === ORDERS.TYPE.BUY && currentOrder.price >= order.price) {
      return order;
    }

    if (currentOrder.type === ORDERS.TYPE.SELL && currentOrder.price <= order.price) {
      return order;
    }

    return null;
  }

  completeOrder(order, orderToFulfill) {
    const sellSide = order.type === ORDERS.TYPE.SELL ? order : orderToFulfill;
    const buySide = order.type === ORDERS.TYPE.BUY ? order : orderToFulfill;
    if (buySide.quantity === sellSide.quantity) {
      // remove both from all peers since order has been met
      order.status = ORDERS.STATUS.COMPLETED;
      orderToFulfill.status = ORDERS.STATUS.COMPLETED;
      return {
        completedOrderAmount: orderToFulfill.quantity,
        orderState: [order, orderToFulfill],
      };
    }

    if (buySide.quantity > sellSide.quantity) {
      sellSide.status = ORDERS.STATUS.COMPLETED;
      buySide.quantity -= sellSide.quantity;
    } else {
      buySide.status = ORDERS.STATUS.COMPLETED;
      sellSide.quantity -= buySide.quantity;
    }
    return {
      completedOrderAmount: orderToFulfill.quantity,
      orderState: [buySide, sellSide],
    };
  }
}

module.exports = OrdersController;
