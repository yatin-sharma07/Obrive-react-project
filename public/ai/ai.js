
const DEFAULT_AGENT_ID = 'agent_4201k6mkfkg0epv9wdr4hdn3fp38';

// Resolve AGENT_ID from multiple possible sources so you can override it without editing this file:
let AGENT_ID = (typeof window !== 'undefined' && window.ELEVENLABS_AGENT_ID) || DEFAULT_AGENT_ID;

// Try to read data-agent-id from the script tag if present (works when script tag has id="eleven-ai")
function tryReadAgentFromScriptTag() {
  try {
    // Prefer an explicit script element with id 'eleven-ai'
    const scriptEl = document.getElementById('eleven-ai') || Array.from(document.getElementsByTagName('script')).find(s => s.src && s.src.includes('/ai/ai.js'));
    if (scriptEl && scriptEl.dataset && scriptEl.dataset.agentId) {
      AGENT_ID = scriptEl.dataset.agentId;
    }
  } catch (e) {
    // ignore
  }
}

// If DOM is already available, try to read the script tag now; otherwise try later during injection
if (typeof document !== 'undefined' && document.readyState !== 'loading') {
  tryReadAgentFromScriptTag();
}

// OPTIONAL: Change navigation behavior
const OPEN_IN_NEW_TAB = false; // true = new tab, false = same tab

// OPTIONAL: Change widget position
const WIDGET_POSITION = 'bottom-right'; // 'bottom-right', 'bottom-left', 'top-right', 'top-left'

// OPTIONAL: Base URL for navigation (leave empty for auto-detection)
const BASE_URL = 'https://obrive.com';

// ============================================================================
// DON'T CHANGE ANYTHING BELOW THIS LINE
// ============================================================================

// Create and inject the widget with client tools
function injectElevenLabsWidget() {
  const ID = 'elevenlabs-convai-widget';
  
  // Check if the widget is already loaded
  if (document.getElementById(ID)) {
    return;
  }

  // Create widget script
  // Before we load the external embed, install a small, reversible network rewrite
  // This intercepts fetch/XHR calls and rewrites any convai widget URL that contains
  // an unexpected agent id to use the AGENT_ID we resolved above. This is a defensive
  // hotfix so the embed requests the agent you want while we diagnose server-side mapping.
  (function installAgentUrlRewrite() {
    try {
      const desired = AGENT_ID;
      if (!desired) return;

      // Patch fetch (async wrapper so we can inspect responses)
      const origFetch = window.fetch;
      window.fetch = async function(input, init) {
        let finalInput = input;
        try {
          let url = (typeof finalInput === 'string') ? finalInput : finalInput && finalInput.url;
          if (typeof url === 'string' && url.includes('/convai/agents/') && !url.includes(desired)) {
            const newUrl = url.replace(/(\/convai\/agents\/)[^\/]+(\/widget)/, `$1${desired}$2`);
            console.info('[ElevenLabs ConvAI] Rewriting fetch URL:', url, '->', newUrl);
            finalInput = (typeof finalInput === 'string') ? newUrl : new Request(newUrl, finalInput);
            url = newUrl;
          }

          const res = await origFetch.call(this, finalInput, init);

          // If this is a widget-config request, log the response body for diagnosis
          try {
            if (typeof url === 'string' && url.includes('/convai/agents/') && url.includes('/widget')) {
              const clone = res.clone();
              clone.text().then(text => {
                //console.info('[ElevenLabs ConvAI] widget response for', url, ':', text);
              }).catch(e => console.warn('failed to read widget response body', e));
            }
          } catch (e) {
            console.warn('widget response logging failed', e);
          }

          return res;
        } catch (e) {
          //console.warn('agent-url-rewrite fetch patch error', e);
          return origFetch.call(this, finalInput, init);
        }
      };

      // Patch XHR
      const origOpen = XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open = function(method, url) {
        try {
          if (typeof url === 'string' && url.includes('/convai/agents/') && !url.includes(desired)) {
            const newUrl = url.replace(/(\/convai\/agents\/)[^\/]+(\/widget)/, `$1${desired}$2`);
            console.info('[ElevenLabs ConvAI] Rewriting XHR URL:', url, '->', newUrl);
            return origOpen.apply(this, [method, newUrl].concat(Array.prototype.slice.call(arguments, 2)));
          }
        } catch (e) { console.warn('agent-url-rewrite xhr patch error', e); }
        return origOpen.apply(this, arguments);
      };
    } catch (e) {
      console.warn('installAgentUrlRewrite failed', e);
    }
  })();

  const script = document.createElement('script');
  script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
  script.async = true;
  script.type = 'text/javascript';
  document.head.appendChild(script);

  // Create wrapper and widget
  const wrapper = document.createElement('div');
  wrapper.className = `convai-widget ${WIDGET_POSITION}`;

  const widget = document.createElement('elevenlabs-convai');
  widget.id = ID;
  // Ensure we have the latest value for AGENT_ID (if a script tag provided an override)
  tryReadAgentFromScriptTag();

  if (!AGENT_ID) {
    console.warn('[ElevenLabs ConvAI] No agent id found. Please set window.ELEVENLABS_AGENT_ID, add data-agent-id to the script tag, or edit this file.');
    return;
  }

  // Debug: print where the agent id was resolved from
  try {
    const scriptEl = document.getElementById('eleven-ai') || Array.from(document.getElementsByTagName('script')).find(s => s.src && s.src.includes('/ai/ai.js'));
    console.debug('[ElevenLabs ConvAI] Resolved AGENT_ID:', AGENT_ID);
    console.debug('[ElevenLabs ConvAI] window.ELEVENLABS_AGENT_ID =', typeof window !== 'undefined' ? window.ELEVENLABS_AGENT_ID : undefined);
    console.debug('[ElevenLabs ConvAI] script data-agent-id =', scriptEl && scriptEl.dataset ? scriptEl.dataset.agentId : undefined);
  } catch (e) {
    // ignore logging errors
  }

  widget.setAttribute('agent-id', AGENT_ID);

  // Observe the widget element for attribute changes so we can detect if something overwrites the agent-id
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(m => {
      if (m.type === 'attributes' && m.attributeName === 'agent-id') {
        const newVal = widget.getAttribute('agent-id');
        console.warn('[ElevenLabs ConvAI] Detected agent-id attribute change ->', newVal);
        console.debug('[ElevenLabs ConvAI] Current window.ELEVENLABS_AGENT_ID =', typeof window !== 'undefined' ? window.ELEVENLABS_AGENT_ID : undefined);
        try {
          console.debug('[ElevenLabs ConvAI] script data-agent-id =', scriptEl && scriptEl.dataset ? scriptEl.dataset.agentId : undefined);
        } catch (e) {}
      }
    });
  });

  observer.observe(widget, { attributes: true });
  widget.setAttribute('variant', 'full');

  // Register the widget's client tool for external redirects. The embed may look up this
  // tool by different casing/keys, so register multiple variants on the widget and a
  // global container. This makes the handler discoverable regardless of the name used.
  const makeRedirectHandler = () => ({ url }) => {
    //console.log('redirectToExternalURL called with url:', url);

    if (!url || typeof url !== 'string') return;

    // Trim and normalize whitespace (speech-to-text often inserts spaces)
    let raw = url.trim();
    // Replace consecutive whitespace with single hyphen to better match slug patterns
    // e.g. 'virtual reality' -> 'virtual-reality'
    raw = raw.replace(/\s+/g, '-');

    // Helper to strip trailing slash from base
    const baseOrigin = (BASE_URL && BASE_URL.length > 0 ? BASE_URL : window.location.origin).replace(/\/$/, '');

    let fullUrl;
    // Absolute URL (with protocol)
    if (/^https?:\/\//i.test(raw)) {
      fullUrl = raw;
    } else if (raw.startsWith('/')) {
      // Root-relative path -> attach to origin/base
      fullUrl = baseOrigin + raw;
    } else if (/^\.|^\.\./.test(raw)) {
      // Relative path using ./ or ../ -> resolve against current location
      try {
        fullUrl = new URL(raw, window.location.href).toString();
      } catch (e) {
        fullUrl = baseOrigin + '/' + raw;
      }
    } else {
      // No leading slash -> treat as root-relative (most voice commands refer to top-level routes)
      fullUrl = baseOrigin + '/' + raw;
    }

    //console.log('Navigating to:', fullUrl);

    // Navigate based on config
    if (OPEN_IN_NEW_TAB) {
      window.open(fullUrl, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = fullUrl;
    }
  };

  const redirectHandler = makeRedirectHandler();

  // Preferred name (camelCase) and several common variants the embed might use
  const clientToolNames = [
    'redirectToExternalURL',
    'redirecttoExternalURL',
    'redirectToExternalUrl',
    'redirecttoExternalUrl',
    'redirecttoexternalurl'
  ];

  // Attach to event.detail.config when the embed fires 'call' (keeps previous behaviour)
  widget.addEventListener('elevenlabs-convai:call', (event) => {
    try {
      event.detail = event.detail || {};
      event.detail.config = event.detail.config || {};
      event.detail.config.clientTools = event.detail.config.clientTools || {};
      for (const name of clientToolNames) {
        event.detail.config.clientTools[name] = redirectHandler;
      }
      // Attempt to tell the widget to hide the provider banner via config.
      // The server may override this; it's a best-effort client-side request.
      try {
        // Support multiple possible keys the embed may inspect
        event.detail.config.widget_config = event.detail.config.widget_config || {};
        event.detail.config.widget_config.disable_banner = true;
        event.detail.config.widgetConfig = event.detail.config.widgetConfig || {};
        event.detail.config.widgetConfig.disable_banner = true;
        // also set a top-level flag in case the embed looks there
        event.detail.config.disable_banner = true;
      } catch (e) {
        console.warn('failed to set disable_banner on event config', e);
      }
    } catch (e) {
      console.warn('failed to attach clientTools to event.detail:', e);
    }
  });

  // Also expose on the widget element directly
  try {
    widget.clientTools = widget.clientTools || {};
    for (const name of clientToolNames) {
      widget.clientTools[name] = redirectHandler;
    }
  } catch (e) {
    console.warn('failed to set widget.clientTools:', e);
  }

  // And expose a global registry in case the embed checks there
  try {
    window.ELEVENLABS_CONVAI_CLIENT_TOOLS = window.ELEVENLABS_CONVAI_CLIENT_TOOLS || {};
    for (const name of clientToolNames) {
      window.ELEVENLABS_CONVAI_CLIENT_TOOLS[name] = redirectHandler;
    }
  } catch (e) {
    console.warn('failed to set global ELEVENLABS_CONVAI_CLIENT_TOOLS:', e);
  }

  // Attach widget to the DOM
  wrapper.appendChild(widget);
  document.body.appendChild(wrapper);

  // Fallback: attempt to hide any visible "Powered by ElevenLabs" badge after the widget mounts.
  // This stronger version traverses open shadow roots too so it can find badges inside web components.
  // NOTE: This is a UI workaround only. Prefer configuring the agent/widget in the ElevenLabs
  // dashboard or contacting support to white-label properly.
  try {
    const matchesPoweredBy = (text) => typeof text === 'string' && /powered by\s*elevenlabs/i.test(text);

    function hideNodeIfPoweredBy(n) {
      try {
        if (!n) return;
        if (n.textContent && matchesPoweredBy(n.textContent)) {
          console.info('[ElevenLabs ConvAI] Hiding powered-by node', n);
          n.style.setProperty('display', 'none', 'important');
          return true;
        }
        if (n.tagName === 'A' && n.href && /elevenlabs\.io/i.test(n.href)) {
          console.info('[ElevenLabs ConvAI] Hiding elevenlabs link', n.href);
          n.style.setProperty('display', 'none', 'important');
          return true;
        }
      } catch (e) {}
      return false;
    }

    function traverseAndHide(root) {
      try {
        if (!root) return;
        // Search common elements
        const nodeList = root.querySelectorAll ? Array.from(root.querySelectorAll('a,div,span')) : [];
        for (const el of nodeList) hideNodeIfPoweredBy(el);

        // If element has a shadowRoot (open), traverse it too
        const all = root.querySelectorAll ? Array.from(root.querySelectorAll('*')) : [];
        for (const el of all) {
          try {
            if (el && el.shadowRoot) {
              traverseAndHide(el.shadowRoot);
            }
          } catch (e) {}
        }
      } catch (e) {
        // ignore traversal issues
      }
    }

    const runHide = () => {
      traverseAndHide(document);
      // also attempt to find root-level elements that might not be in querySelectorAll
      try {
        for (const el of document.body.children) {
          if (el && el.shadowRoot) traverseAndHide(el.shadowRoot);
        }
      } catch (e) {}
    };

    // Run after a small delay to let widget render, and again a few times during startup
    setTimeout(runHide, 500);
    setTimeout(runHide, 1500);
    setTimeout(runHide, 3000);

    // Observe for future additions and newly-opened shadow roots
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.addedNodes && m.addedNodes.length) {
          for (const n of m.addedNodes) {
            try {
              traverseAndHide(n);
              if (n && n.shadowRoot) traverseAndHide(n.shadowRoot);
            } catch (e) {}
          }
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  } catch (e) {
    console.warn('failed to install powered-by hide fallback', e);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectElevenLabsWidget);
} else {
  injectElevenLabsWidget();
}