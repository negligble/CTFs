import { CspEvaluator } from "csp_evaluator/dist/evaluator";
import { CspParser } from "csp_evaluator/dist/parser";
import { highlightElementCode } from '@/modules/elementHighlighter';
import { setCSPTooltip } from '@/modules/tooltipHandler';

function createSeverityIcon(severity) {
    let icon, iconClass;
  
    switch (severity) {
      case 10:
        icon = 'error';
        iconClass = 'text-danger';
        break;
      case 30:
      case 40:
      case 50:
        icon = 'warning';
        iconClass = 'text-warning';
        break;
      case 60:
        icon = 'info_outline';
        iconClass = 'text-info';
        break;
      case 20:
        icon = 'clear';
        iconClass = 'text-purple';
        break;
      case 45:
        icon = 'security';
        iconClass = 'text-info';
        break;
      case 100:
      default:
        icon = 'check_circle';
        iconClass = 'text-success';
    }
  
    const iconElement = document.createElement('i');
    iconElement.classList.add('material-icons', iconClass);
    iconElement.textContent = icon;
    return iconElement;
  }
  

function parseCSPPolicy(policy) {
  const directives = policy.split(';').map((d) => d.trim()).filter(Boolean);
  const parsedPolicy = {};

  directives.forEach((directive) => {
    const [directiveName, ...values] = directive.split(/\s+/);
    parsedPolicy[directiveName] = values;
  });

  return parsedPolicy;
}

const directiveDescriptions = {
    // **CSP Level 1 Directives**
    'default-src': 'Serves as a fallback for other resource types when they do not have policies specified.',
    'script-src': 'Defines valid sources for JavaScript scripts.',
    'object-src': 'Defines valid sources for the object>, <embed>, and <applet> elements.',
    'style-src': 'Defines valid sources for stylesheets.',
    'img-src': 'Defines valid sources for images and favicons.',
    'media-src': 'Defines valid sources for loading media using the <audio> and <video> elements.',
    'frame-src': 'Defines valid sources for nested browsing contexts using elements like <frame> and <iframe>.',
    'font-src': 'Defines valid sources for fonts loaded using @font-face.',
    'connect-src': 'Defines valid sources for fetch, XMLHttpRequest, WebSocket, and EventSource connections.',
    'report-uri': 'Specifies a URI where the browser sends reports about policy violations.',
    
    // **CSP Level 2 Directives**
    'base-uri': 'Restricts the URLs that can be used in a document\'s <base> element.',
    'child-src': 'Defines valid sources for web workers and nested browsing contexts loaded using elements like <frame> and <iframe>.',
    'form-action': 'Restricts the URLs that can be used as the target of form submissions.',
    'frame-ancestors': 'Specifies valid parent sources that can embed the current page using <frame>, <iframe>, <object>, <embed>, or <applet>.',
    'plugin-types': 'Restricts the set of plugins that can be embedded into a document by limiting the types of resources that can be loaded.',
    'sandbox': 'Enables a sandbox for the requested resource similar to the sandbox attribute of an <iframe>.',
    
    // **CSP Level 3 Directives**
    'manifest-src': 'Defines valid sources for application manifest files referenced with the <link rel="manifest"> element.',
    'worker-src': 'Defines valid sources for Worker, SharedWorker, or ServiceWorker scripts.',
    'prefetch-src': 'Defines valid sources to be used for DNS prefetching, preloading, preconnecting, or prerendering.',
    'navigate-to': 'Restricts the URLs which a user agent can navigate to from a given context—for example, via <form> submissions, <a> element clicks, window.location changes, or redirects.',
    'require-trusted-types-for': 'Requires Trusted Types enforcement for the specified capabilities (e.g., `\'script\'`).',
    'trusted-types': 'Defines a whitelist of Trusted Types policies that can be used.',
    'report-to': 'Specifies the name of a reporting group where the user agent should send reports about policy violations.',
    
    // **Other Directives**
    'upgrade-insecure-requests': 'Instructs user agents to treat all of a site\'s insecure URLs (those served over HTTP) as though they have been replaced with secure URLs (HTTPS).',
    'block-all-mixed-content': 'Prevents loading any assets using HTTP when the page is loaded using HTTPS.',
    
    // **Deprecated or Obsolete Directives**
    'reflected-xss': 'Deprecated. Was used to instruct user agents to enable or disable reflective XSS protection.',
    'disown-opener': 'Deprecated. Used to prevent a window from being able to access the `window.opener` property.',
    'require-sri-for': 'Deprecated. Was used to require Subresource Integrity for scripts and styles.',
    
    // **Additional Directives (for completeness)**
    'media-type': 'Specifies valid MIME types for media sources.',
    'media-src-elem': 'Defines valid sources for <audio> and <video> elements (Level 3).',
    'script-src-elem': 'Defines valid sources for scripts loaded via <script> elements (Level 3).',
    'script-src-attr': 'Defines valid sources for script-related attributes (e.g., event handlers like `onclick`) (Level 3).',
    'style-src-elem': 'Defines valid sources for stylesheets loaded via <link> and <style> elements (Level 3).',
    'style-src-attr': 'Defines valid sources for style attributes (Level 3).',
  };
  


export function analyzeCSP(csp) {
  try {
    const parsedCsp = new CspParser(csp).csp;
    const evaluator = new CspEvaluator(parsedCsp);
    const findings = evaluator.evaluate();
    console.log(findings);
    displayAnalysisResults(findings);
  } catch (error) {
    console.error('Error analyzing CSP:', error);
  }
}

export function displayAnalysisResults(findings) {
  const csp = window.codeMirrorEditors['cspEditor'].getValue().trim();
  const parsedCSPContainer = document.getElementById('parsedCSP');
  const analysisResultsContainer = document.getElementById('analysisResults');

  parsedCSPContainer.innerHTML = '';

  const groupedFindings = findings.reduce((acc, finding) => {
    if (!acc[finding.directive]) {
      acc[finding.directive] = [];
    }
    acc[finding.directive].push(finding);
    return acc;
  }, {});

  const parsedPolicy = parseCSPPolicy(csp);

  Object.keys(parsedPolicy).forEach((directive) => {
    if (!groupedFindings[directive]) {
      groupedFindings[directive] = parsedPolicy[directive].map((value) => ({
        severity: 100,
        value: value,
        description: '',
      }));
    }
  });

  const accordion = document.createElement('div');
  accordion.classList.add('accordion');
  accordion.id = 'accordion-main';

  Object.keys(groupedFindings).forEach((directive, index) => {
    const directiveDescription =
      directiveDescriptions[directive] || `Directive "${directive}" is not a known CSP directive.`;
    const severity = Math.max(...groupedFindings[directive].map((item) => item.severity));
    const severityClass = createSeverityIcon(severity);

    const details = groupedFindings[directive].map((item) => ({
      severity: item.severity,
      value: item.value || '',
      description: item.description,
    }));

    const expandableDirective = createExpandableDirective(
      severityClass,
      directive,
      directiveDescription,
      details,
      severity,
      index,
    );

    accordion.appendChild(expandableDirective);
  });

  parsedCSPContainer.appendChild(accordion);
  analysisResultsContainer.classList.remove('hidden');
}

function createExpandableDirective(iconClass, directive, directiveDescription, details, severity, index) {
  iconClass = iconClass || 'text-success';

  const container = document.createElement('div');
  container.classList.add('card', 'mb-2', 'bg-dark', 'text-white');

  const header = document.createElement('div');
  header.classList.add('card-header');

  const headerButton = document.createElement('button');
  headerButton.classList.add('btn', 'text-white', 'w-100', 'text-start', 'collapsed');
  headerButton.type = 'button';
  headerButton.dataset.bsToggle = 'collapse';
  headerButton.ariaExpanded = 'false';
  headerButton.ariaControls = `collapse-${index}`;

  const row = document.createElement('div');
  row.classList.add('row', 'align-items-center');

  const iconCol = document.createElement('div');
  iconCol.classList.add('col-auto');

  const iconElement = createSeverityIcon(severity);
  iconCol.appendChild(iconElement);

  const textCol = document.createElement('div');
  textCol.classList.add('col');
  textCol.style.width = '90%';

  const inlineContainer = document.createElement('span');
  const directiveContainer = document.createElement('span');
  highlightElementCode(directiveContainer, directive, 'csp');

  const descriptionSpan = document.createElement('span');
  descriptionSpan.innerText = ` - ${directiveDescription}`;

  inlineContainer.appendChild(directiveContainer);
  inlineContainer.appendChild(descriptionSpan);
  textCol.appendChild(inlineContainer);

  row.appendChild(iconCol);
  row.appendChild(textCol);
  headerButton.appendChild(row);
  header.appendChild(headerButton);
  container.appendChild(header);

  const detailsContainer = document.createElement('div');
  detailsContainer.id = `collapse-${index}`;
  detailsContainer.classList.add('collapse', 'bg-dark');
  detailsContainer.ariaLabelledby = `heading-${index}`;
  detailsContainer.dataset.bsParent = '#accordion-main';

  const detailsContent = document.createElement('div');
  detailsContent.classList.add('card-body', 'text-white');

  details.forEach((detail) => {
    const detailRow = document.createElement('div');
    detailRow.classList.add('row', 'mb-2', 'align-items-center');

    const detailIconCol = document.createElement('div');
    detailIconCol.classList.add('col-auto');
    const detailIcon = createSeverityIcon(detail.severity);
    detailIconCol.appendChild(detailIcon);

    const valueCol = document.createElement('div');
    valueCol.classList.add('col-auto');
    valueCol.style.width = '30%';
    highlightElementCode(valueCol, detail.value, 'csp');

    const descriptionCol = document.createElement('div');
    descriptionCol.classList.add('col');
    descriptionCol.style.width = '60%';
    descriptionCol.innerHTML = `<ul class="list-unstyled mb-0"><li>${detail.description}</li></ul>`;

    detailRow.appendChild(detailIconCol);
    detailRow.appendChild(valueCol);
    detailRow.appendChild(descriptionCol);
    detailsContent.appendChild(detailRow);
  });

  detailsContainer.appendChild(detailsContent);
  container.appendChild(detailsContainer);

  headerButton.addEventListener('click', () => {
    const isExpanded = headerButton.getAttribute('aria-expanded') === 'true';
    headerButton.setAttribute('aria-expanded', !isExpanded);
    detailsContainer.classList.toggle('show');
  });

  return container;
}

export function analyzeAndDisplayCSP() {
    const csp = window.codeMirrorEditors['cspEditor'].getValue().trim();
    analyzeCSP(csp);
  }

export function loadSampleCSP(type) {
  const sampleCSP =
    type === 'unsafe'
      ? `script-src 'unsafe-inline' 'unsafe-eval' 'self' data: https://www.google.com http://www.google-analytics.com/gtm/js https://*.gstatic.com/feedback/ https://ajax.googleapis.com;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://www.google.com;
default-src 'self' * 127.0.0.1 https://[2a00:79e0:1b:2:b466:5fd9:dc72:f00e]/foobar;
img-src https: data:;
child-src data:;
foobar-src 'foobar';
report-uri http://csp.hackthebox.com;`
      : `script-src 'strict-dynamic' 'nonce-rAnd0m123' https:;
object-src 'none';
base-uri 'none';
frame-ancestors 'none';
require-trusted-types-for 'script';`;

  const cspEditor = window.codeMirrorEditors['cspEditor'];
  cspEditor.setValue(sampleCSP.trim());

  setCSPTooltip(type);
}