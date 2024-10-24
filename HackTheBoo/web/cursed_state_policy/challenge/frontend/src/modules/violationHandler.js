import { highlightElementCode } from '@/modules/elementHighlighter';
import { Tooltip } from 'bootstrap';

export function displayViolations(violations) {
  const violationsContainer = document.getElementById('violationDetails');
  const violationsCard = document.getElementById('violations');

  violationsContainer.innerHTML = '';

  if (!Array.isArray(violations) || violations.length === 0) {
    violationsCard.classList.add('hidden');
    violationsContainer.innerHTML = '<p class="text-warning">No violations to display.</p>';
    return;
  }

  const latestViolation = violations[violations.length - 1];
  const cspReport = latestViolation['csp-report'] || {};
  
  const {
    'document-uri': documentURI = null,
    referrer = null,
    'violated-directive': violatedDirective = null,
    'effective-directive': effectiveDirective = null,
    'blocked-uri': blockedURI = null,
    'original-policy': originalPolicy = null,
    disposition = null,
    'status-code': statusCode = null,
    'script-sample': scriptSample = null,
    'source-file': sourceFile = null,
    'line-number': lineNumber = null,
    'column-number': columnNumber = null,
  } = cspReport;

  // Convert timestamp to user's timezone
  const timeReported = new Date(latestViolation.time).toLocaleString() || 'Unknown Time';

  const violationItem = document.createElement('div');
  violationItem.classList.add('violation-item', 'p-2', 'mb-2', 'text-white', 'rounded', 'bg-dark');

  let violationContent = `
    <h4 class="d-flex align-items-center mb-2">
      <span class="material-icons me-2 text-danger">warning</span>
      CSP Violation
    </h4>
  `;

  // Display each directive with reasoning if not available
  violationContent += createViolationDetailWithTooltip(
    'link', 
    'Document URI:', 
    documentURI, 
    'documentURIContainer', 
    'http', 
    'The URL where the violation occurred. It may not be provided if the resource is inline or blocked by policy.', 
    'Not provided (possibly inline or blocked resource due to frame policy)'
  );

  violationContent += createViolationDetailWithTooltip(
    'link', 
    'Referrer:', 
    referrer, 
    'referrerContainer', 
    'http', 
    'The URL of the page that linked to the violated resource. It might not be present if Referrer-Policy blocks it.', 
    'Not provided (Referrer-Policy may block this or it was not sent)'
  );

  violationContent += createViolationDetailWithTooltip(
    'security', 
    'Violated Directive:', 
    violatedDirective, 
    'violatedDirectiveContainer', 
    'csp', 
    'The CSP directive that was violated. This should always be present in a valid report.', 
    'Missing (anomaly or invalid violation report)'
  );

  violationContent += createViolationDetailWithTooltip(
    'security', 
    'Effective Directive:', 
    effectiveDirective, 
    'effectiveDirectiveContainer', 
    'csp', 
    'The CSP directive enforced by the browser.', 
    'Not provided (browser may not have enforced any specific directive)'
  );

  violationContent += createViolationDetailWithTooltip(
    'block', 
    'Blocked URI:', 
    blockedURI, 
    'blockedURIContainer', 
    'http', 
    'The URI of the resource blocked by CSP. Inline or blocked resources may not have a URI.', 
    'Not provided (likely an inline or blocked resource)'
  );

  violationContent += createViolationDetailWithTooltip(
    'policy', 
    'Original Policy:', 
    originalPolicy, 
    'policyContainer', 
    'csp', 
    'The original CSP policy applied to the page. This should always be present in a valid report.', 
    'Missing (anomaly or invalid violation report)'
  );

  violationContent += createViolationDetailWithTooltip(
    'assignment_late', 
    'Disposition:', 
    disposition, 
    '', 
    '', 
    'Indicates if the violation was enforced or report-only.', 
    'Not provided (missing or unclear if violation was enforced or just reported)'
  );

  violationContent += createViolationDetailWithTooltip(
    'error', 
    'Status Code:', 
    statusCode, 
    '', 
    '', 
    'The HTTP status code of the response. It may not be provided if the violation was for an inline resource.', 
    'Not provided (could be inline resource or no status code available)'
  );

  violationContent += createViolationDetailWithTooltip(
    'code', 
    'Script Sample:', 
    scriptSample, 
    'scriptContainer', 
    'javascript', 
    'A sample of the blocked script, if available.', 
    'Not provided (no script sample available or missing)'
  );

  violationContent += createViolationDetailWithTooltip(
    'source', 
    'Source File:', 
    sourceFile, 
    'sourceFileContainer', 
    'http', 
    'The file where the violation occurred, if available.', 
    'Not provided (source file may be unavailable)'
  );

  violationContent += createViolationDetailWithTooltip(
    'format_list_numbered', 
    'Line Number:', 
    lineNumber, 
    '', 
    '', 
    'The line number in the file where the violation occurred.', 
    'Not provided (missing or irrelevant line number)'
  );

  violationContent += createViolationDetailWithTooltip(
    'format_list_numbered', 
    'Column Number:', 
    columnNumber, 
    '', 
    '', 
    'The column number in the file where the violation occurred.', 
    'Not provided (missing or irrelevant column number)'
  );

  violationContent += createViolationDetailWithTooltip(
    'schedule', 
    'Reported At:', 
    timeReported, 
    '', 
    '', 
    'The time when the violation was reported.'
  );

  violationItem.innerHTML = violationContent;
  violationsContainer.appendChild(violationItem);
  violationsCard.classList.remove('hidden');

  // Highlight specific fields
  highlightViolationField('violatedDirectiveContainer', violatedDirective, 'csp', 'Missing (anomaly or invalid violation report)');
  highlightViolationField('effectiveDirectiveContainer', effectiveDirective, 'csp', 'Not provided');
  highlightViolationField('documentURIContainer', documentURI, 'http', 'Not provided (possibly inline or blocked resource)');
  highlightViolationField('referrerContainer', referrer, 'http', 'Not provided (Referrer-Policy may block this or it was not sent)');
  highlightViolationField('blockedURIContainer', blockedURI, 'http', 'Not provided (likely an inline or blocked resource)');
  highlightViolationField('sourceFileContainer', sourceFile, 'http', 'Not provided');
  highlightViolationField('policyContainer', originalPolicy, 'csp', 'Missing (anomaly or invalid violation report)');
  highlightViolationField('scriptContainer', scriptSample, 'javascript', 'Not provided');

  document.querySelectorAll('.tooltip-icon').forEach((tooltipElement) => {
    new Tooltip(tooltipElement);
  });
}

function createViolationDetailWithTooltip(icon, label, value, containerId = '', language = '', tooltip = '', reasoning = 'No data available') {
  const idAttribute = containerId ? `id="${containerId}"` : '';
  const displayValue = value ? value : `<em>${reasoning}</em>`;
  return `
    <div class="d-flex align-items-center mb-1">
      <span class="material-icons me-2 ${icon}-icon">${icon}</span>
      <strong class="me-1">${label}</strong>
      <span ${idAttribute} class="ms-1">${displayValue}</span>
      <span class="material-icons ms-auto tooltip-icon" data-bs-toggle="tooltip" data-bs-placement="top" title="${tooltip}">
        info
      </span>
    </div>
  `;
}

function highlightViolationField(containerId, content, language, reasoning) {
  const container = document.getElementById(containerId);
  if (container && content) {
    highlightElementCode(container, content, language);
  } else if (container) {
    container.innerHTML = `<em>${reasoning}</em>`;
  }
}
