const { EventEmitter } = require('events');

const WebSocket = require('../connection/WebSocket');
const Subscriptions = require('../connection/Subscriptions');
const { STATUS, EVENTS } = require('../utils/Constants');

class Connection extends EventEmitter {
  constructor(url, websocketOptions = {}) {
    super();

    this.ws = new WebSocket(this, Object.assign(websocketOptions, { url }));
    this.subscriptions = new Subscriptions();
  }

  connect() {
    if (!this.ws.connection) this.ws.connect();
    return this;
  }

  /**
   * @param {string} topic
   */
  subscribe(topic) {
    if (this.subscriptions.has(topic)) return this.subscriptions.get(topic);

    const socket = this.subscriptions.add(topic, this, topic);

    socket.on(EVENTS.JOIN, () => {
      this.emit(EVENTS.SUBSCRIPTION_JOIN, topic);
    });

    socket.on(EVENTS.CLOSE, () => {
      if (this.subscriptions.delete(topic)) this.subscribe(topic);
      this.emit(EVENTS.SUBSCRIPTION_CLOSE, topic);
    });

    if (this.ws.status === STATUS.READY) this.ws.joinSubscription(topic);
    return socket;
  }
}

module.exports = Connection;
