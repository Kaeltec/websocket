const { CODES } = require('../../utils/Constants');

module.exports = {
  [CODES.OPEN]: require('./OPEN'),
  [CODES.JOIN]: require('./JOIN'),
  [CODES.PING]: require('./PING'),
  [CODES.PONG]: require('./PONG'),
  [CODES.LEAVE]: require('./LEAVE'),
  [CODES.EVENT]: require('./EVENT'),
  [CODES.JOIN_ACK]: require('./JOIN_ACK'),
  [CODES.LEAVE_ACK]: require('./LEAVE_ACK'),
  [CODES.JOIN_ERROR]: require('./JOIN_ERROR'),
  [CODES.LEAVE_ERROR]: require('./LEAVE_ERROR'),
};
