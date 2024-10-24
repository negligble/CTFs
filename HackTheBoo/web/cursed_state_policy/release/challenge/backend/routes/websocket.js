import { triggerXSS, getViolationHistory, getLogs, fetchDefaultCSP } from '../utils/redis.js';

let clients = [];

export default async function websocketRoutes(fastify) {
  fastify.route({
    method: 'GET',
    url: '/ws',
    handler: (req, reply) => {
      reply.send({ message: 'This is a WebSocket endpoint, use WebSocket to connect' });
    },
    uwsHandler(conn) {
      console.log('New WebSocket connection');

      clients.push(conn);

      conn.on('message', async (message) => {
        try {
          if (message instanceof ArrayBuffer) {
            message = new TextDecoder('utf-8').decode(new Uint8Array(message));
          }
          console.log(message);
          const { type, payload } = JSON.parse(message);

          if (type === 'trigger_xss') {
            await triggerXSS(payload);
          } else if (type === 'update_violations') {
            const result = await getViolationHistory();
            conn.send(JSON.stringify({ type: 'update_violations', payload: result }));
          } else if (type === 'fetch_logs') {
            const logs = await getLogs();
            conn.send(JSON.stringify({ type: 'update_logs', payload: logs }));
          } else if (type === 'fetch_default_csp') {
            const csp = await fetchDefaultCSP();
            conn.send(JSON.stringify({ type: 'default_csp', payload: csp }));
          } else {
            conn.send(JSON.stringify({ error: 'Unknown message type' }));
          }
        } catch (error) {
          console.error('Error processing message:', error);
          conn.send(JSON.stringify({ error: 'Failed to process message' }));
        }
      });

      conn.on('close', () => {
        console.log('WebSocket connection closed');
        clients = clients.filter((client) => client !== conn);
      });
    },
  });
}

export function broadcastMessage(type, payload) {
    console.log(JSON.stringify({ type, payload }));
  clients.forEach((client) => {
      client.send(JSON.stringify({ type, payload }));
    });
}
