const { EventEmitter } = require('events');

class Socket extends EventEmitter {
  /**
   * @param {import('./Connection')} connection
   * @param {string} topic
   */
  constructor(connection, topic) {
    super();

    this.connection = connection;
    this.topic = topic;
  }

  joinAck() {}

  joinError() {}
}

module.exports = Socket;
