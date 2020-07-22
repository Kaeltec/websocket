const { STATUS, EVENTS } = require('../../utils/Constants');

/**
 * @param {import('../WebSocket')} ws
 */
function handle(ws, { clientInterval }) {
  ws.status = STATUS.READY;
  ws.connectionAttempts = 0;
  ws.clientInterval = setInterval(() => ws.ping(), clientInterval);

  for (const subscription of ws.subscriptions.values()) {
    ws.joinSubscription(subscription.topic);
  }

  ws.emit(EVENTS.READY);
}

module.exports = handle;
