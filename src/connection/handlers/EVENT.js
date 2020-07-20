/**
 * @param {import('../WebSocket')} ws
 */
function handle(ws, data) {
  const socket = ws.subscriptions.get(data.topic);

  if (socket) socket.event(data);
}

module.exports = handle;
