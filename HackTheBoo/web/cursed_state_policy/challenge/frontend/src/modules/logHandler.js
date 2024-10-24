import { highlightElementCode } from '@/modules/elementHighlighter';
import { handleIncomingAction } from '@/modules/socketConnection';

export function displayLogs(logs) {
    const logList = document.getElementById('logList');
    const requestHistorySection = document.getElementById('requestHistory');

    logList.innerHTML = '';

    const flatLogs = logs.flat();
  
    if (flatLogs.length > 0) {
        requestHistorySection.classList.remove('hidden');
    }

    if (flatLogs.length === 0) {
      logList.innerHTML = '<li class="list-group-item bg-primary text-white">No logs available</li>';
    } else {
      flatLogs.forEach((log, index) => {
        console.log('Log entry:', log);
        const method = log.method || 'N/A';
        const logTime = new Date(log.time).toLocaleString();
  
        const logItem = document.createElement('li');
        logItem.classList.add('list-group-item', 'bg-primary', 'text-white');
        logItem.textContent = `${method} | Request #${index + 1} - ${logTime}`;
  
        logItem.addEventListener('click', () => displayLogDetails(log));
        logList.appendChild(logItem);
      });
    }
  }

export function displayLogDetails(log) {
  console.debug('Displaying log details:', log);

  let modal = document.getElementById('logDetailsModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'logDetailsModal';
    modal.classList.add('modal', 'fade');
    modal.tabIndex = -1;
    modal.role = 'dialog';
    modal.innerHTML = `
    <div class="modal-dialog modal-lg" role="document" style="max-width: 90%; max-height: 90%; overflow-y: auto;">
      <div class="modal-content" style="height: 100%;">
        <div class="modal-header">
          <h3 class="modal-title">Request Details</h3>
          <button type="button" class="btn-close btn-danger" id="modalHeaderCloseButton" aria-label="Close">&times;</button>
        </div>
        <div class="modal-body preformatted">
          <div id="logModalContent" style="padding: 10px; display: block;"></div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-danger" id="modalFooterCloseButton">Close</button>
        </div>
      </div>
    </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('modalHeaderCloseButton').addEventListener('click', () => {
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.style.overflow = '';
    });

    document.getElementById('modalFooterCloseButton').addEventListener('click', () => {
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.style.overflow = '';
    });
  }

  const logTime = new Date(log.time).toLocaleString();

  let logContent = `
    <strong>Time:</strong> <span>${logTime}</span><br>
    <strong>Method:</strong> <span>${log.method}</span><br>
    <strong>Headers:</strong> <div id="logHeaders"></div>
  `;

  if (log.args && Object.keys(log.args).length) {
    logContent += `<strong>Query Params:</strong> <div id="logQueryParams"></div><br>`;
  }

  if (log.form && Object.keys(log.form).length) {
    logContent += `<strong>Form Data:</strong> <div id="logFormData"></div><br>`;
  }

  if (log.json && Object.keys(log.json).length) {
    logContent += `<strong>JSON Body:</strong> <div id="logJsonBody"></div><br>`;
  }

  if (log.data && Object.keys(log.data).length) {
    logContent += `<strong>Raw Data:</strong> <div id="logRawData"</div><br>`;
  }
  const modalContentElement = document.getElementById('logModalContent');
  modalContentElement.innerHTML = logContent.trim();

  function capitalizeHeaderKey(key) {
    return key
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('-');
  }

  const headersContainer = document.getElementById('logHeaders');
  const headersPre = document.createElement('pre');
  headersContainer.appendChild(headersPre);

  let combinedHeaders = '';
  if (log.headers) {
    Object.entries(log.headers).forEach(([key, value]) => {
      const capitalizedKey = capitalizeHeaderKey(key);
      combinedHeaders += `${capitalizedKey}: ${value}\n`;
    });
  }

  highlightElementCode(headersPre, combinedHeaders.trim(), 'http');

  if (log.args && Object.keys(log.args).length) {
    const argsContainer = document.getElementById('logQueryParams');
    const argsPre = document.createElement('pre');
    highlightElementCode(argsPre, JSON.stringify(log.args, null, 2), 'json');
    argsContainer.appendChild(argsPre);
  }

  if (log.form && Object.keys(log.form).length) {
    const formContainer = document.getElementById('logFormData');
    const formPre = document.createElement('pre');
    highlightElementCode(formPre, JSON.stringify(log.form, null, 2), 'json');
    formContainer.appendChild(formPre);
  }

  if (log.json && Object.keys(log.json).length) {
    const jsonContainer = document.getElementById('logJsonBody');
    const jsonPre = document.createElement('pre');
    highlightElementCode(jsonPre, JSON.stringify(log.json, null, 2), 'json');
    jsonContainer.appendChild(jsonPre);
  }

  if (log.data) {
    const rawDataContainer = document.getElementById('logRawData');
    const rawDataPre = document.createElement('pre');

    if (typeof log.data === 'object') {
        highlightElementCode(rawDataPre, JSON.stringify(log.data, null, 2), 'json');
    } else {
        highlightElementCode(rawDataPre, log.data, 'json');
    }

    rawDataContainer.appendChild(rawDataPre);
  }

  modal.classList.add('show');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

export function refreshLogs() {
  handleIncomingAction('fetch-logs');
}