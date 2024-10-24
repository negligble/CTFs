export default async function (fastify) {
    fastify.get('/guidelines', (req, reply) => {
        return reply.view('guidelines.ejs', {
            nonce: req.nonce,
            vite: req.viteAssets,
        });
    });
}