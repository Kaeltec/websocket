const { EventEmitter } = require('events');

const { CODES, EVENTS, STATUS } = require('../utils/Constants');

class Socket extends EventEmitter {
  /**
   * @param {import('./Connection')} connection
   * @param {string} topic
   */
  constructor(connection, topic) {
    super();

    this.topic = topic;
    this.connection = connection;

    this.status = STATUS.WAITING;
  }

  event({ event, data }) {
    this.emit(event, data);
  }

  join() {
    this.status = STATUS.READY;
    this.emit(EVENTS.JOIN);
  }

  joinError(data) {
    this.status = STATUS.IDLE;
    this.emit(EVENTS.JOIN_ERROR, data);
  }

  leave() {
    this.status = STATUS.DISCONNECTED;
    this.emit(EVENTS.LEAVE);
  }

  leaveError(data) {
    this.emit(EVENTS.LEAVE_ERROR, data);
  }

  /**
   * @param {string} event
   * @param {any} data
   */
  send(event, data = {}) {
    this.connection.ws.send(CODES.EVENT, { data, event, topic: this.topic });
  }
}

module.exports = Socket;
