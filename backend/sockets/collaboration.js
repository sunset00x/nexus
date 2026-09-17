import { WebSocketServer } from 'ws';

export function setupWebSockets(server) {
  const wss = new WebSocketServer({ server });
  const rooms = new Map();

  wss.on('connection', (ws) => {
    let currentRoom = null;

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        if (data.type === 'JOIN_PROJECT') {
          currentRoom = data.projectId;
          if (!rooms.has(currentRoom)) rooms.set(currentRoom, new Set());
          rooms.get(currentRoom).add(ws);
        } else if (currentRoom && rooms.has(currentRoom)) {
          rooms.get(currentRoom).forEach(client => {
            if (client !== ws && client.readyState === 1) {
              client.send(JSON.stringify(data));
            }
          });
        }
      } catch (err) {
        console.error('[WebSocket Error]', err);
      }
    });

    ws.on('close', () => {
      if (currentRoom && rooms.has(currentRoom)) {
        rooms.get(currentRoom).delete(ws);
      }
    });
  });

  console.log('[Nexus System] Real-Time WebSocket Engine Attached');
}