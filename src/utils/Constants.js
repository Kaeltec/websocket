module.exports.STATUS = {
  IDLE: 0,
  READY: 1,
  WAITING: 2,
  CONNECTING: 3,
  RECONNECTING: 4,
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

module.exports.EVENTS = {
  JOIN: 'join',
  READY: 'ready',
  CLOSE: 'close',
  LEAVE: 'leave',
  ERROR: 'error',
  DEBUG: 'debug',

  JOIN_ERROR: 'joinError',
  LEAVE_ERROR: 'leaveError',

  SUBSCRIPTION_JOIN: 'subscriptionJoin',
  SUBSCRIPTION_CLOSE: 'subscriptionClose',
};
