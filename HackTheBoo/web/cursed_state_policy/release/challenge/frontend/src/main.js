import '@/styles/main.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'material-icons/iconfont/filled.css';
import 'material-icons/iconfont/outlined.css';

import '@/modules/music.js';

import { initializeUI } from '@/modules/uiHandler.js';

console.log('Starting app...');

document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM fully loaded and parsed');

    initializeUI(window.location.pathname);
    console.log('UI initialized');
});
