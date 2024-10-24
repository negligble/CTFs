import { handleCallback } from '../utils/redis.js';

export default async function (fastify) {
  fastify.all('/callback', async (req, reply) => {
    try {
      const result = await handleCallback(req);
      return reply.send(result);
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: error.message });
    }
  });
};