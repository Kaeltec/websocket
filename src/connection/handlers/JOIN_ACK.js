/**
 * @param {import('../WebSocket')} ws
 */
function handle(ws, { topic }) {
  const socket = ws.subscriptions.get(topic);

  if (socket) socket.join();
}

module.exports = handle;
