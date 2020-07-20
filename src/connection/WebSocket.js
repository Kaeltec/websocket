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

    for (const subscription of this.subscriptions.values()) {
      this.leaveSubscription(subscription.topic);
      subscription.status = STATUS.DISCONNECTED;
    }

    this._cleanupConnection();
    this.connect();
  }
}

module.exports = WebSocket;
