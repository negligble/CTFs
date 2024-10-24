import Queue from 'bull';
import Redis from 'ioredis';

import bot from '../bot/bot.js';

const redisPublisher = new Redis();

const triggerXSSQueue = new Queue('trigger-xss');

(async () => {
    try {
      await bot.launchBrowser();
      console.log('Browser initialized in worker.');
    } catch (error) {
      console.error('Error initializing browser in worker:', error);
      process.exit(1);
    }
  })();

triggerXSSQueue.process(async (job) => {
  try {
    const { xssPayload } = job.data;
    console.log(`Processing job with payload: ${JSON.stringify(xssPayload)}`);
   
    redisPublisher.publish('job_updates', JSON.stringify({
        job_id: job.id,
        status: 'started',
      }));
    
    const url = `http://127.0.0.1:8000/xss`;
    await bot.visitPage(url);

    redisPublisher.publish('job_updates', JSON.stringify({
        job_id: job.id,
        status: 'finished',
        result: { success: true },
      }));
  } catch (error) {
    redisPublisher.publish('job_updates', JSON.stringify({
        job_id: job.id,
        status: 'failed',
        error: error.message,
      }));
  }
});

triggerXSSQueue.on('completed', (job, result) => {
  console.log(`Job ${job.id} completed successfully with message: ${result.message}`);
});

triggerXSSQueue.on('failed', (job, error) => {
  console.error(`Job ${job.id} failed with error: ${error.message}`);
});

const gracefulShutdown = async () => {
  console.log('Shutting down worker gracefully...');

  await triggerXSSQueue.close().catch(err => console.error('Error closing Bull queue:', err));
  await redisPublisher.quit().catch(err => console.error('Error closing Redis:', err));
  await bot.closeBrowser();

  process.exit(0);
};

process.on('SIGINT', async () => {
  console.log('Received SIGINT signal.');
  await gracefulShutdown();
});

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM signal.');
  await gracefulShutdown();
});

export { triggerXSSQueue };