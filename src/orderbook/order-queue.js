const { ORDERS } = require('../../constants');

class OrderQueue {
  constructor(type) {
    if (type == null) throw new Error('queue type must be provided!');
    this.queue = [];
    this.type = type;
  }

  sellOrderSorter(a, b) {
    if (a.price === b.price) {
      return a.createdAt - b.createdAt;
    }

    if (a.createdAt === b.createdAt) {
      return a.price - b.price;
    }

    return a.price - b.price;
  }

  buyOrderSorter(a, b) {
    if (a.price === b.price) {
      return a.createdAt - b.createdAt;
    }

    if (a.createdAt === b.createdAt) {
      return b.price - a.price;
    }

    return b.price - a.price;
  }

  enqueue(order) {
    if (order.type !== this.type) throw new Error('invalid order type');

    this.queue.push(order);
    const sortFunc = this.type === ORDERS.TYPE.BUY ? this.buyOrderSorter : this.sellOrderSorter;
    this.queue.sort(sortFunc);
  }

  dequeue() {
    return this.queue.shift();
  }

  isEmpty() {
    return this.queue.length === 0;
  }

  peek() {
    if (this.isEmpty()) return null;
    return this.queue[0];
  }

  size() {
    return this.queue.length;
  }
}

module.exports = OrderQueue;
