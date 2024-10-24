import { submitViolation } from '../utils/redis.js'; // Correct ES6 import

export default async function (fastify) {
  fastify.addContentTypeParser('application/csp-report', { parseAs: 'string' }, (req, body, done) => {
    try {
      const parsedBody = JSON.parse(body);
      done(null, parsedBody);
    } catch (err) {
      done(err, undefined);
    }
  });

  fastify.post('/csp-report', async (req, reply) => {
    try {
      await submitViolation(req.body);
      return reply.send({ status: true, payload: "Violation submitted and broadcasted." });
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ status: false, payload: error.message });
    }
  });
}