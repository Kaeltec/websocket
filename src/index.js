module.exports = {
  WebSocket: require('./connection/WebSocket'),
  BaseWebSocket: require('./connection/BaseWebSocket'),
  Subscriptions: require('./connection/Subscriptions'),

  Socket: require('./structures/Socket'),
  Connection: require('./structures/Connection'),

  Util: require('./utils'),
  Constants: require('./utils/Constants'),
};
