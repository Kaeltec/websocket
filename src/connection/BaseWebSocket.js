const { TextDecoder } = require('util');
const { OPEN: WS_OPEN } = require('ws');

const { mergeObject } = require('../utils');
const { STATUS, EVENTS } = require('../utils/Constants');

class BaseWebSocket {
  /**
   * @param {import('../structures/Connection')} connectionManager
   * @param {object} options
   */
  constructor(connectionManager, options = {}) {
    options = mergeObject(
      {
        path: 'adonis-ws',
        maxConnectionAttempts: 10,
        reconnectionTimeout: 10000,
      },
      options,
    );

    if (typeof options.url !== 'string') {
      throw new TypeError('Invalid websocket url provided!');
    }

    /**
     * @type {?WebSocket}
     */
    this.connection = null;
    this.connectionManager = connectionManager;

    this.status = STATUS.IDLE;
    this.url = `${options.url}/${
      typeof options.path === 'string'
        ? options.path.replace(/^\//, '')
        : 'adonis-ws'
    }`;

    this.connectionAttempts = 0;
    this.clientInterval = null;
    this.reconnectionTimeout = null;

    Object.defineProperties(this, {
      options: { value: options },
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

  emit(...args) {
    this.connectionManager.emit(...args);
  }

  error(error) {
    this.emit(EVENTS.ERROR, error);
  }

  debug(debug) {
    this.emit(EVENTS.DEBUG, debug);
  }

  _cleanupConnection() {
    if (this.connection) {
      // eslint-disable-next-line no-multi-assign
      this.connection.onopen = this.connection.onclose = this.connection.onerror = this.connection.onmessage = null;
    }

    this.connection = null;
  }

  // WS

  _send({ t, d, callback } = {}) {
    if (this.connection && this.connection.readyState === WS_OPEN) {
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

  onClose() {}

  onOpen() {
    this.status = STATUS.WAITING;
  }

  onError(event) {
    const error = event && event.error ? event.error : event;

    if (!error) return;
    this.error(error);
  }

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
