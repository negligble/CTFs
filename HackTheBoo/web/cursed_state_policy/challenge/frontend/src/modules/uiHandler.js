import { connectWebSocket } from '@/modules/socketConnection';
import { refreshLogs } from '@/modules/logHandler';
import { setupButtonHandlers } from '@/modules/buttonHandlers';

async function initializeCodeMirrorAndWebSocket() {
  console.log('Initializing CodeMirror and WebSocket...');
  const { codeMirrorInitializationPromise } = await import('@/modules/syntaxHighlighter.js'); // Dynamically import CodeMirror if needed

  await codeMirrorInitializationPromise;
  console.log('CodeMirror editor initialized');

  await connectWebSocket();
  console.log('WebSocket connection established');
}

export async function initializeUI(path) {
  if (path.includes('/guidelines')) {
    console.log('Loading guidelines.js...');
    await import('@/modules/guidelines.js');
  } else {
    await initializeCodeMirrorAndWebSocket();
    setupButtonHandlers();
    refreshLogs();
  }
}
