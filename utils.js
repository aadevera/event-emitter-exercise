const util = require('util');
const crypto = require('crypto');
const sleep = util.promisify(setTimeout);

const generateRandomName = (length = 6) => {
  return crypto.randomBytes(length).toString('hex');
};

module.exports = {
  sleep,
  generateRandomName,
};
