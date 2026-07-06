// This file is a reference implementation for the backend WebSocket server.
// In a full deployment, this would run as a separate Node process or custom Next.js server.

import { WebSocketServer, WebSocket } from 'ws';
import { createServer } from 'http';
import { parse } from 'url';

const server = createServer();
const wss = new WebSocketServer({ noServer: true });

// Mock State
let connectedClients = 0;

wss.on('connection', (ws: WebSocket) => {
  connectedClients++;
  console.log(`Client connected. Total: ${connectedClients}`);

  ws.on('message', (message) => {
    console.log('Received:', message);
  });

  ws.on('close', () => {
    connectedClients--;
  });

  // Send welcome message
  ws.send(JSON.stringify({ type: 'WELCOME', message: 'Connected to F1 Live Stream' }));
});

// Broadcast function to simulate pushing OpenF1 updates
const broadcast = (data: any) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

// Simulation Loop (would be replaced by OpenF1 polling in production)
setInterval(() => {
    broadcast({
        type: 'HEARTBEAT',
        timestamp: Date.now()
    });
}, 5000);

server.on('upgrade', (request, socket, head) => {
  const { pathname } = parse(request.url || '', true);

  if (pathname === '/_next/webpack-hmr') {
    // Let Next.js handle HMR
    return;
  }

  if (pathname === '/api/ws') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

const PORT = process.env.PORT || 3001;
// server.listen(PORT, () => console.log(`WS Server listening on ${PORT}`));

export {};
