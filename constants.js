const constants = {
  HOST: '127.0.0.1',
  GRAPE_CONFIG: [
    {
      API_PORT: 30001,
      DHT_PORT: 20001,
      BOOTSTRAP_PORT: 20002,
    },
    {
      API_PORT: 40001,
      DHT_PORT: 20002,
      BOOTSTRAP_PORT: 20001,
    },
  ],
  CHANNELS: {
    EXCHANGE: 'exchange_server',
  },
  HTTP_PORT: 3000,
  ORDERS: {
    STATUS: {
      COMPLETED: 'completed',
      CHANGED: 'changed',
    },
    TYPE: {
      BUY: 'buy',
      SELL: 'sell',
    },
  },
};

module.exports = constants;
