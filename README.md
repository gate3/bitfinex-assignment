# Bitfinex Assignment

### How Does It Work
- We have multiple peers that have the ability to send and receive messages
- Each peer can perform a buy/sell order
- When a buy/sell order is sent, it is registered in a order book (Buy or Sell Order Book)
- When a buy order is sent, we try to match it with a sell order and vice versa
- If we find a match, we mark the completed order status as completed and if there any partially processed orders, we add them back to the orderbook

#### OrderBook
The orderbook is a priority queue, which operates on `Price-Time-Priority`, where we use the price and time of addition as to determine the sort order of buy/sell. 

##### Buy Order
- For the Buy side, we give more priority to orders with the highest price
- When two orders have thesame price, we use the time at which the order was added

##### Sell Order
- For the Sell side, we give more priority to orders with the lowest price
- When two orders have thesame price, we use the time at which the order was added

### What Could Be Better
- To mitigate against race conditions, when an order has been matched, I would remove the orders from all peers pending the completion of the transaction. This way other transactions can occur. If for any reason the transaction fails, I can add both buy/sell transactions back.
- To ensure we have an atomic transaction when using the mitigation method above, I will have a timeout setting. Once the timeout has expired and the transaction has not been completed, the orders will be enqueued again.
- I would find a better way to identify peers instead of the current peer id, I would assign a uuid which is broadcasted by all peers once connection has been established. The current peer id becomes wrong if a peer gets disconnected.
- To make things more secure, I would introduce an escrow method, which will take custody of the sell order till transaction is completed and settle the buyer
- I would introduce an order id which will help with parallel processing. Currently the project only works with a single order at a time and only the order at the top of the queue. Having an order id, would allow working with orders at any point in the order book. An order Id will also help with eventual consistency.


### What Was Not Completed
- I was unable to complete the removal or change in quantity of orders after transaction has been completed

### Running The Project
First, make sure you are in the project root.

- Run the server first `node server`
- Run as many peers as you want using the peer script and just changing the port for each peer your run e.g. `node peer -p 8000` to run another one, just change port to e.g. `8001`
- On one of the running peers, pass a JSON string with the order details. The format is `"{\"quantity\":30,\"price\":10,\"type\":\"sell\"}"`
