export default async function (fastify) {
    fastify.get('/', async (req, reply) => {
        return reply.view('index.ejs', {
            nonce: req.nonce,
            vite: req.viteAssets,
        });
    });
}
