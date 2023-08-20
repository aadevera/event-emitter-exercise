const EventEmitter = require('events');
const { sleep, generateRandomName } = require('../utils');

class Customer extends EventEmitter {
  constructor({ restaurant }) {
    super();
    this.name = generateRandomName();
    this.orderStatus = 'NONE';
    this.restaurant = restaurant;

    this.on('receiveOrderFromServer', this.#receiveOrderFromServer);
  }

  giveOrderToServer() {
    this.orderStatus = 'SERVER';
  }

  giveOrderToChef() {
    this.orderStatus = 'CHEF';
  }

  setOrderToDeliver() {
    this.orderStatus = 'TO_DELIVER';
  }

  async #receiveOrderFromServer() {
    this.orderStatus = 'DELIVERED';
    await sleep(5000);
    this.restaurant.emit('CustomerDone', this);
  }
}

module.exports = Customer;
