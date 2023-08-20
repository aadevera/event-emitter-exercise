const EventEmitter = require('events');

const { sleep } = require('../utils');

class Chef extends EventEmitter {
  constructor() {
    super();

    this.occupied = false;
    this.on('cookOrder', this.#cookOrder);
  }

  async #cookOrder(customer) {
    this.occupied = true;

    console.log(`Chef cooking order for Customer-${customer.name}`);
    await sleep(5000);

    customer.setOrderToDeliver();
    console.log(`Chef cooked order for Customer-${customer.name}`);
    this.occupied = false;
  }

  setRestaurant(restaurant) {
    this.restaurant = restaurant;
  }
}

module.exports = Chef;
