import { highlightElementCode } from '@/modules/elementHighlighter';

import '/node_modules/@fortawesome/fontawesome-free/css/all.css';

const cspDirectives = [
    {
      name: 'default-src',
      description:
        'The default-src directive defines the default policy for fetching resources such as JavaScript, Images, CSS, Fonts, AJAX requests, Frames, HTML5 Media. Not all directives fallback to default-src.',
      example: "default-src 'self' cdn.example.com;",
      level: 'CSP Level 1',
      chromeVersion: '25+',
      firefoxVersion: '23+',
      safariVersion: '7+',
      edgeVersion: '12+',
    },
    {
      name: 'script-src',
      description: 'Defines valid sources of JavaScript.',
      example: "script-src 'self' js.example.com;",
      level: 'CSP Level 1',
      chromeVersion: '25+',
      firefoxVersion: '23+',
      safariVersion: '7+',
      edgeVersion: '12+',
    },
    {
      name: 'style-src',
      description: 'Defines valid sources of stylesheets or CSS.',
      example: "style-src 'self' css.example.com;",
      level: 'CSP Level 1',
      chromeVersion: '25+',
      firefoxVersion: '23+',
      safariVersion: '7+',
      edgeVersion: '12+',
    },
    {
      name: 'img-src',
      description: 'Defines valid sources of images.',
      example: "img-src 'self' img.example.com;",
      level: 'CSP Level 1',
      chromeVersion: '25+',
      firefoxVersion: '23+',
      safariVersion: '7+',
      edgeVersion: '12+',
    },
    {
      name: 'connect-src',
      description:
        'Applies to XMLHttpRequest (AJAX), WebSocket, fetch(), <a ping> or EventSource. If not allowed, the browser emulates a 400 HTTP status code.',
      example: "connect-src 'self';",
      level: 'CSP Level 1',
      chromeVersion: '25+',
      firefoxVersion: '23+',
      safariVersion: '7+',
      edgeVersion: '12+',
    },
    {
      name: 'font-src',
      description:
        'Defines valid sources of font resources (loaded via @font-face).',
      example: 'font-src font.example.com;',
      level: 'CSP Level 1',
      chromeVersion: '25+',
      firefoxVersion: '23+',
      safariVersion: '7+',
      edgeVersion: '12+',
    },
    {
      name: 'object-src',
      description:
        'Defines valid sources of plugins, e.g., <object>, <embed>, or <applet>.',
      example: "object-src 'self';",
      level: 'CSP Level 1',
      chromeVersion: '25+',
      firefoxVersion: '23+',
      safariVersion: '7+',
      edgeVersion: '12+',
    },
    {
      name: 'media-src',
      description:
        'Defines valid sources of audio and video, e.g., HTML5 <audio>, <video> elements.',
      example: 'media-src media.example.com;',
      level: 'CSP Level 1',
      chromeVersion: '25+',
      firefoxVersion: '23+',
      safariVersion: '7+',
      edgeVersion: '12+',
    },
    {
      name: 'frame-src',
      description:
        'Defines valid sources for loading frames. In CSP Level 2 frame-src was deprecated in favor of the child-src directive. CSP Level 3 has undeprecated frame-src, and it will continue to defer to child-src if not present.',
      example: "frame-src 'self';",
      level: 'CSP Level 1',
      chromeVersion: 'N/A',
      firefoxVersion: 'N/A',
      safariVersion: 'N/A',
      edgeVersion: 'N/A',
    },
    {
      name: 'sandbox',
      description:
        'Enables a sandbox for the requested resource similar to the iframe sandbox attribute. The sandbox applies a same-origin policy, prevents popups, plugins, and script execution is blocked.',
      example: 'sandbox allow-forms allow-scripts;',
      level: 'CSP Level 1',
      chromeVersion: '25+',
      firefoxVersion: '50+',
      safariVersion: '7+',
      edgeVersion: '12+',
    },
    {
      name: 'report-uri',
      description:
        'Instructs the browser to POST reports of policy failures to this URI. Deprecated in CSP Level 3 in favor of the report-to directive.',
      example: 'report-uri /some-report-uri;',
      level: 'CSP Level 1',
      chromeVersion: '25+',
      firefoxVersion: '23+',
      safariVersion: '7+',
      edgeVersion: '12+',
    },
    {
      name: 'child-src',
      description:
        'Defines valid sources for web workers and nested browsing contexts loaded using elements such as <frame> and <iframe>.',
      example: "child-src 'self';",
      level: 'CSP Level 2',
      chromeVersion: '40+',
      firefoxVersion: '45+',
      safariVersion: 'N/A',
      edgeVersion: '15+',
    },
    {
      name: 'form-action',
      description:
        'Defines valid sources that can be used as an HTML <form> action.',
      example: "form-action 'self';",
      level: 'CSP Level 2',
      chromeVersion: '40+',
      firefoxVersion: '36+',
      safariVersion: 'N/A',
      edgeVersion: '15+',
    },
    {
      name: 'frame-ancestors',
      description:
        'Defines valid sources for embedding the resource using <frame> <iframe> <object> <embed> <applet>.',
      example: "frame-ancestors 'none';",
      level: 'CSP Level 2',
      chromeVersion: '39+',
      firefoxVersion: '33+',
      safariVersion: 'N/A',
      edgeVersion: '15+',
    },
    {
      name: 'plugin-types',
      description:
        'Defines valid MIME types for plugins invoked via <object> and <embed>.',
      example: 'plugin-types application/pdf;',
      level: 'CSP Level 2',
      chromeVersion: '40+',
      firefoxVersion: 'N/A',
      safariVersion: 'N/A',
      edgeVersion: '15+',
    },
    {
      name: 'base-uri',
      description:
        'Defines a set of allowed URLs which can be used in the src attribute of an HTML base tag.',
      example: "base-uri 'self';",
      level: 'CSP Level 2',
      chromeVersion: '40+',
      firefoxVersion: 'N/A',
      safariVersion: 'N/A',
      edgeVersion: '15+',
    },
    {
      name: 'report-to',
      description:
        'Defines a reporting group name defined by a Report-To HTTP response header.',
      example: 'report-to groupName;',
      level: 'CSP Level 3',
      chromeVersion: '70+',
      firefoxVersion: 'N/A',
      safariVersion: 'N/A',
      edgeVersion: 'N/A',
    },
    {
      name: 'worker-src',
      description:
        'Restricts the URLs which may be loaded as a Worker, SharedWorker, or ServiceWorker.',
      example: "worker-src 'none';",
      level: 'CSP Level 3',
      chromeVersion: '59+',
      firefoxVersion: '58+',
      safariVersion: 'N/A',
      edgeVersion: 'N/A',
    },
    {
      name: 'manifest-src',
      description:
        'Restricts the URLs that application manifests can be loaded.',
      example: "manifest-src 'none';",
      level: 'CSP Level 3',
      chromeVersion: 'Yes',
      firefoxVersion: '40+',
      safariVersion: 'N/A',
      edgeVersion: 'N/A',
    },
    {
      name: 'prefetch-src',
      description:
        'Defines valid sources for request prefetch and prerendering.',
      example: "prefetch-src 'none';",
      level: 'CSP Level 3',
      chromeVersion: 'N/A',
      firefoxVersion: 'N/A',
      safariVersion: 'N/A',
      edgeVersion: 'N/A',
    },
    {
      name: 'navigate-to',
      description:
        'Restricts the URLs that the document may navigate to by any means.',
      example: 'navigate-to example.com;',
      level: 'CSP Level 3',
      chromeVersion: 'N/A',
      firefoxVersion: 'N/A',
      safariVersion: 'N/A',
      edgeVersion: 'N/A',
    },
    {
      name: 'upgrade-insecure-requests',
      description:
        'Automatically converts URLs from HTTP to HTTPS for links, images, JavaScript, CSS, etc.',
      example: 'upgrade-insecure-requests;',
      level: 'N/A',
      chromeVersion: '43+',
      firefoxVersion: '42+',
      safariVersion: '10.1+',
      edgeVersion: '17+',
    },
    {
      name: 'block-all-mixed-content',
      description: 'Blocks requests to non-secure HTTP URLs.',
      example: 'block-all-mixed-content;',
      level: 'N/A',
      chromeVersion: 'N/A',
      firefoxVersion: 'N/A',
      safariVersion: 'N/A',
      edgeVersion: 'N/A',
    },
  ];
  
const sourceList = [
    { value: '*', example: "img-src *", description: "Wildcard, allows any URL except data: blob: filesystem: schemes." },
    { value: "'none'", example: "object-src 'none'", description: "Prevents loading resources from any source." },
    { value: "'self'", example: "script-src 'self'", description: "Allows loading resources from the same origin (same scheme, host, and port)." },
    { value: "data:", example: "img-src 'self' data:", description: "Allows loading resources via the data scheme (e.g., Base64 encoded images)." },
    { value: "domain.example.com", example: "img-src domain.example.com", description: "Allows loading resources from the specified domain name." },
    { value: "*.example.com", example: "img-src *.example.com", description: "Allows loading resources from any subdomain under example.com." },
    { value: "https://cdn.com", example: "img-src https://cdn.com", description: "Allows loading resources only over HTTPS matching the given domain." },
    { value: "https:", example: "img-src https:", description: "Allows loading resources only over HTTPS on any domain." },
    { value: "'unsafe-inline'", example: "script-src 'unsafe-inline'", description: "Allows use of inline source elements such as style attribute, onclick, or script tag bodies." },
    { value: "'unsafe-eval'", example: "script-src 'unsafe-eval'", description: "Allows unsafe dynamic code evaluation such as JavaScript eval()." },
    { value: "'sha256-'", example: "script-src 'sha256-xyz...'", description: "Allows an inline script or CSS to execute if its hash matches the specified hash in the header." },
    { value: "'nonce-'", example: "script-src 'nonce-rAnd0m'", description: "Allows an inline script or CSS to execute if the script tag contains a nonce attribute matching the nonce specified in the CSP header." },
    { value: "'strict-dynamic'", example: "script-src 'strict-dynamic'", description: "Enables an allowed script to load additional scripts via non-parser-inserted script elements." },
    { value: "'unsafe-hashes'", example: "script-src 'unsafe-hashes' 'sha256-abc...'", description: "Allows you to enable scripts in event handlers (e.g., onclick)." },
];
const cspGuideContainer = document.getElementById('csp-guide');

cspDirectives.forEach(directive => {
const directiveDiv = document.createElement('div');
directiveDiv.classList.add('csp-directive');

const nameElement = document.createElement('h3');
nameElement.innerHTML = `<code>${directive.name}</code>`;
directiveDiv.appendChild(nameElement);

const descriptionElement = document.createElement('p');

function processDescription(description) {
    const fragment = document.createDocumentFragment();

    const codeRegex = /<[^>]+>/g;
    let lastIndex = 0;
    let match;

    while ((match = codeRegex.exec(description)) !== null) {
        if (match.index > lastIndex) {
            const textPart = description.substring(lastIndex, match.index);
            const textNode = document.createTextNode(textPart);
            fragment.appendChild(textNode);
        }

        const codeContent = match[0];
        const codeElement = document.createElement('code');
        highlightElementCode(codeElement, codeContent, 'xml');
        fragment.appendChild(codeElement);

        lastIndex = codeRegex.lastIndex;
    }
    if (lastIndex < description.length) {
        const textPart = description.substring(lastIndex);
        const textNode = document.createTextNode(textPart);
        fragment.appendChild(textNode);
    }

    return fragment;
}

const processedDescription = processDescription(directive.description);
descriptionElement.appendChild(processedDescription);

directiveDiv.appendChild(descriptionElement);

const exampleHeading = document.createElement('h5');
exampleHeading.innerText = `Example ${directive.name} Policy`;
directiveDiv.appendChild(exampleHeading);

const codeElement = document.createElement('pre');
highlightElementCode(codeElement, directive.example, 'csp');
directiveDiv.appendChild(codeElement);

const compatibilityDiv = document.createElement('div');
compatibilityDiv.classList.add('compatibility-icons');

if (directive.level && directive.level !== "N/A") {
    compatibilityDiv.innerHTML += `<span class="badge bg-success">${directive.level}</span>&nbsp;`;
}
if (directive.chromeVersion && directive.chromeVersion !== "N/A") {
    compatibilityDiv.innerHTML += `<i class="fa-brands fa-chrome" title="Chrome ${directive.chromeVersion}" aria-hidden="true"></i><span class="sr-only">Chrome ${directive.chromeVersion}</span> ${directive.chromeVersion}&nbsp;`;
}
if (directive.firefoxVersion && directive.firefoxVersion !== "N/A") {
    compatibilityDiv.innerHTML += `<i class="fa-brands fa-firefox" title="Firefox ${directive.firefoxVersion}" aria-hidden="true"></i><span class="sr-only">Firefox ${directive.firefoxVersion}</span> ${directive.firefoxVersion}&nbsp;`;
}
if (directive.safariVersion && directive.safariVersion !== "N/A") {
    compatibilityDiv.innerHTML += `<i class="fa-brands fa-safari" title="Safari ${directive.safariVersion}" aria-hidden="true"></i><span class="sr-only">Safari ${directive.safariVersion}</span> ${directive.safariVersion}&nbsp;`;
}
if (directive.edgeVersion && directive.edgeVersion !== "N/A") {
    compatibilityDiv.innerHTML += `<i class="fa-brands fa-edge" title="Edge ${directive.edgeVersion}" aria-hidden="true"></i><span class="sr-only">Edge ${directive.edgeVersion}</span> ${directive.edgeVersion}`;
}

if (compatibilityDiv.innerHTML.trim()) {
    directiveDiv.appendChild(compatibilityDiv);
}

cspGuideContainer.appendChild(directiveDiv);
});


const sourceListContainer = document.getElementById('source-list');
sourceList.forEach(source => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><code class="text-light"></code></td>
        <td><code class="text-light"></code></td>
        <td class="text-light">${source.description}</td>
    `;
    
    sourceListContainer.appendChild(row);

    // Highlight the source value and example
    const valueElement = row.querySelector('td:nth-child(1) code');
    const exampleElement = row.querySelector('td:nth-child(2) code');
    
    highlightElementCode(valueElement, source.value, 'csp');
    highlightElementCode(exampleElement, source.example, 'csp');
});

const browserSupport = [
  {
    browser: 'Chrome',
    icon: 'fa-brands fa-chrome',
    versions: [
      { header: 'Content-Security-Policy', cspLevel: 'CSP Level 3', version: '59+', support: 'Partial Support', bgClass: 'bg-success' },
      { header: 'Content-Security-Policy', cspLevel: 'CSP Level 2', version: '40+', support: 'Full Support Since January 2015', bgClass: 'bg-success' },
      { header: 'Content-Security-Policy', cspLevel: 'CSP 1.0', version: '25+', support: '', bgClass: 'bg-success' },
      { header: 'X-Webkit-CSP', cspLevel: 'Deprecated', version: '14-24', support: '', bgClass: 'bg-warning' }
    ]
  },
  {
    browser: 'Firefox',
    icon: 'fa-brands fa-firefox',
    versions: [
      { header: 'Content-Security-Policy', cspLevel: 'CSP Level 3', version: '58+', support: 'Partial Support', bgClass: 'bg-success' },
      { header: 'Content-Security-Policy', cspLevel: 'CSP Level 2', version: '31+', support: 'Partial Support Since July 2014', bgClass: 'bg-success' },
      { header: 'Content-Security-Policy', cspLevel: 'CSP 1.0', version: '23+', support: 'Full Support', bgClass: 'bg-success' },
      { header: 'X-Content-Security-Policy', cspLevel: 'Deprecated', version: '4-22', support: '', bgClass: 'bg-warning' }
    ]
  },
  {
    browser: 'Safari',
    icon: 'fa-brands fa-safari',
    versions: [
      { header: 'Content-Security-Policy', cspLevel: 'CSP Level 3', version: '15.4+', support: 'Partial Support', bgClass: 'bg-success' },
      { header: 'Content-Security-Policy', cspLevel: 'CSP Level 2', version: '10+', support: '', bgClass: 'bg-success' },
      { header: 'Content-Security-Policy', cspLevel: 'CSP 1.0', version: '7+', support: '', bgClass: 'bg-success' },
      { header: 'X-Webkit-CSP', cspLevel: 'Deprecated', version: '6', support: '', bgClass: 'bg-warning' }
    ]
  },
  {
    browser: 'Edge',
    icon: 'fa-brands fa-edge',
    versions: [
      { header: 'Content-Security-Policy', cspLevel: 'CSP Level 3', version: '79+', support: 'Partial Support', bgClass: 'bg-success' },
      { header: 'Content-Security-Policy', cspLevel: 'CSP Level 2', version: '15+ Partial, 76+ Full', support: '', bgClass: 'bg-success' },
      { header: 'Content-Security-Policy', cspLevel: 'CSP 1.0', version: '12+', support: '', bgClass: 'bg-success' }
    ]
  },
  {
    browser: 'Internet Explorer',
    icon: 'fa-brands fa-internet-explorer',
    versions: [
      { header: 'X-Content-Security-Policy', cspLevel: 'Deprecated', version: '10-11', support: 'Supports only <code>sandbox</code>', bgClass: 'bg-warning' },
      { header: 'Content-Security-Policy', cspLevel: 'No Support', version: 'N/A', support: '', bgClass: 'bg-danger' }
    ]
  }
];


const browserSupportContainer = document.getElementById('csp-browser-support');
browserSupport.forEach(browser => {
  const browserDiv = document.createElement('div');
  browserDiv.innerHTML = `<h3><i class="${browser.icon}" title="${browser.browser}"></i> ${browser.browser}</h3>`;

  browser.versions.forEach(version => {
    const versionDiv = document.createElement('div');
    versionDiv.classList.add('browser-support-row');
    
    const bgClass = version.bgClass || 'bg-success';
    
    versionDiv.innerHTML = `
      <code class="csp-header">${version.header}</code> 
      <span class="${bgClass}">${version.cspLevel}</span> 
      <span> - ${browser.browser} ${version.version} </span>
      <small>${version.support}</small>
    `;
    browserDiv.appendChild(versionDiv);
  });

  browserSupportContainer.appendChild(browserDiv);
});
