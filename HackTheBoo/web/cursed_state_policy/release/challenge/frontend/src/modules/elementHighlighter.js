import hljs from 'highlight.js/lib/core';

import http from 'highlight.js/lib/languages/http';
import javascript from 'highlight.js/lib/languages/javascript';
import xml from 'highlight.js/lib/languages/xml';
import json from 'highlight.js/lib/languages/json';


import 'highlight.js/styles/atom-one-dark.css';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('http', http);
hljs.registerLanguage('json', json);

hljs.registerLanguage('csp', function(hljs) {
    return {
        name: 'CSP',
        case_insensitive: true,
        keywords: {
            keyword:
                'base-uri child-src connect-src default-src font-src form-action frame-ancestors ' +
                'frame-src img-src manifest-src media-src object-src plugin-types prefetch-src ' +
                'report-sample report-to report-uri sandbox script-src script-src-elem ' +
                'script-src-attr style-src style-src-elem style-src-attr trusted-types ' +
                'unsafe-hashes upgrade-insecure-requests worker-src navigate-to ' +
                'require-sri-for require-trusted-types-for block-all-mixed-content',
        },
        contains: [
            {
                className: 'string',
                variants: [
                    // Match CSP keywords and directives in single quotes
                    { begin: /'(self|unsafe-inline|unsafe-eval|unsafe-hashes|unsafe-allow-redirects|strict-dynamic|none|wasm-unsafe-eval|nonce-[^']+|sha(256|384|512)-[a-zA-Z0-9+/=]+)'/ },

                    // Match schemes (e.g., https:, data:, blob:)
                    { begin: /\b(https?|wss?|ftp|ftps|data|blob|filesystem|mediastream):/, relevance: 0 },

                    // Match wildcard source (asterisk)
                    { begin: /\*/, relevance: 0 },

                    // Match IPv4 addresses
                    { begin: /\b\d{1,3}(\.\d{1,3}){3}\b/, relevance: 0 },

                    // Match IPv6 addresses
                    { begin: /\[[a-fA-F0-9:]+\]/, relevance: 0 },

                    // Match hostnames and domain names
                    { begin: /([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(:\d+)?(\/[^\s;]*)?/, relevance: 0 },

                    // Match relative URLs and paths
                    { begin: /\/[^\s;]*/, relevance: 0 },

                    // Match MIME types (e.g., application/pdf)
                    { begin: /\b[a-zA-Z]+\/[a-zA-Z0-9\-.+]+\b/, relevance: 0 },
                ]
            },
            // Highlight CSP directives (keywords)
            {
                className: 'keyword',
                begin: /\b(base-uri|block-all-mixed-content|child-src|connect-src|default-src|font-src|form-action|frame-ancestors|frame-src|img-src|manifest-src|media-src|object-src|plugin-types|prefetch-src|report-sample|report-to|report-uri|sandbox|script-src|script-src-elem|script-src-attr|style-src|style-src-elem|style-src-attr|trusted-types|upgrade-insecure-requests|worker-src|navigate-to|require-sri-for|require-trusted-types-for|unsafe-hashes)\b/
            },
            // Highlight CSP keywords (e.g., 'self', 'none', 'unsafe-inline')
            {
                className: 'built_in',
                begin: /\b(self|none|unsafe-inline|unsafe-eval|unsafe-hashes|unsafe-allow-redirects|strict-dynamic|wasm-unsafe-eval)\b/
            },
            // Highlight nonce values
            {
                className: 'number',
                begin: /nonce-[a-zA-Z0-9+/=]+/
            },
            // Highlight hash algorithms and values
            {
                className: 'number',
                begin: /sha(256|384|512)-[a-zA-Z0-9+/=]+/
            },
            // Highlight punctuation (semicolons and colons)
            {
                className: 'symbol',
                begin: /[;:]/
            }
        ]
    };
});

export function highlightElementCode(element, content, languageClass) {
    element.innerHTML = '';

    const code = document.createElement('code');

    code.className = `language-${languageClass}`;
    code.textContent = content;

    element.appendChild(code);

    hljs.highlightElement(code);
}