const WS = require('ws');

const BaseWebSocket = require('./BaseWebSocket');
const PacketHandlers = require('./handlers');
const { CODES, STATUS } = require('../utils/Constants');

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

  ping() {
    console.log('this.send(CODES.PING)');
    this.send(CODES.PING);
  }

  // PACKET
  handlePacket(packet) {
    if (packet && PacketHandlers[packet.t]) {
      PacketHandlers[packet.t](this, packet.d);
    }
  }
}

module.exports = WebSocket;
