const EventEmitter = require('events');
const { sleep, generateRandomName } = require('../utils');

class Server extends EventEmitter {
  constructor() {
    super();

    this.name = generateRandomName();
    this.occupied = false;
    this.on('getOrderFromCustomer', this.#getOrderFromCustomer);
    this.on('giveOrderToChef', this.#giveOrderToChef);
    this.on('giveOrderToCustomer', this.#giveOrderToCustomer);
  }

  async #getOrderFromCustomer(customer) {
    this.occupied = true;
    console.log(
      `Server-${this.name} taking order from Customer-${customer.name}`,
    );
    await sleep(5000);

    customer.giveOrderToServer();

    console.log(
      `Server-${this.name} took order from Customer-${customer.name}`,
    );

    this.restaurant.orderQueue.push(customer);
    customer.giveOrderToChef();

    this.occupied = false;
  }

  async #giveOrderToChef(customer, chef) {
    chef.emit('receiveOrderFromServer', customer, this);
  }

  async #giveOrderToCustomer(customer) {
    this.occupied = true;
    console.log(
      `Server-${this.name} delivering order to Customer-${customer.name}`,
    );
    await sleep(1000);
    customer.emit('receiveOrderFromServer');
    this.occupied = false;
  }

  setRestaurant(restaurant) {
    this.restaurant = restaurant;
  }
}

module.exports = Server;
