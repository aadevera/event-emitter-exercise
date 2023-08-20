const EventEmitter = require('events');
const Server = require('./Server');
const Chef = require('./Chef');
const Customer = require('./Customer');

class Restaurant extends EventEmitter {
  constructor({ name, staffs }) {
    super();
    this.name = name;
    this.orderQueue = [];
    this.customerQueue = [];
    this.tables = [];
    this.chefs = [];
    this.servers = [];
    for (let staff of staffs) {
      if (staff instanceof Chef) {
        this.chefs.push(staff);
        staff.setRestaurant(this);
      }
      if (staff instanceof Server) {
        this.servers.push(staff);
        staff.setRestaurant(this);
      }
    }

    this.on('CustomerEnter', this.#addCustomerToQueue);
    this.on('CustomerDone', this.#removeCustomerFromTable);
    this.on('ProcessTable', this.#processTable);
    this.on('ProcessQueue', this.#processQueue);
    this.on('ProcessOrderQueue', this.#processOrderQueue);
    this.on('ProcessOrderQueueToDeliver', this.#processOrderQueueToDeliver);
  }

  #processTable() {
    setInterval(() => {
      for (let customer of this.tables) {
        if (customer.orderStatus === 'NONE') {
          for (let server of this.servers) {
            if (!server.occupied) {
              server.emit('getOrderFromCustomer', customer);
              break;
            }
          }
        }
      }
    }, 500);
  }

  #processQueue() {
    setInterval(() => {
      if (this.tables.length < 10) {
        if (this.customerQueue.length > 0) {
          const customer = this.customerQueue.pop();
          console.log(`Customer-${customer.name} is on the table.`);
          this.tables.push(customer);
        }
      }
    }, 1000);
  }

  #processOrderQueue() {
    setInterval(() => {
      for (let customer of this.orderQueue) {
        if (customer.orderStatus === 'CHEF') {
          for (let chef of this.chefs) {
            if (!chef.occupied) {
              chef.emit('cookOrder', customer);
              break;
            }
          }
        }
      }
    }, 1000);
  }

  #processOrderQueueToDeliver() {
    setInterval(() => {
      for (let customer of this.orderQueue) {
        if (customer.orderStatus === 'TO_DELIVER') {
          for (let server of this.servers) {
            if (!server.occupied) {
              const index = this.orderQueue.indexOf(customer);
              this.orderQueue.splice(index, 1);
              server.emit('giveOrderToCustomer', customer);
              break;
            }
          }
        }
      }
    }, 1000);
  }

  #addCustomerToQueue(customer) {
    console.log(`Customer-${customer.name} Entering`);

    if (customer instanceof Customer) {
      if (this.tables.length < 10) {
        console.log(`Customer-${customer.name} is on the table.`);
        this.tables.push(customer);
      } else {
        if (this.customerQueue.length < 10) {
          console.log(`Customer-${customer.name} is on the queue.`);
          this.customerQueue.push(customer);
        } else {
          console.log('Queue is full, Comeback again later.');
        }
      }
    }
  }

  #removeCustomerFromTable(customer) {
    const customerIndex = this.tables.indexOf(customer);
    this.tables.splice(customerIndex, 1);
    console.log(
      `Customer-${customer.name} is done eating, leaving the restaurant...`,
    );
  }
}

module.exports = Restaurant;
