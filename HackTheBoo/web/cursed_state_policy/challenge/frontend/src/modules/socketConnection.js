import { flash } from '@/modules/flashMessages'
import { handleNewLog, handleUpdateViolations, handleDefaultCSP, handleUpdateLogs, handleJobProgress } from '@/modules/actions';

let socket = null;

export async function connectWebSocket() {
    try {
        console.log("Attempting to establish WebSocket connection...");
        socket = await createWebSocket();

        socket.onmessage = (event) => {
            console.log("Received WebSocket message:", event.data);
            const { type, payload } = JSON.parse(event.data);

            const handlers = {
                'new_log': handleNewLog,
                'update_violations': handleUpdateViolations,
                'default_csp': handleDefaultCSP,
                'update_logs': handleUpdateLogs,
                'job_update': handleJobProgress,
                'fetch_logs': handleUpdateLogs,
                'error': handleErrorMessage
            };

            const handler = handlers[type];
            if (handler) {
                console.log(`Handling action type: ${type}`);
                handler(payload);
            } else {
                console.error('Unknown action type:', type);
            }
        };

        socket.onclose = (event) => {
            console.warn(`WebSocket connection closed (code: ${event.code}, reason: ${event.reason}). Attempting to reconnect...`);
            reconnectWebSocket();
        };

        socket.onerror = (error) => {
            console.error("WebSocket encountered an error:", error);
        };

        if (window.location.pathname === '/') {
            console.log("Fetching default CSP after connection...");
            handleIncomingAction('fetch-default-csp');
        }
        return socket;
    } catch (error) {
        console.error("WebSocket connection failed:", error);
        reconnectWebSocket();
    }
}

function createWebSocket() {
    return new Promise((resolve, reject) => {
        const ws = new WebSocket(`ws://${window.location.host}/ws`);

        ws.onopen = () => {
            console.log("WebSocket connection established.");
            resolve(ws);
        };

        ws.onerror = (error) => {
            console.error("WebSocket error during connection:", error);
            reject(error);
        };
    });
}

function reconnectWebSocket() {
    console.log("Attempting to reconnect WebSocket in 5 seconds...");
    setTimeout(() => {
        connectWebSocket();
    }, 5000);
}

export function handleIncomingAction(action, data = null) {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
        return console.error("WebSocket connection not ready yet. Cannot send action:", action);
    }

    const messages = {
        'fetch-default-csp': { type: 'fetch_default_csp' },
        'trigger-xss': { type: 'trigger_xss', payload: data },
        'fetch-logs': { type: 'fetch_logs' },
        'fetch-latest-xss': { type: 'get_latest_xss_payload' }
    };

    const message = messages[action];
    if (message) {
        console.log(`Sending action: ${action} with payload:`, data);
        socket.send(JSON.stringify(message));
    } else {
        console.error("Unknown action type:", action);
    }
}

function handleErrorMessage(message) {
    const { payload } = message;
    flash(payload, 'danger');
    console.error('WebSocket Error:', payload);
}