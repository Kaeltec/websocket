const WebSocket = require('../connection/WebSocket');
const Subscriptions = require('../connection/Subscriptions');

class Connection {
  constructor(url, websocketOptions = {}) {
    this.ws = new WebSocket(this, Object.assign(websocketOptions, { url }));
    this.subscriptions = new Subscriptions();
  }

  connect() {
    if (!this.ws.connection) this.ws.connect();
    return this;
  }
}

module.exports = Connection;
