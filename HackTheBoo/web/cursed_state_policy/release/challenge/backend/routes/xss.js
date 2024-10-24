import { getLatestXSSPayload } from '../utils/redis.js';

export default async function setupXSSRoutes(fastify) {
    fastify.get('/xss', async (req, reply) => {
        try {
          const payload = await getLatestXSSPayload();

          return reply.view('xss.ejs', {
            payload: payload || null,
            vite: req.viteAssets

          });
        } catch (error) {
          console.error('Error fetching payload from Redis:', error);
          return reply.code(500).send({ success: false, message: 'Error fetching payload.' });
        }
    });
}