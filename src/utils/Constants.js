module.exports.STATUS = {
  OPEN: 0,
  CONNECTING: 1,
  RECONNECTING: 2,
  IDLE: 3,
  NEARLY: 4,
  DISCONNECTED: 5,
};

module.exports.CODES = {
  OPEN: 0,
  JOIN: 1,
  LEAVE: 2,
  JOIN_ACK: 3,
  JOIN_ERROR: 4,
  LEAVE_ACK: 5,
  LEAVE_ERROR: 6,
  EVENT: 7,
  PING: 8,
  PONG: 9,
};
