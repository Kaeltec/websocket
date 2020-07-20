const { TextDecoder } = require('util');
const { EventEmitter } = require('events');
const { OPEN: WS_OPEN } = require('ws');

const { STATUS } = require('../utils/Constants');

class BaseWebSocket extends EventEmitter {
  /**
   * @param {import('../structures/Connection')} connectionManager
   * @param {object} options
   */
  constructor(connectionManager, options = {}) {
    super();

    /**
     * @type {?WebSocket}
     */
    this.connection = null;
    this.connectionManager = connectionManager;

    this.status = STATUS.IDLE;
    this.url = `${options.url}/${options.path || 'adonis-ws'}`;

    this.clientInterval = null;
    this.reconnectionTimeout = null;

    Object.defineProperties(this, {
      inflate: { value: null, writable: true },
      ratelimit: {
        value: {
          time: 60e3,
          total: 120,
          remaining: 120,
          queue: [],
          timer: null,
        },
      },
    });
  }

  get subscriptions() {
    return this.connectionManager.subscriptions;
  }

  // WS

  _send({ t, d, callback } = {}) {
    if (this.connection && this.connection.readyState !== WS_OPEN) {
      this.connection.send(BaseWebSocket.pack({ t, d }), err => {
        if (!err && typeof callback === 'function') callback();
      });
    }
  }

  send(t, d, { important = false, callback = () => {} } = {}) {
    this.ratelimit.queue[important ? 'unshift' : 'push']({ t, d, callback });
    this.processQueue();
  }

  processQueue() {
    if (this.ratelimit.remaining === 0) return;
    if (this.ratelimit.queue.length === 0) return;
    if (this.ratelimit.remaining === this.ratelimit.total) {
      this.ratelimit.timer = setTimeout(() => {
        this.ratelimit.remaining = this.ratelimit.total;
        this.processQueue();
      }, this.ratelimit.time);
    }

    while (this.ratelimit.remaining > 0) {
      const item = this.ratelimit.queue.shift();

      if (!item) return;

      this._send(item);
      this.ratelimit.remaining--; // eslint-disable-line no-plusplus
    }
  }

  // WS EVENTS

  onOpen() {
    this.status = STATUS.NEARLY;
  }

  onError() {}

  onClose() {}

  onMessage({ data }) {
    const packet = BaseWebSocket.unpack(data);

    this.handlePacket(packet);
    this.emit(packet.t, packet.d);
  }
}

BaseWebSocket.pack = JSON.stringify;
BaseWebSocket.unpack = data => {
  const textDecoder = new TextDecoder();

  if (typeof data !== 'string') data = textDecoder.decode(data);
  return JSON.parse(data);
};

module.exports = BaseWebSocket;
