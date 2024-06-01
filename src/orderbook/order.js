class BaseOrder {
  constructor(peerId, type, quantity = 0, price = 0, createdAt = Date.now(), status = 'active') {
    this.peerId = peerId;
    this.quantity = quantity;
    this.price = price;
    this.createdAt = createdAt;
    this.type = type;
    this.status = status;
  }

  toObject() {
    return {
      peerId: this.peerId,
      quantity: this.quantity,
      price: this.price,
      createdAt: this.createdAt,
      type: this.type,
      status: this.status,
    };
  }

  toString() {
    return JSON.stringify(this.toObject());
  }
}

module.exports = BaseOrder;
