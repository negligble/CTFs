import { flash } from '@/modules/flashMessages.js';
import { displayLogs, refreshLogs } from '@/modules/logHandler.js';
import { displayViolations } from '@/modules/violationHandler';
import { setCSPTooltip } from '@/modules/tooltipHandler.js';

export function handleJobProgress(payload) {
  const { job_id, status, message } = payload;
  const loadingButton = document.getElementById('triggerButton');

  if (status === 'started') {
    loadingButton.innerHTML = `
      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      Processing...
    `;
    loadingButton.setAttribute('disabled', true);
    flash(message || `Job with ID ${job_id} started.`, 'primary');
  }

  if (status === 'finished') {
    flash(message || `Job with ID ${job_id} finished successfully.`, 'success');
    loadingButton.innerHTML = `Trigger XSS`;
    loadingButton.removeAttribute('disabled');
    refreshLogs();
  }

  if (status === 'failed') {
    flash(message || `Job with ID ${job_id} failed.`, 'danger');
    loadingButton.innerHTML = `Trigger XSS`;
    loadingButton.removeAttribute('disabled');
  }
}

export function handleNewLog(log) {
  console.debug('Handling new log:', log);
  displayLogs(log);
}

export function handleCSPAnalysisResult(result) {
  console.debug('Handling CSP analysis result:', result);
  displayAnalysisResults(result);
}

export function handleUpdateViolations(violationsData) {
  console.debug('Handling update violations:', violationsData);

  if (Array.isArray(violationsData) && violationsData.length > 0) {
    displayViolations(violationsData);
  } else {
    console.log('No violations to display.');
  }
}

export function handleDefaultCSP(csp) {
  console.debug('Handling default CSP:', csp);

  const formattedCSP = csp.replace(/; /g, ';\n');
  const cspEditor = window.codeMirrorEditors['cspEditor'];
  
  cspEditor.setValue(formattedCSP.trim());
  
  setCSPTooltip('default');
}

export function handleUpdateLogs(logs) {
  displayLogs(logs);
}
