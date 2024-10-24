import { triggerXSSQueue } from '../workers/worker.js';
import { broadcastMessage } from '../routes/websocket.js';
import crypto from 'crypto';
import Redis from 'ioredis';

const redis = new Redis();

async function submitViolation(violation) {
  violation.time = new Date().toISOString();
  await redis.rpush('violation_history', JSON.stringify(violation));
  await redis.set('last_violation', JSON.stringify(violation));

  const violations = await getViolationHistory();

  broadcastMessage('update_violations', violations);
}

async function getViolationHistory() {
  const history = await redis.lrange('violation_history', 0, -1);
  return history.map(item => JSON.parse(item));
}

async function getLogs() {
  const logs = await redis.lrange('request_logs', 0, -1);
  return logs.map(log => JSON.parse(log));
}

async function handleCallback(req) {
  const logEntry = {
    method: req.method,
    headers: req.headers,
    args: req.query,
    data: req.body,
    time: new Date().toISOString()
  };

  await redis.rpush('request_logs', JSON.stringify(logEntry));

  const logs = await getLogs();

  broadcastMessage('update_logs', logs);

  return { status: 'received' };
}

async function triggerXSS(payload) {
  try {
    console.log('Adding job to the queue with payload:', payload);
    await storeXSSPayload(payload);

    const job = await triggerXSSQueue.add({ xssPayload: payload });

    return { status: 'queued', job_id: job.id };
  } catch (error) {
    console.error('Error triggering XSS:', error);
    throw error;
  }
}

async function storeXSSPayload(payload) {
  if (!payload) return;

  await redis.rpush('xss_payloads', payload);
}

async function getLatestXSSPayload() {
  const latestPayload = await redis.lindex('xss_payloads', -1);
  return latestPayload || '';
}

export async function fetchDefaultCSP() {
    const cachedCSP = await redis.get('cachedCSPHeader');
    return cachedCSP || '';
} 

export async function getCachedCSP() {
    let cachedCSP = await redis.get('cachedCSPHeader');
  
    if (cachedCSP) {
      return cachedCSP; // TOOD: Should we cache the CSP header?
    } else {
      const nonce = crypto.randomBytes(16).toString('hex');
      const cspWithNonce = `default-src 'self'; script-src 'self' 'nonce-${nonce}'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; object-src 'none'; base-uri 'none'; report-uri /csp-report`;
  
      await redis.set('cachedCSPHeader', cspWithNonce);
  
      return cspWithNonce;
    }
  }

export {
  redis,
  handleCallback,
  submitViolation,
  getViolationHistory,
  getLogs,
  triggerXSS,
  storeXSSPayload,
  getLatestXSSPayload
};
