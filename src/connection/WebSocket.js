const WS = require('ws');

const BaseWebSocket = require('./BaseWebSocket');
const PacketHandlers = require('./handlers');
const { CODES, EVENTS, STATUS } = require('../utils/Constants');

class WebSocket extends BaseWebSocket {
  connect() {
    this.status = STATUS.CONNECTING;

    // eslint-disable-next-line no-multi-assign
    const ws = (this.connection = new WS(this.url));

    ws.onopen = this.onOpen.bind(this);
    ws.onerror = this.onError.bind(this);
    ws.onclose = this.onClose.bind(this);
    ws.onmessage = this.onMessage.bind(this);
  }

  reconnect() {
    if (this.reconnectionTimeout) this.reconnectionTimeout = null;
    if (this.connectionAttempts > this.options.maxConnectionAttempts) {
      this.status = STATUS.DISCONNECTED;
      return this.error(new Error('Maximum reconnection attempts achieved!'));
    }

    if (this.connection) this._cleanupConnection();

    this.debug(`[RECONNECTION]
  Trying to reconnect to the websocket after a close.
  Attempts: ${this.connectionAttempts}`);

    ++this.connectionAttempts; // eslint-disable-line no-plusplus
    this.status = STATUS.RECONNECTING;

    this.connect();
  }

  /**
   * @param {string} topic
   */
  joinSubscription(topic) {
    this.send(CODES.JOIN, { topic });
  }

  /**
   * @param {string} topic
   */
  leaveSubscription(topic) {
    this.send(CODES.LEAVE, { topic });
  }

  ping() {
    this.send(CODES.PING);
  }

  // PACKET
  handlePacket(packet) {
    if (packet && PacketHandlers[packet.t]) {
      PacketHandlers[packet.t](this, packet.d);
    }
  }

  // WS EVENTS

  onClose(event) {
    this.emit(EVENTS.CLOSE, event);

    this.debug(`[CLOSE]
  Code   : ${event.code}
  Clean  : ${event.wasClean}
  Reason : ${event.reason || 'No reason received'}`);

    for (const subscription of this.subscriptions.values()) {
      this.leaveSubscription(subscription.topic);
      subscription.status = STATUS.DISCONNECTED;
    }

    this._cleanupConnection();

    this.reconnectionTimeout = setTimeout(
      () => this.reconnect(),
      this.options.reconnectionTimeout * this.connectionAttempts,
    );
  }
}

module.exports = WebSocket;
