/**
 * @param {import('../WebSocket')} ws
 */
function handle(ws, { topic }) {
  const socket = ws.subscriptions.get(topic);

  if (socket) socket.leave();
}

module.exports = handle;
