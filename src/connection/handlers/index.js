const { CODES } = require('../../utils/Constants');

module.exports = {
  [CODES.OPEN]: require('./OPEN'),
  [CODES.PONG]: require('./PONG'),
  [CODES.EVENT]: require('./EVENT'),
  [CODES.LEAVE]: require('./LEAVE_ACK'),
  [CODES.JOIN_ACK]: require('./JOIN_ACK'),
  [CODES.LEAVE_ACK]: require('./LEAVE_ACK'),
  [CODES.JOIN_ERROR]: require('./JOIN_ERROR'),
  [CODES.LEAVE_ERROR]: require('./LEAVE_ERROR'),
};
