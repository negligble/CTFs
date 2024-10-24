import { getCachedCSP } from '../utils/redis.js';

export async function CSPMiddleware(req, reply) {
    if (req.url === '/csp-report' || req.url === '/callback') {
        return;
    }

    try {
        const cachedCSP = await getCachedCSP();

        reply.header('Content-Security-Policy', cachedCSP);

        const nonceMatch = cachedCSP.match(/'nonce-([^']+)'/);
        const nonce = nonceMatch ? nonceMatch[1] : null;

        req.nonce = nonce;
    } catch (error) {
        console.error('Error in CSP middleware:', error);
        throw error;
    }
}
