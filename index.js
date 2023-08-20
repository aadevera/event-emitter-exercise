const Restaurant = require('./classes/Restaurant');
const Customer = require('./classes/Customer');
const Server = require('./classes/Server');
const Chef = require('./classes/Chef');

const resto = new Restaurant({
  name: 'Restotser',
  staffs: [new Server(), new Chef()],
});

resto.emit('ProcessTable');
resto.emit('ProcessQueue');
resto.emit('ProcessOrderQueue');
resto.emit('ProcessOrderQueueToDeliver');
resto.emit('CustomerEnter', new Customer({ restaurant: resto }));
resto.emit('CustomerEnter', new Customer({ restaurant: resto }));
