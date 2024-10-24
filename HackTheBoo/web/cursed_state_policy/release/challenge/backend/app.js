import fastify from 'fastify';
import path from 'path';
import { fileURLToPath } from 'url';
import Redis from 'ioredis';

import { broadcastMessage } from './routes/websocket.js';
import { getUws, serverFactory } from '@geut/fastify-uws';
import fastifyUwsPlugin from '@geut/fastify-uws/plugin';
import { ViteManifestMiddleware } from './middleware/viteMiddleware.js';
import { CSPMiddleware } from './middleware/cspMiddleware.js';
import websocketRoutes from './routes/websocket.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = fastify({
  serverFactory,
  logger: true,
});

await app.register(fastifyUwsPlugin);

const minifier = await import('html-minifier-terser');
const minifierOpts = {
  removeComments: true,
  removeCommentsFromCDATA: true,
  collapseWhitespace: true,
  collapseBooleanAttributes: true,
  removeAttributeQuotes: true,
  removeEmptyAttributes: true,
};

await app.register(import('@fastify/view'), {
  engine: {
    ejs: await import('ejs'),
  },
  root: path.join(__dirname, 'views'),
  options: {
    useHtmlMinifier: minifier.default,
    htmlMinifierOptions: minifierOpts,
  },
});

await app.register(import('@fastify/static'), {
  root: path.join(__dirname, 'static'),
  prefix: '/static/',
});

app.addHook('onRequest', CSPMiddleware);

app.addHook('preHandler', (req, reply, done) => {
    ViteManifestMiddleware(req, reply, done, __dirname);
});

await app.register(import('./routes/index.js'));
await app.register(import('./routes/guidelines.js'));
await app.register(import('./routes/callback.js'));
await app.register(import('./routes/xss.js'));
await app.register(import('./routes/csp.js'));

app.addHook('onReady', async () => {
  const uwsApp = getUws(app);
  console.log('uWebSocket app is ready');
});

await websocketRoutes(app);
const start = async () => {
    try {
      await app.listen({ port: 8000, host: '0.0.0.0' });
      app.log.info(`Server is running at http://localhost:8000`);
        
      const redisSubscriber = new Redis();

      redisSubscriber.subscribe('job_updates')
  
      redisSubscriber.on('message', (channel, message) => {
        const payload = JSON.parse(message);
        switch (channel) {
          case 'job_updates':
            broadcastMessage('job_update', payload);
            break;
          default:
            console.warn(`Received message from unknown channel: ${channel}`);
        }
      });
    } catch (err) {
      app.log.error(err);
      process.exit(1);
    }
  };
  
start();