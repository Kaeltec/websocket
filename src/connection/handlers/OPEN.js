const { STATUS } = require('../../utils/Constants');

/**
 * @param {import('../WebSocket')} ws
 */
function handle(ws, { clientInterval }) {
  ws.status = STATUS.OPEN;
  ws.clientInterval = setInterval(() => ws.ping(), clientInterval);
}

module.exports = handle;
