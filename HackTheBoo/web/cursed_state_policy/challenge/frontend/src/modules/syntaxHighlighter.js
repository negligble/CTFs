import CodeMirror from 'codemirror/lib/codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/display/autorefresh';
import 'codemirror/theme/material.css';

import 'codemirror/mode/javascript/javascript';

CodeMirror.defineMode('csp', function () {
    return {
        token: function (stream) {
            // CSP directives (keywords)
            const cspDirectives = /\b(base-uri|child-src|connect-src|default-src|font-src|form-action|frame-ancestors|frame-src|img-src|manifest-src|media-src|object-src|plugin-types|prefetch-src|report-sample|report-to|report-uri|sandbox|script-src|script-src-elem|script-src-attr|style-src|style-src-elem|style-src-attr|trusted-types|upgrade-insecure-requests|worker-src|navigate-to|require-sri-for|require-trusted-types-for|block-all-mixed-content|unsafe-hashes)\b/;

            // CSP keywords (built-in values)
            const cspKeywords = /\b(self|none|unsafe-inline|unsafe-eval|unsafe-hashes|unsafe-allow-redirects|strict-dynamic|wasm-unsafe-eval)\b/;

            // Nonce values
            const noncePattern = /nonce-[a-zA-Z0-9+/=]+/;

            // Hash algorithms and values
            const hashPattern = /sha(256|384|512)-[a-zA-Z0-9+/=]+/;

            // Schemes (e.g., https:, data:, blob:)
            const schemePattern = /\b(https?|wss?|ftp|ftps|data|blob|filesystem|mediastream):/;

            // Wildcard source (asterisk)
            const wildcardPattern = /\*/;

            // IPv4 addresses
            const ipv4Pattern = /\b\d{1,3}(\.\d{1,3}){3}\b/;

            // IPv6 addresses
            const ipv6Pattern = /\[[a-fA-F0-9:]+\]/;

            // Hostnames and domain names
            const hostnamePattern = /([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(:\d+)?(\/[^\s;]*)?/;

            // Relative URLs and paths
            const relativeUrlPattern = /\/[^\s;]*/;

            // MIME types (e.g., application/pdf)
            const mimeTypePattern = /\b[a-zA-Z]+\/[a-zA-Z0-9\-.+]+\b/;

            // Punctuation (semicolons and colons)
            const punctuationPattern = /[;:]/;

            // Start tokenizing
            if (stream.match(cspDirectives)) {
                return 'keyword'; // Style for CSP directives (keywords)
            } else if (stream.match(cspKeywords)) {
                return 'builtin'; // Style for CSP keywords (built-in values)
            } else if (stream.match(noncePattern)) {
                return 'number'; // Style for nonce values
            } else if (stream.match(hashPattern)) {
                return 'number'; // Style for hash algorithms and values
            } else if (stream.match(schemePattern)) {
                return 'string'; // Style for schemes
            } else if (stream.match(wildcardPattern)) {
                return 'string'; // Style for wildcard source
            } else if (stream.match(ipv4Pattern) || stream.match(ipv6Pattern)) {
                return 'string'; // Style for IP addresses
            } else if (stream.match(hostnamePattern)) {
                return 'string'; // Style for hostnames and domain names
            } else if (stream.match(relativeUrlPattern)) {
                return 'string'; // Style for relative URLs and paths
            } else if (stream.match(mimeTypePattern)) {
                return 'string'; // Style for MIME types
            } else if (stream.match(punctuationPattern)) {
                return 'operator'; // Style for punctuation
            } else {
                stream.next();
                return null;
            }
        }
    };
});


// Initialize CodeMirror with custom CSP language mode
function initializeCodeMirrorEditor(element, options) {
    const editor = CodeMirror.fromTextArea(element, {
        lineNumbers: true,
        mode: options.mode,
        theme: 'material',
        autoCloseTags: true,
        autoCloseBrackets: true,
        lineWrapping: true,
        ...options
    });

    return editor;
}

const codeMirrorInitializationPromise = new Promise((resolve) => {
    const cspInputElement = document.getElementById('cspInput');
    const xssInputElement = document.getElementById('xssInput');
    
    console.log('Initializing CodeMirror with custom CSP mode');
    window.codeMirrorEditors = {};
    
    if (cspInputElement) {
        window.codeMirrorEditors.cspEditor = initializeCodeMirrorEditor(cspInputElement, {
            mode: 'csp',
        });
    } else {
        console.warn("CSP input element not found or not a textarea");
    }

    if (xssInputElement) {
        xssInputElement.value = [
            "<script>",
            "   fetch('/callback', {",
            "       method: 'POST',",
            "       headers: { 'Content-Type': 'application/json' },",
            "       body: JSON.stringify({ cookies: document.cookie })",
            "   });",
            "</script>"
        ].join("\n");
    
        window.codeMirrorEditors.xssEditor = initializeCodeMirrorEditor(xssInputElement, {
            mode: 'javascript',
        });
    } else {
        console.warn("XSS input element not found or not a textarea");
    }

    resolve();
});

export { codeMirrorInitializationPromise };
