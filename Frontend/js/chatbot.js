/**
 * AETHERA - LIVE MULTI-TURN AI CHATBOT CONTROLLER (INSTA DM / WHATSAPP STYLE)
 * Powered by Google Gemini API (gemini-2.5-flash / gemini-2.0-flash / gemini-1.5-flash) & KaTeX LaTeX Math Engine
 * Supports dynamic API keys, image attachments (vision), in-chat 401 recovery, and built-in simulation fallback.
 */

class AetheraChatbot {
  constructor() {
    this.fallbackKey = (typeof atob === 'function') ? atob('QVEuQWI4Uk42TFpIdVBMNFF1UDdEaS0zRlBGMGJRRERpRmJuTHZhMGxPSy02dURIbExLX0E=') : '';
    this.isServerProxyActive = true;

    this.isOpen = false;
    this.isGenerating = false;
    this.history = []; // [{ role: 'user'|'model', parts: [...] }]
    this.currentImage = null; // { mimeType, base64, url, fileName, fileSize }
    this.lastUserQuery = "";
    this.systemInstruction = "You are Aethera, a warm, friendly, empathetic, and down-to-earth conversational companion—just like talking to a good friend. Talk in a relaxed, casual, everyday conversational tone. Be helpful and supportive without sounding stiff, corporate, robotic, or overly academic. CRITICAL RULE: NEVER bring up unsolicited mathematics, formulas, LaTeX equations, proofs, or technical jargon unless the user explicitly asks a math question or asks for calculations. If an image is provided, discuss it warmly and naturally like a friend would.";

    this.init();
    this.syncServerApiKey();
  }

  cleanApiKey(raw) {
    if (!raw || typeof raw !== 'string') return '';
    let k = raw.trim();
    if (k.includes('=')) {
      const parts = k.split('=');
      k = parts[parts.length - 1].trim();
    }
    k = k.replace(/^["'`]+|["'`]+$/g, '').trim();
    k = k.replace(/[,;]+$/, '').trim();
    return k;
  }

  getBackendUrl() {
    if (typeof window !== 'undefined' && window.location && window.location.origin) {
      const origin = window.location.origin;
      if (origin.startsWith('http:') || origin.startsWith('https:')) {
        if (origin.includes(':5500') || origin.includes(':5000') || origin.includes(':8080') || origin.includes(':5173')) {
          const host = window.location.hostname || 'localhost';
          return `http://${host}:3000`;
        }
        return origin;
      }
    }
    return 'http://localhost:3000';
  }

  async syncServerApiKey() {
    try {
      const backend = this.getBackendUrl();
      const res = await fetch(`${backend}/api/config/ai-key`);
      if (res.ok) {
        const data = await res.json();
        if (data && (data.serverConfigured || data.hasKey)) {
          this.isServerProxyActive = true;
          this.updateKeyBadge();
        }
      }
    } catch (e) {}
  }

  getApiKey() {
    let key = this.cleanApiKey(localStorage.getItem('aethera_gemini_api_key') || this.fallbackKey || '');
    if (!key || key.startsWith('ya29.') || key.length < 15) {
      key = this.fallbackKey;
    }
    return key;
  }

  hasValidCloudKey() {
    const key = this.getApiKey();
    return typeof key === 'string' && key.length >= 15;
  }

  getModel() {
    let m = localStorage.getItem('aethera_selected_model') || 'gemini-flash-lite-latest';
    if (!m || m.includes('2.0') || m.includes('1.5') || m.includes('2.5') || m.includes('3.5') || m.includes('3.8')) {
      m = 'gemini-flash-lite-latest';
      localStorage.setItem('aethera_selected_model', 'gemini-flash-lite-latest');
    }
    return m;
  }

  getEndpoint() {
    const model = this.getModel();
    return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  }

  init() {
    this.renderWidget();
    this.bindEvents();
    this.bindImageUpload();
  }

  isId() {
    return !!(window.aetheraI18n && window.aetheraI18n.currentLang === 'id');
  }

  renderWidget() {
    if (document.getElementById('aethera-chatbot-container')) return;

    const container = document.createElement('div');
    container.id = 'aethera-chatbot-container';
    container.innerHTML = `
      <!-- Floating Chatbot Window Dialog -->
      <div id="chatbot-window" class="chatbot-window" role="dialog" aria-modal="true" aria-hidden="true">
        <!-- Header -->
        <div class="chatbot-header">
          <div class="chatbot-header-info">
            <div class="chatbot-avatar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
            </div>
            <div>
              <div class="chatbot-title" data-i18n="chatbot.title">Aethera Assistant</div>
              <div class="chatbot-status-text" id="chatbot-status-subtext" data-i18n="chatbot.status">Active // Gemini AI &amp; Vision</div>
            </div>
          </div>
          <div class="chatbot-header-actions">
            <button id="chatbot-clear-btn" class="chatbot-action-btn" title="Clear Conversation" aria-label="Clear Conversation">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
            <button id="chatbot-maximize-btn" class="chatbot-action-btn" title="Maximize Window" aria-label="Maximize Window">
              <svg id="chatbot-max-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
            </button>
            <button id="chatbot-close-btn" class="chatbot-action-btn" title="Close Window" aria-label="Close Window">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        <!-- Messenger Style Message Stream -->
        <div id="chatbot-messages" class="chatbot-messages">
          <div class="chatbot-date-pill" data-i18n="chatbot.today">Today</div>
          
          <!-- Initial Welcome Message from Bot -->
          <div class="chatbot-msg-row bot">
            <div class="bot-mini-avatar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
            </div>
            <div class="chatbot-bubble">
              <div class="msg-text" id="chatbot-welcome-text">
                <p data-i18n="chatbot.welcome">Hey there! 👋 I'm <strong>Aethera</strong>. How's your day going? Feel free to chat about anything on your mind, bounce ideas around, share what you're working on, or drop a picture!</p>
              </div>
              <div class="msg-meta">
                <span>${this.getCurrentTime()}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Suggestion Chips Bar (Horizontally Scrollable) -->
        <div class="chatbot-suggestions-wrapper">
          <button type="button" class="chatbot-scroll-btn left" id="chatbot-scroll-left" title="Scroll left" aria-label="Scroll left">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div class="chatbot-suggestions" id="chatbot-suggestions">
            <div class="chatbot-chip" data-i18n="chatbot.chip_note" data-query-en="Make a note: Project roadmap with 4 milestones" data-query-id="Buat catatan: Rencana proyek dengan 4 tahapan" data-query="Make a note: Project roadmap with 4 milestones">📝 Make a Note</div>
            <div class="chatbot-chip" data-i18n="chatbot.chip_plan" data-query-en="Plan tomorrow: 9am deep work & 2pm meeting" data-query-id="Rencanakan besok: 09.00 fokus mendalam & 14.00 rapat" data-query="Plan tomorrow: 9am deep work & 2pm meeting">📅 Plan Tomorrow</div>
            <div class="chatbot-chip" data-i18n="chatbot.chip_study" data-query-en="Schedule a study session tomorrow at 3pm" data-query-id="Jadwalkan sesi belajar besok jam 15.00" data-query="Schedule a study session tomorrow at 3pm">📚 Schedule Study</div>
            <div class="chatbot-chip" data-i18n="chatbot.chip_chat" data-query-en="How's your day going? Let's chat!" data-query-id="Bagaimana harimu berjalan? Mari mengobrol!" data-query="How's your day going?">How's your day going?</div>
          </div>
          <button type="button" class="chatbot-scroll-btn right" id="chatbot-scroll-right" title="Scroll right" aria-label="Scroll right">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>

        <!-- Chatbot Image Attachment Preview Bar -->
        <div id="chatbot-image-preview-bar" class="chatbot-image-preview-bar" style="display: none;">
          <div class="chatbot-preview-content">
            <img id="chatbot-image-preview-thumb" class="chatbot-preview-thumb" src="" alt="Attached preview">
            <div class="chatbot-preview-details">
              <span id="chatbot-image-name" class="chatbot-preview-filename">image.png</span>
              <span id="chatbot-image-size" class="chatbot-preview-filesize">0 KB</span>
            </div>
          </div>
          <button id="chatbot-image-remove-btn" class="chatbot-preview-remove-btn" title="Remove image" aria-label="Remove image">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <!-- Input Area -->
        <div class="chatbot-input-area" id="chatbot-drop-zone">
          <button id="chatbot-attach-btn" class="chatbot-attach-btn" title="Attach Image or Screenshot (or paste with Ctrl+V)" data-i18n-title="chatbot.attach_title" type="button">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
          </button>
          <input type="file" id="chatbot-image-input" accept="image/*" style="display: none;">

          <textarea id="chatbot-input" class="chatbot-input" placeholder="Message Aethera..." data-i18n-placeholder="chatbot.placeholder" rows="1"></textarea>
          <button id="chatbot-send-btn" class="chatbot-send-btn" title="Send Message">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>

        <!-- Window Corner Resize Grip (Windows OS Style) -->
        <div class="chatbot-resize-grip" id="chatbot-resize-grip" title="Resize Window" aria-hidden="true">
          <svg viewBox="0 0 10 10" fill="currentColor">
            <circle cx="8" cy="8" r="1"/>
            <circle cx="8" cy="5" r="1"/>
            <circle cx="5" cy="8" r="1"/>
            <circle cx="8" cy="2" r="1"/>
            <circle cx="5" cy="5" r="1"/>
            <circle cx="2" cy="8" r="1"/>
          </svg>
        </div>
      </div>
    `;

    document.body.appendChild(container);
    if (window.aetheraI18n) {
      window.aetheraI18n.applyTranslations(container);
    }
  }

  bindEvents() {
    const closeBtn = document.getElementById('chatbot-close-btn');
    const clearBtn = document.getElementById('chatbot-clear-btn');
    const sendBtn = document.getElementById('chatbot-send-btn');
    const input = document.getElementById('chatbot-input');
    const chips = document.querySelectorAll('.chatbot-chip');

    if (closeBtn) closeBtn.addEventListener('click', () => this.closeWindow());
    if (clearBtn) clearBtn.addEventListener('click', () => this.clearChat());

    if (sendBtn) sendBtn.addEventListener('click', () => this.sendMessage());
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      });
      input.addEventListener('input', () => {
        input.style.height = 'auto';
        input.style.height = `${Math.min(input.scrollHeight, 90)}px`;
      });
    }

    chips.forEach(chip => {
      chip.addEventListener('click', (e) => {
        if (this.isSuggestionDragging) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        const isId = this.isId();
        const query = (isId ? chip.getAttribute('data-query-id') : chip.getAttribute('data-query-en')) || chip.getAttribute('data-query');
        if (query && input) {
          input.value = query;
          this.sendMessage();
        }
      });
    });

    window.addEventListener('aethera:language-change', () => {
      const container = document.getElementById('aethera-chatbot-container');
      if (container && window.aetheraI18n) {
        window.aetheraI18n.applyTranslations(container);
      }
    });

    this.initWindowControls();
    this.initSuggestionsScroll();
  }

  /* ==========================================================================
     HORIZONTAL SCROLL CONTROLLER FOR SUGGESTION CHIPS (WHEEL + DRAG + ARROWS)
     ========================================================================== */
  initSuggestionsScroll() {
    const suggestions = document.getElementById('chatbot-suggestions');
    const leftBtn = document.getElementById('chatbot-scroll-left');
    const rightBtn = document.getElementById('chatbot-scroll-right');
    if (!suggestions) return;

    // 1. Mouse wheel horizontal scrolling (translates vertical mouse wheel deltaY to horizontal scrollLeft)
    suggestions.addEventListener('wheel', (e) => {
      if (e.deltaY !== 0 || e.deltaX !== 0) {
        e.preventDefault();
        const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
        suggestions.scrollLeft += delta * 0.9;
        this.updateSuggestionsScrollButtons();
      }
    }, { passive: false });

    // 2. Mouse Drag-to-Scroll (Click and drag horizontally across chips)
    let isDown = false;
    let startX = 0;
    let scrollStart = 0;
    this.isSuggestionDragging = false;

    suggestions.addEventListener('mousedown', (e) => {
      // Only primary mouse button
      if (e.button !== 0) return;
      isDown = true;
      this.isSuggestionDragging = false;
      suggestions.classList.add('is-dragging');
      startX = e.pageX - suggestions.offsetLeft;
      scrollStart = suggestions.scrollLeft;
    });

    const onMouseUp = () => {
      if (isDown) {
        isDown = false;
        suggestions.classList.remove('is-dragging');
        setTimeout(() => {
          this.isSuggestionDragging = false;
        }, 60);
      }
    };

    window.addEventListener('mouseup', onMouseUp);

    suggestions.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - suggestions.offsetLeft;
      const walk = (x - startX) * 1.35;
      if (Math.abs(walk) > 4) {
        this.isSuggestionDragging = true;
      }
      suggestions.scrollLeft = scrollStart - walk;
      this.updateSuggestionsScrollButtons();
    });

    // 3. Left / Right Navigation Arrow Buttons
    if (leftBtn) {
      leftBtn.addEventListener('click', (e) => {
        e.preventDefault();
        suggestions.scrollBy({ left: -140, behavior: 'smooth' });
      });
    }

    if (rightBtn) {
      rightBtn.addEventListener('click', (e) => {
        e.preventDefault();
        suggestions.scrollBy({ left: 140, behavior: 'smooth' });
      });
    }

    suggestions.addEventListener('scroll', () => {
      this.updateSuggestionsScrollButtons();
    }, { passive: true });

    // Check visibility on window open, resize, or maximize
    window.addEventListener('resize', () => this.updateSuggestionsScrollButtons());
    setTimeout(() => this.updateSuggestionsScrollButtons(), 200);
  }

  updateSuggestionsScrollButtons() {
    const suggestions = document.getElementById('chatbot-suggestions');
    const leftBtn = document.getElementById('chatbot-scroll-left');
    const rightBtn = document.getElementById('chatbot-scroll-right');
    if (!suggestions) return;

    const maxScroll = suggestions.scrollWidth - suggestions.clientWidth;
    if (maxScroll <= 4) {
      if (leftBtn) leftBtn.classList.remove('visible');
      if (rightBtn) rightBtn.classList.remove('visible');
      return;
    }

    if (leftBtn) {
      leftBtn.classList.toggle('visible', suggestions.scrollLeft > 6);
    }
    if (rightBtn) {
      rightBtn.classList.toggle('visible', suggestions.scrollLeft < maxScroll - 6);
    }
  }

  /* ==========================================================================
     WINDOWS OS STYLE DRAGGABLE, MOVABLE & RESIZABLE WINDOW CONTROLS
     ========================================================================== */
  initWindowControls() {
    const win = document.getElementById('chatbot-window');
    const header = win?.querySelector('.chatbot-header');
    const maxBtn = document.getElementById('chatbot-maximize-btn');
    const resizeGrip = document.getElementById('chatbot-resize-grip');
    if (!win || !header) return;

    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let winStartX = 0;
    let winStartY = 0;

    let isResizing = false;
    let resizeStartX = 0;
    let resizeStartY = 0;
    let winStartW = 0;
    let winStartH = 0;

    this.isMaximized = false;
    this.savedBounds = null;

    const getZoom = () => {
      const z = parseFloat(window.getComputedStyle(document.documentElement).zoom);
      return (!isNaN(z) && z > 0) ? z : 1;
    };

    // Maximize / Restore functionality (Windows OS Style)
    this.toggleMaximize = () => {
      if (this.isMaximized) {
        // Restore Down
        this.isMaximized = false;
        win.classList.remove('is-maximized');
        if (this.savedBounds) {
          win.style.left = this.savedBounds.left;
          win.style.top = this.savedBounds.top;
          win.style.width = this.savedBounds.width;
          win.style.height = this.savedBounds.height;
        }
        if (maxBtn) {
          maxBtn.title = 'Maximize Window';
          maxBtn.setAttribute('aria-label', 'Maximize Window');
          const maxIcon = document.getElementById('chatbot-max-icon');
          if (maxIcon) {
            maxIcon.outerHTML = `<svg id="chatbot-max-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>`;
          }
        }
      } else {
        // Maximize
        this.isMaximized = true;
        const rect = win.getBoundingClientRect();
        const zoom = getZoom();
        this.savedBounds = {
          left: win.style.left || `${rect.left / zoom}px`,
          top: win.style.top || `${rect.top / zoom}px`,
          width: win.style.width || `${win.offsetWidth}px`,
          height: win.style.height || `${win.offsetHeight}px`
        };
        win.style.left = '';
        win.style.top = '';
        win.style.width = '';
        win.style.height = '';
        win.style.right = '';
        win.style.bottom = '';
        win.classList.add('is-maximized');
        if (maxBtn) {
          maxBtn.title = 'Restore Down';
          maxBtn.setAttribute('aria-label', 'Restore Down');
          const maxIcon = document.getElementById('chatbot-max-icon');
          if (maxIcon) {
            maxIcon.outerHTML = `<svg id="chatbot-max-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 4h13v13"/><rect x="4" y="7" width="13" height="13" rx="1.5"/></svg>`;
          }
        }
      }
      setTimeout(() => this.updateSuggestionsScrollButtons(), 260);
    };

    if (maxBtn) {
      maxBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMaximize();
      });
    }

    // Double-click title bar to maximize/restore (like native Windows OS)
    header.addEventListener('dblclick', (e) => {
      if (e.target.closest('button, input, textarea, a, select')) return;
      this.toggleMaximize();
    });

    // --------------------------------------------------------------------------
    // DRAG HANDLING (MOVE WINDOW FREELY LIKE WINDOWS OS)
    // --------------------------------------------------------------------------
    const onStartDrag = (e) => {
      // Don't drag when interacting with window buttons
      if (e.target.closest('button, input, textarea, a, select')) return;
      if (e.type === 'mousedown' && e.button !== 0) return;

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const zoom = getZoom();

      // If maximized, unmaximize first while keeping the window pinned under cursor
      if (this.isMaximized) {
        this.toggleMaximize();
        winStartX = (clientX / zoom) - (win.offsetWidth / 2);
        winStartY = (clientY / zoom) - 20;
      } else {
        const rect = win.getBoundingClientRect();
        winStartX = rect.left / zoom;
        winStartY = rect.top / zoom;
      }

      // Convert from bottom/right layout to explicit left/top in CSS coordinates
      win.style.left = `${winStartX}px`;
      win.style.top = `${winStartY}px`;
      win.style.right = 'auto';
      win.style.bottom = 'auto';
      win.style.margin = '0';

      isDragging = true;
      dragStartX = clientX;
      dragStartY = clientY;

      win.classList.add('is-dragging');
      document.body.classList.add('chatbot-dragging-active');

      if (e.type === 'touchstart') {
        e.preventDefault();
      }
    };

    const onMoveDrag = (e) => {
      if (!isDragging) return;

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const zoom = getZoom();

      const deltaX = (clientX - dragStartX) / zoom;
      const deltaY = (clientY - dragStartY) / zoom;

      let nextX = winStartX + deltaX;
      let nextY = winStartY + deltaY;

      // Keep window within viewport boundaries
      const docW = document.documentElement.clientWidth;
      const docH = document.documentElement.clientHeight;
      const winW = win.offsetWidth;
      const maxLeft = Math.max(0, docW - winW);
      const maxTop = Math.max(0, docH - 48); // keep title bar accessible

      nextX = Math.max(0, Math.min(nextX, maxLeft));
      nextY = Math.max(0, Math.min(nextY, maxTop));

      win.style.left = `${nextX}px`;
      win.style.top = `${nextY}px`;

      if (e.cancelable) {
        e.preventDefault();
      }
    };

    const onEndDrag = () => {
      if (isDragging) {
        isDragging = false;
        win.classList.remove('is-dragging');
        document.body.classList.remove('chatbot-dragging-active');
      }
    };

    header.addEventListener('mousedown', onStartDrag);
    header.addEventListener('touchstart', onStartDrag, { passive: false });

    window.addEventListener('mousemove', onMoveDrag, { passive: false });
    window.addEventListener('touchmove', onMoveDrag, { passive: false });

    window.addEventListener('mouseup', onEndDrag);
    window.addEventListener('touchend', onEndDrag);

    // --------------------------------------------------------------------------
    // RESIZE HANDLING (WINDOWS OS CORNER GRIP)
    // --------------------------------------------------------------------------
    if (resizeGrip) {
      const onStartResize = (e) => {
        if (this.isMaximized) return;
        if (e.type === 'mousedown' && e.button !== 0) return;

        e.preventDefault();
        e.stopPropagation();

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const zoom = getZoom();
        const rect = win.getBoundingClientRect();

        // Lock position into left/top so resizing expands smoothly
        if (!win.style.left) {
          win.style.left = `${rect.left / zoom}px`;
          win.style.top = `${rect.top / zoom}px`;
          win.style.right = 'auto';
          win.style.bottom = 'auto';
        }

        isResizing = true;
        resizeStartX = clientX;
        resizeStartY = clientY;
        winStartW = win.offsetWidth;
        winStartH = win.offsetHeight;

        win.classList.add('is-dragging');
        document.body.classList.add('chatbot-dragging-active');
      };

      const onMoveResize = (e) => {
        if (!isResizing) return;

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const zoom = getZoom();

        const dw = (clientX - resizeStartX) / zoom;
        const dh = (clientY - resizeStartY) / zoom;

        const curLeft = parseFloat(win.style.left) || 0;
        const curTop = parseFloat(win.style.top) || 0;
        const maxW = Math.max(340, document.documentElement.clientWidth - curLeft - 10);
        const maxH = Math.max(420, document.documentElement.clientHeight - curTop - 10);

        const newW = Math.max(320, Math.min(winStartW + dw, maxW));
        const newH = Math.max(400, Math.min(winStartH + dh, maxH));

        win.style.width = `${newW}px`;
        win.style.height = `${newH}px`;

        if (e.cancelable) {
          e.preventDefault();
        }
      };

      const onEndResize = () => {
        if (isResizing) {
          isResizing = false;
          win.classList.remove('is-dragging');
          document.body.classList.remove('chatbot-dragging-active');
        }
      };

      resizeGrip.addEventListener('mousedown', onStartResize);
      resizeGrip.addEventListener('touchstart', onStartResize, { passive: false });

      window.addEventListener('mousemove', onMoveResize, { passive: false });
      window.addEventListener('touchmove', onMoveResize, { passive: false });

      window.addEventListener('mouseup', onEndResize);
      window.addEventListener('touchend', onEndResize);
    }

    // Keep window inside viewport if browser window resizes
    window.addEventListener('resize', () => {
      if (this.isMaximized || !win.style.left) return;
      const curLeft = parseFloat(win.style.left);
      const curTop = parseFloat(win.style.top);
      const maxLeft = Math.max(0, document.documentElement.clientWidth - win.offsetWidth);
      const maxTop = Math.max(0, document.documentElement.clientHeight - 48);

      if (curLeft > maxLeft) win.style.left = `${maxLeft}px`;
      if (curTop > maxTop) win.style.top = `${maxTop}px`;
    });
  }

  toggleWindow() {
    if (this.isOpen) {
      this.closeWindow();
    } else {
      this.openWindow();
    }
  }

  openWindow(text = '') {
    const win = document.getElementById('chatbot-window');
    const input = document.getElementById('chatbot-input');
    if (win) {
      win.classList.add('open');
      win.setAttribute('aria-hidden', 'false');
      this.isOpen = true;
    }
    if (input) {
      if (text) {
        input.value = text;
        input.style.height = 'auto';
        input.style.height = `${Math.min(input.scrollHeight, 90)}px`;
      }
      setTimeout(() => input.focus(), 150);
    }
    this.scrollToBottom();
    setTimeout(() => this.updateSuggestionsScrollButtons(), 180);
  }

  closeWindow() {
    const win = document.getElementById('chatbot-window');
    if (win) {
      win.classList.remove('open');
      win.setAttribute('aria-hidden', 'true');
      this.isOpen = false;
    }
  }

  clearChat() {
    this.history = [];
    this.clearAttachedImage();
    const messages = document.getElementById('chatbot-messages');
    if (messages) {
      messages.innerHTML = `
        <div class="chatbot-date-pill">Today</div>
        <div class="chatbot-msg-row bot">
          <div class="bot-mini-avatar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
          </div>
          <div class="chatbot-bubble">
            <div class="msg-text">
              <p>Conversation cleared. What would you like to explore next?</p>
            </div>
            <div class="msg-meta">
              <span>${this.getCurrentTime()}</span>
            </div>
          </div>
        </div>
      `;
    }
  }

  scrollToBottom() {
    const messages = document.getElementById('chatbot-messages');
    if (messages) {
      messages.scrollTop = messages.scrollHeight;
    }
  }

  bindImageUpload() {
    const attachBtn = document.getElementById('chatbot-attach-btn');
    const imageInput = document.getElementById('chatbot-image-input');
    const removeBtn = document.getElementById('chatbot-image-remove-btn');
    const dropZone = document.getElementById('chatbot-drop-zone') || document.querySelector('.chatbot-input-area');
    const input = document.getElementById('chatbot-input');

    if (attachBtn && imageInput) {
      attachBtn.addEventListener('click', (e) => {
        e.preventDefault();
        imageInput.click();
      });
      imageInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          this.handleImageFile(e.target.files[0]);
        }
      });
    }

    if (removeBtn) {
      removeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.clearAttachedImage();
      });
    }

    // Drag & drop on chatbot
    if (dropZone) {
      ['dragenter', 'dragover'].forEach(name => {
        dropZone.addEventListener(name, (e) => {
          e.preventDefault();
        });
      });
      dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          this.handleImageFile(e.dataTransfer.files[0]);
        }
      });
    }

    // Direct clipboard paste
    if (input) {
      input.addEventListener('paste', (e) => {
        const items = (e.clipboardData || window.clipboardData)?.items;
        if (!items) return;
        for (let item of items) {
          if (item.type && item.type.startsWith('image/')) {
            const file = item.getAsFile();
            if (file) {
              this.handleImageFile(file);
              break;
            }
          }
        }
      });
    }
  }

  handleImageFile(file) {
    if (!file || !file.type.startsWith('image/')) {
      alert("Please upload an image file (PNG, JPEG, WebP, GIF).");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      alert("Image exceeds 20MB limit. Please upload a smaller file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      const base64Data = dataUrl.split(',')[1];
      const mimeType = file.type || 'image/png';

      this.currentImage = {
        mimeType: mimeType,
        base64: base64Data,
        url: dataUrl,
        fileName: file.name || 'Pasted-Screenshot.png',
        fileSize: this.formatFileSize(file.size)
      };

      this.renderImagePreview();
    };
    reader.readAsDataURL(file);
  }

  renderImagePreview() {
    const previewBar = document.getElementById('chatbot-image-preview-bar');
    const previewThumb = document.getElementById('chatbot-image-preview-thumb');
    const previewName = document.getElementById('chatbot-image-name');
    const previewSize = document.getElementById('chatbot-image-size');

    if (previewBar && this.currentImage) {
      if (previewThumb) previewThumb.src = this.currentImage.url;
      if (previewName) previewName.textContent = this.currentImage.fileName;
      if (previewSize) previewSize.textContent = this.currentImage.fileSize;
      previewBar.style.display = 'flex';
    }
  }

  clearAttachedImage() {
    this.currentImage = null;
    const previewBar = document.getElementById('chatbot-image-preview-bar');
    const imageInput = document.getElementById('chatbot-image-input');
    if (previewBar) previewBar.style.display = 'none';
    if (imageInput) imageInput.value = '';
  }

  formatFileSize(bytes) {
    if (!bytes || bytes === 0) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  getCurrentTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  appendMessage(sender, content, image = null, isRawHtml = false) {
    const messages = document.getElementById('chatbot-messages');
    if (!messages) return null;

    const row = document.createElement('div');
    row.className = `chatbot-msg-row ${sender}`;

    let avatarHtml = '';
    if (sender === 'bot') {
      avatarHtml = `
        <div class="bot-mini-avatar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
        </div>
      `;
    }

    let imageHtml = '';
    if (image && image.url) {
      imageHtml = `
        <div class="chatbot-bubble-image-wrapper">
          <img src="${image.url}" class="chatbot-msg-image" alt="${this.escapeHtml(image.fileName || 'Attached image')}">
        </div>
      `;
    }

    let bodyHtml = isRawHtml ? content : `<div class="msg-text">${this.formatMarkdown(content)}</div>`;
    let metaTicks = sender === 'user' ? `<span class="read-ticks">✓✓</span>` : '';

    row.innerHTML = `
      ${avatarHtml}
      <div class="chatbot-bubble">
        ${imageHtml}
        ${bodyHtml}
        <div class="msg-meta">
          <span>${this.getCurrentTime()}</span>
          ${metaTicks}
        </div>
      </div>
    `;

    messages.appendChild(row);
    this.scrollToBottom();
    return row;
  }

  appendTypingIndicator() {
    const messages = document.getElementById('chatbot-messages');
    if (!messages) return null;

    const row = document.createElement('div');
    row.className = 'chatbot-msg-row bot typing-row';
    row.innerHTML = `
      <div class="bot-mini-avatar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
      </div>
      <div class="chatbot-bubble typing-bubble">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
    `;

    messages.appendChild(row);
    this.scrollToBottom();
    return row;
  }

  removeTypingIndicator(row) {
    if (row && row.parentNode) {
      row.parentNode.removeChild(row);
    }
  }

  async sendMessage() {
    const input = document.getElementById('chatbot-input');
    if (!input || this.isGenerating) return;

    const text = input.value.trim();
    const image = this.currentImage;

    if (!text && !image) return;

    this.lastUserQuery = text || "Analyze this attached image.";

    // Reset input field & image preview
    input.value = '';
    input.style.height = 'auto';
    this.clearAttachedImage();

    // 1. Render User Message
    this.appendMessage('user', text || 'Sent an image attachment', image, false);

    // 2. Prepare Gemini Payload Parts
    const userParts = [];
    if (image && image.base64 && image.mimeType) {
      userParts.push({
        inlineData: {
          mimeType: image.mimeType,
          data: image.base64
        }
      });
    }
    if (text) {
      userParts.push({ text: text });
    } else if (image) {
      userParts.push({ text: "Please inspect, describe, and solve or extract everything from this attached image." });
    }

    this.history.push({
      role: 'user',
      parts: userParts
    });

    // 3. Show typing wave
    this.isGenerating = true;
    const typingIndicator = this.appendTypingIndicator();

    const hasValidKey = this.hasValidCloudKey();
    if (!hasValidKey) {
      this.simulateBotResponse(typingIndicator, text);
      return;
    }

    try {
      const apiKey = this.getApiKey();
      const backend = this.getBackendUrl();

      // Optimize history: Keep last 10 messages, strip heavy base64 images from earlier turns
      const trimmedHistory = this.history.slice(-10).map((msg, index, arr) => {
        if (index === arr.length - 1) return msg;
        return {
          role: msg.role,
          parts: (msg.parts || []).map(p => {
            if (p.inlineData) return { text: '[Attached image analyzed]' };
            return p;
          })
        };
      });

      const requestBody = {
        model: this.getModel(),
        contents: trimmedHistory,
        systemInstruction: {
          parts: [{ text: this.getDynamicSystemInstruction() }]
        },
        generationConfig: {
          maxOutputTokens: 2048,
          temperature: 0.7
        }
      };

      let botReply = '';
      let streamSucceeded = false;

      // 1. Primary: Sub-second Server-Side SSE Stream
      try {
        const streamEndpoint = `${backend}/api/ai/stream`;
        const headers = { 'Content-Type': 'application/json' };
        if (apiKey) headers['x-goog-api-key'] = apiKey;
        const streamRes = await fetch(streamEndpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify({ ...requestBody, apiKey: apiKey || undefined })
        });

        if (streamRes && streamRes.ok) {
          const reader = streamRes.body.getReader();
          const decoder = new TextDecoder('utf-8');
          let buffer = '';
          let isBubbleInitialized = false;
          let textContainer = null;
          let renderScheduled = false;

          const flushRender = () => {
            renderScheduled = false;
            if (textContainer && botReply) {
              textContainer.innerHTML = this.formatMarkdown(botReply);
              this.scrollToBottom();
            }
          };

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              const trimmed = line.trim();
              if (trimmed.startsWith('data:')) {
                const jsonStr = trimmed.slice(5).trim();
                if (jsonStr) {
                  try {
                    const chunk = JSON.parse(jsonStr);
                    if (chunk.candidates && chunk.candidates[0]?.content?.parts) {
                      const chunkText = chunk.candidates[0].content.parts.map(p => p.text || '').join('');
                      if (chunkText) {
                        botReply += chunkText;

                        // On first token arrival, morph typing indicator into streaming chat bubble
                        if (!isBubbleInitialized && typingIndicator && typingIndicator.parentNode) {
                          isBubbleInitialized = true;
                          typingIndicator.classList.remove('typing-row');
                          typingIndicator.innerHTML = `
                            <div class="bot-mini-avatar">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
                            </div>
                            <div class="chatbot-bubble">
                              <div class="msg-text"></div>
                              <div class="msg-meta">
                                <span>${this.getCurrentTime()}</span>
                              </div>
                            </div>
                          `;
                          textContainer = typingIndicator.querySelector('.msg-text');
                        }

                        if (!renderScheduled) {
                          renderScheduled = true;
                          requestAnimationFrame(flushRender);
                        }
                      }
                    }
                  } catch (_) {}
                }
              }
            }
          }

          if (botReply) {
            streamSucceeded = true;
            if (textContainer) {
              textContainer.innerHTML = this.formatMarkdown(botReply);
              this.scrollToBottom();
            }
          }
        }
      } catch (streamErr) {
        console.warn('[Chatbot Stream Fallback]', streamErr.message);
      }

      // 2. Secondary Fallback: Standard generateContent endpoint
      if (!streamSucceeded) {
        const endpoint = this.isServerProxyActive
          ? `${backend}/api/ai/generate`
          : (apiKey ? `${this.getEndpoint()}?key=${encodeURIComponent(apiKey)}` : `${backend}/api/ai/generate`);

        const genHeaders = { 'Content-Type': 'application/json' };
        if (apiKey) genHeaders['x-goog-api-key'] = apiKey;
        let response = await fetch(endpoint, {
          method: 'POST',
          headers: genHeaders,
          body: JSON.stringify({ ...requestBody, apiKey: apiKey || undefined })
        });

        if (!response.ok) {
          let directSuccess = false;
          if (apiKey) {
            const directModels = ['gemini-flash-lite-latest', 'gemini-3.1-flash-lite', 'gemini-3.5-flash-lite', 'gemini-3.6-flash'];
            for (const dm of directModels) {
              try {
                const dUrl = `https://generativelanguage.googleapis.com/v1beta/models/${dm}:generateContent?key=${encodeURIComponent(apiKey)}`;
                const dRes = await fetch(dUrl, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    contents: trimmedHistory,
                    systemInstruction: { parts: [{ text: this.getDynamicSystemInstruction() }] }
                  })
                });
                if (dRes.ok) {
                  response = dRes;
                  directSuccess = true;
                  break;
                }
              } catch (_) {}
            }
          }

          if (!directSuccess) {
            if (response.status === 401 || response.status === 400 || response.status === 403 || response.status === 429) {
              this.simulateBotResponse(typingIndicator, text, {
                notice: response.status === 429
                  ? "Gemini API daily quota limit reached (HTTP 429). Switched to Aethera local reasoning."
                  : "Google API returned 401 (Key Expired). Switched to Aethera local reasoning."
              });
              return;
            }
            this.removeTypingIndicator(typingIndicator);
            this.isGenerating = false;
            const errorData = await response.json().catch(() => ({}));
            const status = response.status;
            const errMsg = errorData.error?.message || `API error ${status}`;
            this.renderAuthErrorBubble(status, errMsg);
            return;
          }
        }

        const data = await response.json();
        botReply = data.text || data.reply || data.candidates?.[0]?.content?.parts?.[0]?.text;
      }

      this.removeTypingIndicator(typingIndicator);
      this.isGenerating = false;

      if (!botReply) {
        this.appendMessage('bot', "I couldn't generate a response. Please try rephrasing your prompt.");
        return;
      }

      // Check for structured calendar plan
      let planEvents = [];
      let noteToCreate = null;
      let cleanedReply = botReply;

      const planMatch = botReply.match(/```(?:calendar_plan|json:calendar_events|calendar_events)\s*([\s\S]*?)```/i);
      if (planMatch) {
        try {
          const parsed = JSON.parse(planMatch[1].trim());
          if (Array.isArray(parsed)) {
            planEvents = parsed;
          } else if (parsed && Array.isArray(parsed.events)) {
            planEvents = parsed.events;
          }
          cleanedReply = cleanedReply.replace(/```(?:calendar_plan|json:calendar_events|calendar_events)\s*[\s\S]*?```/gi, '').trim();
        } catch (e) {
          console.warn('[Chatbot] Failed to parse calendar_plan JSON:', e);
        }
      } else if (this.isPlanningQuery(text)) {
        const targetDate = this.parseNaturalDate(text);
        planEvents = this.extractScheduleEvents(botReply, targetDate);
      }

      // Check for structured note creation
      const noteMatch = botReply.match(/```(?:note_creation|json:note_creation|notes_create|note)\s*([\s\S]*?)```/i);
      if (noteMatch) {
        try {
          const parsed = JSON.parse(noteMatch[1].trim());
          if (parsed && (parsed.title || parsed.blocks)) {
            noteToCreate = parsed;
          }
          cleanedReply = cleanedReply.replace(/```(?:note_creation|json:note_creation|notes_create|note)\s*[\s\S]*?```/gi, '').trim();
        } catch (e) {
          console.warn('[Chatbot] Failed to parse note_creation JSON:', e);
        }
      } else if (this.isNoteCreationQuery(text)) {
        noteToCreate = this.extractNoteDataFromText(text, botReply);
      }

      this.history.push({
        role: 'model',
        parts: [{ text: cleanedReply || botReply }]
      });

      // If already streamed into typing indicator row, update its text to cleaned reply, otherwise append
      let row = null;
      if (streamSucceeded && typingIndicator && typingIndicator.parentNode) {
        row = typingIndicator;
        const msgTextEl = row.querySelector('.msg-text');
        if (msgTextEl) {
          msgTextEl.innerHTML = this.formatMarkdown(cleanedReply || botReply);
        }
      } else {
        row = this.appendMessage('bot', cleanedReply || botReply, null, false);
      }

      if (planEvents && planEvents.length > 0) {
        const savedEvents = await this.savePlannedEventsToCalendar(planEvents, this.parseNaturalDate(text));
        if (row && savedEvents.length > 0) {
          this.attachCalendarCard(row, savedEvents);
        }
      }

      if (noteToCreate) {
        const savedNote = await this.createNoteInWorkspace(noteToCreate);
        if (row && savedNote) {
          this.attachNoteCard(row, savedNote);
        }
      }

    } catch (err) {
      console.error('[Chatbot Error]:', err);
      if (err.message && (err.message.includes('401') || err.message.includes('400') || err.message.includes('403'))) {
        this.simulateBotResponse(typingIndicator, text, {
          notice: "Google API returned 401. Switched to Aethera local reasoning."
        });
        return;
      }
      this.removeTypingIndicator(typingIndicator);
      this.isGenerating = false;
      this.renderAuthErrorBubble(0, err.message || "Failed to reach Google Gemini endpoint.");
    }
  }

  renderAuthErrorBubble(status, errorMsg) {
    const messages = document.getElementById('chatbot-messages');
    if (!messages) return;

    const row = document.createElement('div');
    row.className = 'chatbot-msg-row bot';

    const isAuth = status === 401 || status === 403 || status === 400 || (errorMsg && errorMsg.toLowerCase().includes('key'));
    const safeError = this.escapeHtml(errorMsg || 'Connection error');

    row.innerHTML = `
      <div class="bot-mini-avatar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
      </div>
      <div class="chatbot-bubble">
        <div class="chatbot-auth-card">
          <div class="chatbot-auth-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            ${isAuth ? 'Authentication Error (401)' : 'Network / API Error'}
          </div>
          <p style="font-size: 0.78rem; line-height: 1.4; margin: 0.2rem 0 0.5rem; color: var(--text-secondary);">
            ${isAuth ? 'Google AI Studio rejected the request with invalid credentials.' : safeError}
          </p>
          <div class="chatbot-auth-input-row">
            <input type="text" class="chatbot-auth-input" placeholder="Paste your Gemini key (AQ.Ab8... or AIzaSy...)" autocomplete="off" spellcheck="false" data-lpignore="true" data-1p-ignore="true">
            <button class="chatbot-auth-save-btn">Save</button>
          </div>
          <div style="display: flex; gap: 0.35rem; align-items: center; justify-content: space-between; margin-top: 0.25rem;">
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" style="font-size: 0.68rem; color: var(--accent-primary); text-decoration: underline;">
              Get Free Key &rarr;
            </a>
            <button class="chatbot-auth-fallback-btn">⚡ Run Simulation</button>
          </div>
        </div>
        <div class="msg-meta">
          <span>${this.getCurrentTime()}</span>
        </div>
      </div>
    `;

    messages.appendChild(row);
    this.scrollToBottom();

    // Bind card interactive events
    const inputField = row.querySelector('.chatbot-auth-input');
    const saveBtn = row.querySelector('.chatbot-auth-save-btn');
    const simBtn = row.querySelector('.chatbot-auth-fallback-btn');

    if (saveBtn && inputField) {
      saveBtn.addEventListener('click', () => {
        const raw = inputField.value;
        const val = this.cleanApiKey(raw);
        if (!val || val.length < 15) {
          alert('Please enter a valid Google Gemini API key.');
          return;
        }
        localStorage.setItem('aethera_gemini_api_key', val);
        try {
          const backend = this.getBackendUrl();
          fetch(`${backend}/api/config/ai-key`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: val })
          }).catch(() => {});
        } catch (e) {}
        saveBtn.textContent = 'Saved! ✓';
        setTimeout(() => {
          row.remove();
          this.sendMessage();
        }, 600);
      });
    }

    if (simBtn) {
      simBtn.addEventListener('click', () => {
        row.remove();
        this.simulateBotResponse(this.lastUserQuery);
      });
    }
  }

  simulateBotResponse(existingIndicator = null, query = null, options = {}) {
    const typingIndicator = existingIndicator || this.appendTypingIndicator();
    this.isGenerating = true;
    const qText = query || this.lastUserQuery || '';

    setTimeout(() => {
      this.removeTypingIndicator(typingIndicator);
      this.isGenerating = false;

      // Check if user is asking to make a plan / schedule on a specific date or hours
      if (this.isPlanningQuery(qText)) {
        const planResult = this.generateSimulatedPlan(qText);
        let reply = planResult.reply;
        if (options.notice) {
          reply = `> *${options.notice}*\n\n` + reply;
        }

        this.history.push({
          role: 'model',
          parts: [{ text: reply }]
        });

        const row = this.appendMessage('bot', reply, null, false);

        if (planResult.events && planResult.events.length > 0) {
          this.savePlannedEventsToCalendar(planResult.events).then(saved => {
            if (row && saved.length > 0) {
              this.attachCalendarCard(row, saved);
            }
          });
        }
        return;
      }

      // Check if user is asking to create a note in Aethera Notes
      if (this.isNoteCreationQuery(qText)) {
        const noteResult = this.generateSimulatedNote(qText);
        let reply = noteResult.reply;
        if (options.notice) {
          reply = `> *${options.notice}*\n\n` + reply;
        }

        this.history.push({
          role: 'model',
          parts: [{ text: reply }]
        });

        const row = this.appendMessage('bot', reply, null, false);

        if (noteResult.note) {
          this.createNoteInWorkspace(noteResult.note).then(savedNote => {
            if (row && savedNote) {
              this.attachNoteCard(row, savedNote);
            }
          });
        }
        return;
      }

      let reply = "";
      const q = (qText || "").toLowerCase();

      if (q.includes('integral') || q.includes('gaussian') || q.includes('math') || q.includes('calculus')) {
        reply = `### Gaussian Integral Evaluation\n\nThe famous Gaussian integral is defined as:\n\n$$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$\n\nFor the one-sided integral over $[0, \\infty)$:\n\n$$\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$$\n\n**Proof via Polar Coordinate Transformation:**\nLet $I = \\int_{-\\infty}^{\\infty} e^{-x^2} dx$. Then:\n\n$$I^2 = \\left(\\int_{-\\infty}^\\infty e^{-x^2} dx\\right)\\left(\\int_{-\\infty}^\\infty e^{-y^2} dy\\right) = \\int_{-\\infty}^\\infty \\int_{-\\infty}^\\infty e^{-(x^2+y^2)} dx dy$$\n\nSwitching to polar coordinates ($x = r\\cos\\theta, y = r\\sin\\theta, dx dy = r dr d\\theta$):\n\n$$I^2 = \\int_0^{2\\pi} d\\theta \\int_0^\\infty r e^{-r^2} dr = 2\\pi \\left[ -\\frac{1}{2} e^{-r^2} \\right]_0^\\infty = \\pi$$\n\nTaking square roots confirms $I = \\sqrt{\\pi}$.`;
      } else if (q.includes('binary search') || q.includes('python') || q.includes('algorithm')) {
        reply = `Here is an optimal **Binary Search** implementation in Python with $O(\\log n)$ time complexity:\n\n\`\`\`python\ndef binary_search(arr, target):\n    \"\"\"\n    Perform binary search on a sorted list.\n    Returns index of target if found, else -1.\n    \"\"\"\n    left, right = 0, len(arr) - 1\n    \n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n            \n    return -1\n\n# Verification\nnums = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]\nprint(binary_search(nums, 23))  # Output: 5\n\`\`\`\n\n- **Time Complexity:** $O(\\log n)$\n- **Space Complexity:** $O(1)$`;
      } else if (q.includes('quantum') || q.includes('qubit')) {
        reply = `### Quantum Computing in Simple Terms\n\n1. **Bits vs. Qubits:** A classical computer bit is either 0 or 1 (like a light switch). A quantum qubit can exist as both 0 and 1 simultaneously thanks to **Superposition**:\n\n$$|\\psi\\rangle = \\alpha |0\\rangle + \\beta |1\\rangle$$\n\n2. **Entanglement:** Two or more qubits can be linked so that the state of one instantly determines the state of another, no matter the distance.\n\n3. **Practical Superpowers:** Quantum computers excel at factoring massive prime numbers, simulating complex molecular reactions for medicine discovery, and global combinatorial optimization.`;
      } else if (q.includes('email') || q.includes('interview')) {
        reply = `### Post-Interview Follow-Up Email\n\n**Subject:** Thank You — [Role Title] Interview Follow-up\n\nDear [Interviewer Name],\n\nThank you for taking the time to speak with me today about the [Role Title] position. I thoroughly enjoyed learning more about [Company Name]'s vision for [specific project/team discussed].\n\nOur conversation reinforced my enthusiasm for the opportunity, especially given my experience in [1-2 key skills]. Please let me know if you need any additional information or portfolio samples.\n\nWarm regards,\n\n**[Your Name]**\n[Your Phone] | [Your LinkedIn]`;
      } else {
        reply = `Hey! 😊 So about **${this.escapeHtml(qText || 'that')}**: I'm totally with you!\n\nWe can definitely talk through this together or brainstorm some fun ways to tackle it. What's the main thing on your mind right now?`;
      }

      if (options.notice) {
        reply = `> *${options.notice}*\n\n` + reply;
      }

      this.appendMessage('bot', reply, null, false);
      this.history.push({
        role: 'model',
        parts: [{ text: reply }]
      });
    }, 450);
  }

  renderLatex(latex, isDisplay = false) {
    if (typeof katex !== 'undefined') {
      try {
        return katex.renderToString(latex.trim(), {
          displayMode: isDisplay,
          throwOnError: false,
          output: 'htmlAndMathml'
        });
      } catch (e) {
        console.warn('KaTeX render error:', e);
      }
    }
    return `<span class="math-fallback ${isDisplay ? 'math-display' : 'math-inline'}">${this.escapeHtml(latex)}</span>`;
  }

  formatMarkdown(text) {
    if (!text) return '';

    const placeholders = {};
    let placeholderIndex = 0;

    // 1. Preserve Code Blocks
    let processed = text.replace(/```([a-zA-Z0-9_\-+#]*)\n([\s\S]*?)```/g, (match, lang, code) => {
      const key = `%%CODE_BLOCK_${placeholderIndex++}%%`;
      placeholders[key] = `<pre><code class="language-${lang || 'code'}">${this.escapeHtml(code.trim())}</code></pre>`;
      return key;
    });

    // 2. Preserve Inline Code
    processed = processed.replace(/`([^`\n]+)`/g, (match, code) => {
      const key = `%%INLINE_CODE_${placeholderIndex++}%%`;
      placeholders[key] = `<code>${this.escapeHtml(code)}</code>`;
      return key;
    });

    // 3. Process Display Math: $$ ... $$
    processed = processed.replace(/\$\$([\s\S]*?)\$\$/g, (match, tex) => {
      const key = `%%MATH_DISPLAY_${placeholderIndex++}%%`;
      placeholders[key] = `<div class="katex-display-math">${this.renderLatex(tex, true)}</div>`;
      return key;
    });

    // 4. Process Inline Math: $ ... $
    processed = processed.replace(/\$([^\$\n]+?)\$/g, (match, tex) => {
      const key = `%%MATH_INLINE_${placeholderIndex++}%%`;
      placeholders[key] = `<span class="katex-inline-math">${this.renderLatex(tex, false)}</span>`;
      return key;
    });

    // 5. General Markdown Elements
    processed = this.escapeHtml(processed);

    // Bold & Italic
    processed = processed.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    processed = processed.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // Headings
    processed = processed.replace(/^### (.*$)/gim, '<h4 style="font-size: 0.95rem; margin: 0.5rem 0 0.25rem;">$1</h4>');
    processed = processed.replace(/^## (.*$)/gim, '<h3 style="font-size: 1rem; margin: 0.75rem 0 0.35rem;">$1</h3>');

    // Bullet points
    processed = processed.replace(/^\s*[-*]\s+(.*$)/gim, '<li style="margin-left: 1rem; margin-bottom: 0.2rem;">$1</li>');

    // Line breaks
    processed = processed.replace(/\n\n/g, '<br><br>');
    processed = processed.replace(/\n/g, '<br>');

    // 6. Restore all placeholders (Math, Code blocks, Inline code)
    for (const [key, value] of Object.entries(placeholders)) {
      processed = processed.split(key).join(value);
    }

    return processed;
  }

  escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* --------------------------------------------------------------------------
     AETHERA CALENDAR & AI PLANNER INTEGRATION
     -------------------------------------------------------------------------- */
  getDynamicSystemInstruction() {
    const isId = this.isId();
    const now = new Date();
    const dateStr = now.toLocaleDateString(isId ? 'id-ID' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const isoDate = this.formatDateISO(now);
    const timeStr = now.toLocaleTimeString(isId ? 'id-ID' : 'en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    const langDirective = isId ? `\n\nBAHASA DIRECTIVE: The user interface is currently in Bahasa Indonesia. You MUST converse with the user naturally, warmly, and fluently in Bahasa Indonesia. However, keep calendar_plan and note_creation JSON keys standard in English.` : '';

    return `${this.systemInstruction}

CURRENT REAL-WORLD DATE & TIME CONTEXT:
- Today is ${dateStr} (ISO Date: ${isoDate}).
- Current local time: ${timeStr}.${langDirective}

INTEGRATED AETHERA CALENDAR & SCHEDULER:
You are directly connected to the user's interactive Aethera Calendar.
When the user asks you to make a plan, schedule an event or task, organize their day, or add items to their calendar for a specific date or hours (e.g. "plan a meeting tomorrow at 3pm", "make a plan for tomorrow: 9am deep work, 2pm gym", "schedule study session on Friday from 10 to 12", "put workout on my calendar today at 6pm"):
1. Respond warmly and conversationally confirming that you've planned and added it to their calendar.
2. At the very end of your response, output a structured JSON block tagged with \`\`\`calendar_plan:
\`\`\`calendar_plan
[
  {
    "title": "Clear descriptive title",
    "date": "YYYY-MM-DD",
    "startTime": "HH:MM",
    "endTime": "HH:MM",
    "category": "deep-work" | "meeting" | "study" | "deadline" | "personal" | "work",
    "priority": "Q1" | "Q2" | "Q3" | "Q4",
    "quadrant": "Urgent & Important" | "Important, Not Urgent" | "Urgent, Not Important" | "Not Urgent, Not Important",
    "notes": "Short helpful note or description"
  }
]
\`\`\`
Rules for calendar_plan:
- Always resolve relative dates ("tomorrow", "Monday", "next week", "today") to exact YYYY-MM-DD based on today (${isoDate}).
- Times must be in 24-hour format HH:MM (e.g. "09:00", "14:30"). If only a start time is given, set endTime 1 hour later.
- Categories: "deep-work" (focus/coding/design), "meeting" (calls/syncs), "study" (learning/homework/exams), "deadline" (deliverables/urgent), "personal" (meals/gym/wellness/rest), "work" (general professional tasks).
- ONLY output the \`\`\`calendar_plan block if the user specifically asked to plan, schedule, or put events on their calendar.

INTEGRATED AETHERA NOTES WORKSPACE:
You are directly connected to the user's interactive Aethera Notes workspace.
When the user asks, commands, or instructs you to create, make, take, draft, or write a note (e.g. "make a note about X", "create a note called Grocery List with milk, eggs, bread", "take a note: call doctor tomorrow", "draft meeting notes for project sync", "buat catatan tentang ...", "catat ini ..."):
1. Formulate a rich, well-organized note structure with a clear descriptive title, an appropriate emoji icon, and high-quality structured content blocks.
2. At the very end of your response, output a structured JSON block tagged with \`\`\`note_creation:
\`\`\`note_creation
{
  "title": "Clear Note Title",
  "icon": "📄" (or relevant emoji: 💡, 📋, 🛒, 💻, 📐, 🎯, 🚀, 📖, 💰, 🛡️, etc.),
  "folder": "Private",
  "blocks": [
    { "type": "callout", "text": "High-level summary or focus", "icon": "💡" },
    { "type": "h2", "text": "Key Points" },
    { "type": "bullet", "text": "First strategic point" },
    { "type": "bullet", "text": "Second strategic point" },
    { "type": "h2", "text": "Action Items" },
    { "type": "todo", "text": "Specific task to complete", "checked": false }
  ]
}
\`\`\`
Supported block types: "p" (paragraph), "h1", "h2", "h3" (headings), "bullet" (bullet list), "number" (numbered list), "todo" (checklist with checked boolean), "callout" (callout box with emoji icon), "code" (code snippet), "divider" (horizontal line).
3. Confirm in your conversational reply that you've created the note and placed it directly into their Aethera Notes workspace.
- ONLY output the \`\`\`note_creation block if the user specifically asked to create or take a note.`;
  }

  isPlanningQuery(text) {
    if (!text || typeof text !== 'string') return false;
    const lower = text.toLowerCase();

    const planKeywords = [
      'plan', 'schedule', 'calendar', 'put on my calendar', 'put it on my calendar',
      'add to calendar', 'add to my calendar', 'set up a meeting', 'book a',
      'set a reminder', 'agenda', 'itinerary', 'time block', 'routine',
      'jadwal', 'jadwalkan', 'rencana', 'rencanakan'
    ];

    const hasPlanKeyword = planKeywords.some(kw => lower.includes(kw));

    const timeOrDateIndicators = [
      'today', 'tonight', 'tomorrow', 'tmrw', 'yesterday',
      'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
      'am', 'pm', 'hour', 'hours', 'morning', 'afternoon', 'evening', 'night',
      'at ', 'from ', 'o\'clock', 'oclock', 'next week', 'this weekend',
      'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december',
      'jan', 'feb', 'mar', 'apr', 'jun', 'jul', 'aug', 'sep', 'sept', 'oct', 'nov', 'dec',
      'besok', 'hari ini', 'lusa', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu', 'jam', 'pukul'
    ];

    const hasTimeOrDate = timeOrDateIndicators.some(kw => lower.includes(kw)) ||
      /\d{1,2}:\d{2}/.test(lower) ||
      /\d{4}-\d{2}-\d{2}/.test(lower);

    return hasPlanKeyword && hasTimeOrDate;
  }

  parseNaturalDate(text, refDate = new Date()) {
    const lower = (text || '').toLowerCase();
    const d = new Date(refDate);

    if (lower.includes('today') || lower.includes('tonight') || lower.includes('hari ini')) {
      return this.formatDateISO(d);
    }
    if (lower.includes('day after tomorrow') || lower.includes('lusa')) {
      d.setDate(d.getDate() + 2);
      return this.formatDateISO(d);
    }
    if (lower.includes('tomorrow') || lower.includes('tmrw') || lower.includes('besok')) {
      d.setDate(d.getDate() + 1);
      return this.formatDateISO(d);
    }

    // Specific ISO date YYYY-MM-DD
    const isoMatch = text.match(/\b(\d{4})-(\d{2})-(\d{2})\b/);
    if (isoMatch) {
      return isoMatch[0];
    }

    // Month + Day, e.g. "Sep 15", "September 15th", "15 September"
    const months = {
      jan: 0, january: 0, feb: 1, february: 1, mar: 2, march: 2, apr: 3, april: 3,
      may: 4, jun: 5, june: 5, jul: 6, july: 6, aug: 7, august: 7, sep: 8, sept: 8, september: 8,
      oct: 9, october: 9, nov: 10, november: 10, dec: 11, december: 11
    };
    const monthDayMatch = text.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\s+(\d{1,2})(?:st|nd|rd|th)?\b/i) ||
                          text.match(/\b(\d{1,2})(?:st|nd|rd|th)?\s+(?:of\s+)?(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\b/i);
    if (monthDayMatch) {
      let mStr, dayNum;
      if (isNaN(monthDayMatch[1])) {
        mStr = monthDayMatch[1].toLowerCase();
        dayNum = parseInt(monthDayMatch[2], 10);
      } else {
        dayNum = parseInt(monthDayMatch[1], 10);
        mStr = monthDayMatch[2].toLowerCase();
      }
      const monthKey = Object.keys(months).find(k => mStr.startsWith(k));
      if (monthKey !== undefined && dayNum >= 1 && dayNum <= 31) {
        const targetMonth = months[monthKey];
        let year = d.getFullYear();
        const candidate = new Date(year, targetMonth, dayNum, 12);
        if (candidate < d && (d - candidate) > 30 * 86400000) {
          candidate.setFullYear(year + 1);
        }
        return this.formatDateISO(candidate);
      }
    }

    // Days of week
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const idnDays = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];
    for (let i = 0; i < 7; i++) {
      const en = daysOfWeek[i];
      const id = idnDays[i];
      if (new RegExp(`\\b(this\\s+|next\\s+)?(${en}|${id})\\b`, 'i').test(lower)) {
        const currentDay = d.getDay();
        let diff = i - currentDay;
        if (diff <= 0) diff += 7;
        if ((lower.includes(`next ${en}`) || lower.includes(`next ${id}`)) && diff < 7) {
          diff += 7;
        }
        d.setDate(d.getDate() + diff);
        return this.formatDateISO(d);
      }
    }

    // Default: if past 8pm local time, schedule for tomorrow
    if (refDate.getHours() >= 20) {
      d.setDate(d.getDate() + 1);
      return this.formatDateISO(d);
    }
    return this.formatDateISO(d);
  }

  parseTimes(text) {
    const rangeMatch = text.match(/(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)\s*(?:-|–|—|to)\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i);
    if (rangeMatch) {
      const start = this.normalizeTime(rangeMatch[1]);
      const end = this.normalizeTime(rangeMatch[2]);
      return { startTime: start, endTime: end };
    }
    const singleMatch = text.match(/(?:at|for|around|pukul|jam)\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i) ||
                        text.match(/\b(\d{1,2}(?::\d{2})?\s*(?:am|pm))\b/i);
    if (singleMatch) {
      const start = this.normalizeTime(singleMatch[1]);
      const [hh, mm] = start.split(':').map(Number);
      const end = `${String((hh + 1) % 24).padStart(2, '0')}:${String(mm || 0).padStart(2, '0')}`;
      return { startTime: start, endTime: end };
    }
    return { startTime: '09:00', endTime: '10:30' };
  }

  normalizeTime(str) {
    if (!str) return '09:00';
    const m = str.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i);
    if (!m) return '09:00';
    let h = parseInt(m[1], 10);
    const mins = m[2] || '00';
    const ampm = m[3] ? m[3].toLowerCase() : null;
    if (ampm === 'pm' && h < 12) h += 12;
    if (ampm === 'am' && h === 12) h = 0;
    return `${String(h).padStart(2, '0')}:${mins}`;
  }

  inferCategory(text) {
    const lower = (text || '').toLowerCase();
    if (/deep\s*work|code|program|architect|dev|build|focus|engineer|write\s*code|debug|koding/i.test(lower)) return 'deep-work';
    if (/meet|sync|standup|call|review|interview|discuss|client|zoom|rapat/i.test(lower)) return 'meeting';
    if (/study|exam|homework|read|learn|prep|class|lecture|math|revision|belajar|kuliah|tugas/i.test(lower)) return 'study';
    if (/deadline|due|submit|critical|urgent|deliver|launch|release/i.test(lower)) return 'deadline';
    if (/gym|workout|lunch|dinner|break|rest|walk|meditat|coffee|personal|sleep|istirahat|makan|olahraga/i.test(lower)) return 'personal';
    return 'work';
  }

  inferPriority(category) {
    switch (category) {
      case 'deadline': return { priority: 'Q1', quadrant: 'Urgent & Important' };
      case 'deep-work': return { priority: 'Q2', quadrant: 'Important, Not Urgent' };
      case 'study': return { priority: 'Q2', quadrant: 'Important, Not Urgent' };
      case 'meeting': return { priority: 'Q3', quadrant: 'Urgent, Not Important' };
      case 'personal': return { priority: 'Q4', quadrant: 'Not Urgent, Not Important' };
      default: return { priority: 'Q2', quadrant: 'Important, Not Urgent' };
    }
  }

  formatDateISO(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  extractScheduleSubject(query) {
    if (!query) return '';
    let s = query.trim();

    // 1. Remove common conversational greetings and lead-ins
    s = s.replace(/^(hey|hi|hello|halo|tolong|please|can you(?: please)?|could you(?: please)?|would you(?: please)?|i want you to|i need you to|i want to|i need to|help me)\b\s*/gi, '');

    // 2. Remove schedule/plan creation commands in English and Indonesian
    s = s.replace(/\b(make|create|set\s+up|set|build|put|add|organize|generate|draft)\s+(?:me\s+)?(?:a\s+|an\s+|the\s+)?(?:schedule|calendar|plan|agenda|timeline|time\s*table|to-?do)\b/gi, '');
    s = s.replace(/\b(schedule|plan)\s+(?:me\s+)?(?:a\s+|an\s+|the\s+)?/gi, '');
    s = s.replace(/\b(?:tolong\s+)?(?:buatkan|buat|bikin|jadwalkan|rencanakan|masukkan\s+ke)\s*(?:saya\s+)?(?:jadwal|agenda|rencana|kalender)?\b/gi, '');

    // 3. Remove calendar destinations
    s = s.replace(/\b(to|on|in|into)\s+(?:my\s+|the\s+)?calendar\b/gi, '');
    s = s.replace(/\b(ke|di|pada)\s+(?:kalender|jadwal)\s*(?:saya)?\b/gi, '');

    // 4. Remove relative date words & common typos
    s = s.replace(/\b(today|tonight|tomorrow|tommorow|tomorow|tmrw|tmr|yesterday|the\s+day\s+after\s+tomorrow|next\s+week|this\s+week|this\s+weekend)\b/gi, '');
    s = s.replace(/\b(hari\s+ini|malam\s+ini|besok|lusa|minggu\s+depan|akhir\s+pekan\s+ini)\b/gi, '');

    // 5. Remove days of the week with qualifiers
    s = s.replace(/\b(?:on|this|next)?\s*(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/gi, '');
    s = s.replace(/\b(?:hari)?\s*(?:senin|selasa|rabu|kamis|jumat|sabtu|minggu)\b/gi, '');

    // 6. Remove month + day patterns
    s = s.replace(/\b(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+\d{1,2}(?:st|nd|rd|th)?\b/gi, '');
    s = s.replace(/\b\d{1,2}(?:st|nd|rd|th)?\s+(?:of\s+)?(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\b/gi, '');

    // 7. Remove time ranges and single times
    s = s.replace(/(?:from\s+)?\d{1,2}(?::\d{2})?\s*(?:am|pm)?\s*(?:-|–|—|to|until|sampai)\s*\d{1,2}(?::\d{2})?\s*(?:am|pm)?/gi, '');
    s = s.replace(/(?:at|around|pada|jam|pukul)\s+\d{1,2}(?::\d{2})?\s*(?:am|pm)?/gi, '');
    s = s.replace(/\b\d{1,2}(?::\d{2})?\s*(?:am|pm)\b/gi, '');

    // 8. Remove connecting prepositions, colons, or punctuation at start or end
    s = s.replace(/^[\s,;:–—\-_/|*•#]+/g, '');
    s = s.replace(/[\s,;:–—\-_/|*•#?!.]+$/g, '');
    s = s.replace(/^(?:for|about|regarding|to|on|at|of|with|untuk|tentang|soal|buat)\s+/i, '');
    s = s.replace(/^(?:meeting|session|call|event|review)\s+(?:for|about|with|on)\s+/i, '');
    s = s.replace(/^[:\-\s]+|[:\-\s]+$/g, '').trim();

    if (!s) return '';
    return s.split(/\s+/)
      .filter(w => w.length > 0)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  cleanEventTitle(raw) {
    if (!raw) return 'Scheduled Activity';
    const extracted = this.extractScheduleSubject(raw);
    if (extracted && extracted.length >= 2 && !/^(plan|schedule|calendar|activity|session)$/i.test(extracted)) {
      return extracted;
    }
    let s = raw.trim()
      .replace(/^[\s,;:–—\-_/|*•#]+|[\s,;:–—\-_/|*•#?!.]+$/g, '')
      .replace(/^(?:to|for|about|on|at|untuk)\s+/i, '')
      .trim();
    if (!s) return 'Scheduled Activity';
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  generateSimulatedPlan(query) {
    const isId = this.isId();
    const targetDate = this.parseNaturalDate(query);
    const dateObj = new Date(targetDate + 'T12:00:00');
    const formattedDate = dateObj.toLocaleDateString(isId ? 'id-ID' : 'en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    // 1. Check for multiple events separated by comma, '&', 'and', or newlines
    const tokens = query.split(/(?:,\s*|\s+and\s+|\s*&\s*|\n+)(?=\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i);
    let events = [];

    if (tokens.length >= 2) {
      for (const tok of tokens) {
        const m = tok.match(/(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)\s*(?:-|–|—|to)?\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)?\s*([^,;]+)/i);
        if (m) {
          const rawTime1 = m[1];
          const rawTime2 = m[2];
          const rawActivity = m[3];
          const title = this.cleanEventTitle(rawActivity);

          if (title.length >= 2 && !/^(tomorrow|today|tonight|next week|plan|schedule)$/i.test(title)) {
            const startTime = this.normalizeTime(rawTime1);
            let endTime = rawTime2 ? this.normalizeTime(rawTime2) : null;
            if (!endTime) {
              const [sh, sm] = startTime.split(':').map(Number);
              endTime = `${String((sh + 1) % 24).padStart(2, '0')}:${String(sm || 0).padStart(2, '0')}`;
            }
            const category = this.inferCategory(title);
            const prio = this.inferPriority(category);
            events.push({
              id: 'evt_' + Math.random().toString(36).substr(2, 9),
              title,
              date: targetDate,
              startTime,
              endTime,
              category,
              priority: prio.priority,
              quadrant: prio.quadrant,
              notes: isId ? 'Direncanakan lewat Asisten Aethera' : 'Planned via Aethera Assistant',
              completed: false,
              createdAt: new Date().toISOString()
            });
          }
        }
      }
    }

    if (events.length === 0) {
      const times = this.parseTimes(query);
      const subject = this.extractScheduleSubject(query);

      // If user specified an explicit activity/goal (e.g. "Math Exam", "Physics", "Chemistry Lab")
      if (subject && subject.length >= 2 && !/^(plan|schedule|calendar)$/i.test(subject)) {
        const title = this.cleanEventTitle(subject);
        const category = this.inferCategory(title);
        const prio = this.inferPriority(category);
        events.push({
          id: 'evt_' + Math.random().toString(36).substr(2, 9),
          title,
          date: targetDate,
          startTime: times.startTime,
          endTime: times.endTime,
          category,
          priority: prio.priority,
          quadrant: prio.quadrant,
          notes: isId ? 'Direncanakan lewat Asisten Aethera' : 'Planned via Aethera Assistant',
          completed: false,
          createdAt: new Date().toISOString()
        });
      }
    }

    if (events.length === 0) {
      const template = isId ? [
        { title: 'Fokus Pagi & Persiapan Hari', start: '08:30', end: '09:30', cat: 'personal', prio: 'Q4', quad: 'Tidak Mendesak, Tidak Penting' },
        { title: 'Sesi Fokus Mendalam // Target Inti', start: '09:30', end: '12:00', cat: 'deep-work', prio: 'Q2', quad: 'Penting, Tidak Mendesak' },
        { title: 'Istirahat Siang & Pemulihan Energi', start: '12:00', end: '13:00', cat: 'personal', prio: 'Q4', quad: 'Tidak Mendesak, Tidak Penting' },
        { title: 'Sinkronisasi Tim & Koordinasi', start: '13:00', end: '14:30', cat: 'meeting', prio: 'Q3', quad: 'Mendesak, Tidak Penting' },
        { title: 'Eksekusi & Implementasi Tugas', start: '14:30', end: '16:30', cat: 'work', prio: 'Q2', quad: 'Penting, Tidak Mendesak' },
        { title: 'Evaluasi Harian & Pembelajaran', start: '16:30', end: '17:30', cat: 'study', prio: 'Q2', quad: 'Penting, Tidak Mendesak' }
      ] : [
        { title: 'Morning Focus & Day Setup', start: '08:30', end: '09:30', cat: 'personal', prio: 'Q4', quad: 'Not Urgent, Not Important' },
        { title: 'Deep Work Session // Core Objectives', start: '09:30', end: '12:00', cat: 'deep-work', prio: 'Q2', quad: 'Important, Not Urgent' },
        { title: 'Lunch Break & Mind Recharge', start: '12:00', end: '13:00', cat: 'personal', prio: 'Q4', quad: 'Not Urgent, Not Important' },
        { title: 'Team Sync & Project Coordination', start: '13:00', end: '14:30', cat: 'meeting', prio: 'Q3', quad: 'Urgent, Not Important' },
        { title: 'Implementation & Deliverables Execution', start: '14:30', end: '16:30', cat: 'work', prio: 'Q2', quad: 'Important, Not Urgent' },
        { title: 'Daily Review & Learning Wrap-up', start: '16:30', end: '17:30', cat: 'study', prio: 'Q2', quad: 'Important, Not Urgent' }
      ];

      events = template.map(t => ({
        id: 'evt_' + Math.random().toString(36).substr(2, 9),
        title: t.title,
        date: targetDate,
        startTime: t.start,
        endTime: t.end,
        category: t.cat,
        priority: t.prio,
        quadrant: t.quad,
        notes: isId ? 'Direncanakan lewat Asisten Aethera' : 'Planned via Aethera Assistant',
        completed: false,
        createdAt: new Date().toISOString()
      }));
    }

    let reply = "";
    if (events.length === 1) {
      const ev = events[0];
      if (isId) {
        reply = `Tentu saja! 😊 Saya sudah merencanakan **${ev.title}** dan menambahkannya langsung ke kalender Anda untuk tanggal **${formattedDate}** pukul **${ev.startTime} sampai ${ev.endTime}**.\n\nKlik **Buka di Kalender** di bawah untuk melihatnya langsung!`;
      } else {
        reply = `I've got you covered! 😊 I planned your **${ev.title}** and put it directly on your calendar for **${formattedDate}** from **${ev.startTime} to ${ev.endTime}**.\n\nYou can click **Open in Calendar** below to check it out or jump straight to your schedule!`;
      }
    } else {
      if (isId) {
        reply = `Saya sudah merencanakan jadwal hari Anda untuk tanggal **${formattedDate}** dan menambahkan **${events.length} sesi kegiatan** langsung ke kalender Anda:\n\n` +
          events.map(e => `* **${e.startTime} – ${e.endTime}**: ${e.title} *(${e.category.replace('-', ' ')})*`).join('\n') +
          `\n\nSemua tugas telah dikelompokkan dengan prioritas Matriks Eisenhower. Beri tahu saya jika ada yang ingin disesuaikan!`;
      } else {
        reply = `I've planned out your day for **${formattedDate}** and put **${events.length} schedule blocks** directly on your calendar:\n\n` +
          events.map(e => `* **${e.startTime} – ${e.endTime}**: ${e.title} *(${e.category.replace('-', ' ')})*`).join('\n') +
          `\n\nAll tasks have been organized with Eisenhower Matrix priorities. Let me know if you want to make any adjustments!`;
      }
    }

    return { reply, events };
  }

  extractScheduleEvents(text, defaultDate = null) {
    if (window.aetheraDB && typeof window.aetheraDB.parseAIScheduleText === 'function') {
      const parsed = window.aetheraDB.parseAIScheduleText(text, defaultDate);
      if (parsed && parsed.length > 0) return parsed;
    }
    return [];
  }

  async savePlannedEventsToCalendar(events, fallbackDate = null) {
    if (!events || !events.length) return [];

    const validated = events.map(e => {
      const cat = e.category || this.inferCategory(e.title || '');
      const prio = this.inferPriority(cat);
      const [sh, sm] = (e.startTime || '09:00').split(':').map(Number);
      const defaultEnd = `${String((sh + 1) % 24).padStart(2, '0')}:${String(sm || 0).padStart(2, '0')}`;

      const title = this.cleanEventTitle(e.title || '');
      return {
        id: e.id || ('evt_' + Math.random().toString(36).substr(2, 9)),
        title: title || 'Scheduled Activity',
        date: e.date || fallbackDate || this.formatDateISO(new Date()),
        startTime: e.startTime || '09:00',
        endTime: e.endTime || defaultEnd,
        category: cat,
        priority: e.priority || prio.priority,
        quadrant: e.quadrant || prio.quadrant,
        notes: e.notes || (this.isId() ? 'Direncanakan lewat Asisten Aethera' : 'Planned via Aethera Assistant'),
        completed: false,
        createdAt: new Date().toISOString()
      };
    });

    if (window.aetheraDB) {
      await window.aetheraDB.ready();
      await window.aetheraDB.saveCalendarEventsBatch(validated);
    }
    return validated;
  }

  attachCalendarCard(row, events) {
    if (!row || !events || !events.length) return;
    const bubble = row.querySelector('.chatbot-bubble');
    const meta = row.querySelector('.msg-meta');
    if (!bubble) return;

    const card = this.createCalendarCardElement(events);
    if (meta) {
      bubble.insertBefore(card, meta);
    } else {
      bubble.appendChild(card);
    }
    this.scrollToBottom();
  }

  createCalendarCardElement(events) {
    const isId = this.isId();
    const card = document.createElement('div');
    card.className = 'chatbot-calendar-card';

    const firstEvent = events[0];
    const eventDate = firstEvent.date;
    const dateObj = new Date(eventDate + 'T12:00:00');
    const friendlyDate = dateObj.toLocaleDateString(isId ? 'id-ID' : 'en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    const isPlural = events.length > 1;

    let itemsHtml = events.map(evt => {
      const catClass = evt.category || 'work';
      const catLabel = catClass.replace('-', ' ');
      return `
        <div class="chatbot-cal-event-item" data-id="${evt.id}">
          <div class="chatbot-cal-item-left">
            <span class="chatbot-cal-item-time">${evt.startTime} – ${evt.endTime}</span>
            <span class="chatbot-cal-item-title" title="${this.escapeHtml(evt.title)}">${this.escapeHtml(evt.title)}</span>
          </div>
          <div class="chatbot-cal-item-right">
            <span class="chatbot-cal-chip ${catClass}">${catLabel}</span>
            <span class="chatbot-cal-quad">${evt.priority || 'Q2'}</span>
          </div>
        </div>
      `;
    }).join('');

    const statusTitle = isPlural
      ? (isId ? `${events.length} Kegiatan Ditambahkan ke Kalender` : `${events.length} Events Added to Calendar`)
      : (isId ? 'Ditambahkan ke Kalender' : 'Added to Calendar');

    card.innerHTML = `
      <div class="chatbot-cal-card-header">
        <div class="chatbot-cal-status">
          <span>${statusTitle}</span>
        </div>
        <span class="chatbot-cal-date-badge">📅 ${friendlyDate}</span>
      </div>

      <div class="chatbot-cal-events-list">
        ${itemsHtml}
      </div>

      <div class="chatbot-cal-card-footer">
        <button type="button" class="chatbot-cal-btn-view" data-date="${eventDate}">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <span>${isId ? 'Buka di Kalender' : 'Open in Calendar'}</span>
        </button>
        <button type="button" class="chatbot-cal-btn-undo" title="${isId ? 'Hapus dari kalender' : 'Remove from calendar'}">
          <span>${isId ? 'Urungkan' : 'Undo'}</span>
        </button>
      </div>
    `;

    const viewBtn = card.querySelector('.chatbot-cal-btn-view');
    if (viewBtn) {
      viewBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.aetheraCalendar) {
          window.aetheraCalendar.selectedDate = eventDate;
          window.aetheraCalendar.currentDate = new Date(eventDate + 'T12:00:00');
          window.aetheraCalendar.render();
          viewBtn.innerHTML = `<span>${isId ? '✓ Ditampilkan di Kalender' : '✓ Showing on Calendar'}</span>`;
          setTimeout(() => {
            viewBtn.innerHTML = `
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span>${isId ? 'Buka di Kalender' : 'Open in Calendar'}</span>
            `;
          }, 2000);
        } else {
          window.location.href = `calendar.html?date=${encodeURIComponent(eventDate)}&view=month`;
        }
      });
    }

    const undoBtn = card.querySelector('.chatbot-cal-btn-undo');
    if (undoBtn) {
      undoBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        undoBtn.disabled = true;
        undoBtn.textContent = isId ? 'Menghapus...' : 'Removing...';

        if (window.aetheraDB) {
          for (const evt of events) {
            await window.aetheraDB.deleteCalendarEvent(evt.id);
          }
        }

        card.classList.add('is-undone');
        const footer = card.querySelector('.chatbot-cal-card-footer');
        if (footer) {
          footer.innerHTML = `<div class="chatbot-cal-undone-notice">${isId ? `✓ ${events.length > 1 ? 'Kegiatan' : 'Kegiatan'} telah dihapus dari kalender` : `✓ Removed ${events.length > 1 ? 'events' : 'event'} from calendar`}</div>`;
        }
      });
    }

    return card;
  }

  /* --------------------------------------------------------------------------
     AETHERA NOTES WORKSPACE INTEGRATION
     -------------------------------------------------------------------------- */
  isNoteCreationQuery(text) {
    if (!text || typeof text !== 'string') return false;
    const lower = text.toLowerCase().trim();

    const noteCommands = [
      /\b(make|create|take|write|draft|start|add|generate|jot\s*down)\s+(me\s+)?(a\s+)?(new\s+)?note\b/i,
      /\b(make|create|take|write|draft|add|generate)\s+notes?\b/i,
      /\b(note\s*this|note\s*down|take\s*a\s*note|save\s*(this\s*)?(as\s*)?(a\s*)?note)\b/i,
      /\bnew\s+note\s*[:\-]/i,
      /\b(buat|bikin|tulis|buatkan|catat)\s*(kan\s*)?(sebuah\s*)?(catatan|note|notes)\b/i,
      /\bcatat\s+(ini|tentang)\b/i
    ];

    return noteCommands.some(rgx => rgx.test(lower));
  }

  generateSimulatedNote(query, botReply = '') {
    // 1. Extract Title
    let title = '';
    const quoteMatch = query.match(/["']([^"']+)["']/);
    const titleMatch = quoteMatch ||
      query.match(/(?:called|titled|named)\s+([^\n,.;]+?)(?:\s+(?:with|containing|including)\s+|[,.;\n]|$)/i) ||
      query.match(/(?:about|for|on)\s+([^\n,.;]+?)(?:\s+(?:with|containing|including)\s+|[,.;\n]|$)/i) ||
      query.match(/note\s*[:\-]\s*([^,.;\n]+)/i);

    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1].trim();
      title = title.replace(/^(the|a|an|my|our)\s+/i, '');
    } else {
      title = query
        .replace(/^(can you\s+)?(please\s+)?(make|create|take|write|draft|add|generate|buat|bikin|tulis|catat)\s+(me\s+)?(a\s+)?(new\s+)?(note|notes|catatan)\s*(about|for|on|titled|called|:|-)?/gi, '')
        .replace(/\s+(with|containing|including)\s+.*/i, '')
        .replace(/^[\s,;:\-–—]+|[\s,;:\-–—?!.]+$/g, '')
        .trim();
    }

    if (!title || title.length < 2) {
      title = 'Quick Note';
    } else {
      title = title.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }

    // 2. Infer Icon
    let icon = '📄';
    const lowerTitle = (title + ' ' + query).toLowerCase();
    if (/\b(meet|meeting|meetings|sync|standup|\bcall\b|agenda|rapat)\b/i.test(lowerTitle)) icon = '📋';
    else if (/\b(grocer|grocery|shop|shopping|buy|market|supermarket|belanja)\b/i.test(lowerTitle)) icon = '🛒';
    else if (/\b(code|coding|dev|program|software|api|bug|koding)\b/i.test(lowerTitle)) icon = '💻';
    else if (/\b(study|studying|math|physics|exam|biology|chemistry|belajar|kuliah)\b/i.test(lowerTitle)) icon = '📐';
    else if (/\b(project|roadmap|plan|goal|strategy|target)\b/i.test(lowerTitle)) icon = '🎯';
    else if (/\b(idea|brainstorm|creative|concept|inovasi)\b/i.test(lowerTitle)) icon = '💡';
    else if (/\b(gym|workout|fitness|diet|health|olahraga)\b/i.test(lowerTitle)) icon = '💪';
    else if (/\b(music|song|album|audio|lagu)\b/i.test(lowerTitle)) icon = '🎵';
    else if (/\b(travel|trip|flight|hotel|vacation|liburan)\b/i.test(lowerTitle)) icon = '✈️';
    else if (/\b(money|budget|finance|expense|crypto|keuangan)\b/i.test(lowerTitle)) icon = '💰';
    else if (/\b(sec|security|cyber|hack|audit|auth|keamanan)\b/i.test(lowerTitle)) icon = '🛡️';

    // 3. Build Blocks
    let blocks = [];
    const commaParts = query.split(/[,;\n]+/).map(p => p.trim()).filter(p => p.length > 1);

    if (commaParts.length >= 3) {
      blocks.push({
        id: 'b1',
        type: 'callout',
        text: `Items for ${title}`,
        icon: icon
      });
      blocks.push({ id: 'b2', type: 'h2', text: 'Action Items' });
      commaParts.forEach((part, i) => {
        let itemText = part
          .replace(/^(make|create|take|write)\s+(me\s+)?(a\s+)?note\s*(about|called|with|:)?/gi, '')
          .replace(/^(and\s+|also\s+)/i, '')
          .trim();
        if (itemText.length > 1) {
          blocks.push({
            id: 'b_' + (i + 3),
            type: 'todo',
            text: itemText.charAt(0).toUpperCase() + itemText.slice(1),
            checked: false
          });
        }
      });
    } else {
      blocks = [
        {
          id: 'b1',
          type: 'callout',
          text: `Structured briefing and action notes on ${title}.`,
          icon: icon
        },
        { id: 'b2', type: 'h2', text: 'Overview' },
        { id: 'b3', type: 'p', text: `Key context and strategic considerations regarding ${title}.` },
        { id: 'b4', type: 'h2', text: 'Key Deliverables' },
        { id: 'b5', type: 'bullet', text: 'Establish core baseline requirements' },
        { id: 'b6', type: 'bullet', text: 'Validate cross-device execution flow' },
        { id: 'b7', type: 'bullet', text: 'Ensure milestone alignment across stakeholders' },
        { id: 'b8', type: 'h2', text: 'Next Steps' },
        { id: 'b9', type: 'todo', text: `Review ${title} implementation details`, checked: false },
        { id: 'b10', type: 'todo', text: 'Share updates with collaborators', checked: false }
      ];
    }

    const note = {
      title,
      icon,
      folder: 'Private',
      blocks
    };

    const isId = this.isId();
    const reply = isId
      ? `Saya telah membuat catatan baru untuk Anda berjudul **${title}** dengan ${blocks.length} blok terstruktur! 📝\n\nCatatan tersimpan di ruang kerja Catatan Aethera Anda. Klik **Buka Catatan** di bawah untuk melihat atau mengeditnya kapan saja!`
      : `I've created a new note for you titled **${title}** with ${blocks.length} structured blocks! 📝\n\nIt's saved and open on your Aethera Notes workspace, synced to your account across all your devices. Click **Open Note** below to view or edit it anytime!`;

    return { reply, note };
  }

  extractNoteDataFromText(userPrompt, botReply) {
    if (!botReply) return null;

    let title = '';
    const headingMatch = botReply.match(/^#+\s+(.+)$/m);
    if (headingMatch) {
      title = headingMatch[1].replace(/[*_#]/g, '').trim();
    } else {
      const sim = this.generateSimulatedNote(userPrompt, botReply);
      title = sim.note.title;
    }

    const sim = this.generateSimulatedNote(userPrompt, botReply);
    const icon = sim.note.icon || '📄';

    const lines = botReply.split('\n');
    const blocks = [];

    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      let type = 'p';
      let text = trimmed;
      let checked = false;

      if (/^###\s+/.test(trimmed)) {
        type = 'h3';
        text = trimmed.replace(/^###\s+/, '');
      } else if (/^##\s+/.test(trimmed)) {
        type = 'h2';
        text = trimmed.replace(/^##\s+/, '');
      } else if (/^#\s+/.test(trimmed)) {
        type = 'h1';
        text = trimmed.replace(/^#\s+/, '');
      } else if (/^-\s*\[x\]\s+/i.test(trimmed) || /^\*\s*\[x\]\s+/i.test(trimmed)) {
        type = 'todo';
        checked = true;
        text = trimmed.replace(/^[-*]\s*\[x\]\s+/i, '');
      } else if (/^-\s*\[\s*\]\s+/i.test(trimmed) || /^\*\s*\[\s*\]\s+/i.test(trimmed)) {
        type = 'todo';
        checked = false;
        text = trimmed.replace(/^[-*]\s*\[\s*\]\s+/i, '');
      } else if (/^[-*]\s+/.test(trimmed)) {
        type = 'bullet';
        text = trimmed.replace(/^[-*]\s+/, '');
      } else if (/^\d+\.\s+/.test(trimmed)) {
        type = 'number';
        text = trimmed.replace(/^\d+\.\s+/, '');
      } else if (/^>\s+/.test(trimmed)) {
        type = 'callout';
        text = trimmed.replace(/^>\s+/, '');
      }

      text = text.replace(/^\*\*(.*?)\*\*$/, '$1').trim();

      if (text.length > 0) {
        blocks.push({
          id: 'b_' + Date.now() + '_' + idx,
          type,
          text,
          checked,
          icon: type === 'callout' ? icon : null
        });
      }
    });

    if (blocks.length === 0) {
      blocks.push({ id: 'b1', type: 'p', text: botReply.trim() });
    }

    return {
      title,
      icon,
      folder: 'Private',
      blocks
    };
  }

  async createNoteInWorkspace(noteData) {
    if (!noteData) return null;

    const noteId = 'note_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    const title = (noteData.title || 'Untitled Note').trim();
    const icon = noteData.icon || '📄';
    const folder = noteData.folder || 'Private';

    let rawBlocks = noteData.blocks || [];
    if (!Array.isArray(rawBlocks) || rawBlocks.length === 0) {
      rawBlocks = [{ type: 'p', text: noteData.content || '' }];
    }

    const validatedBlocks = rawBlocks.map((b, idx) => {
      let bType = b.type || 'p';
      if (!['p', 'h1', 'h2', 'h3', 'bullet', 'number', 'todo', 'callout', 'code', 'divider', 'quote'].includes(bType)) {
        bType = 'p';
      }
      return {
        id: b.id || ('b_' + Date.now() + '_' + idx),
        type: bType,
        text: (b.text || '').trim(),
        checked: !!b.checked,
        icon: b.icon || (bType === 'callout' ? '💡' : null)
      };
    });

    const fullNote = {
      id: noteId,
      title: title,
      icon: icon,
      cover: noteData.cover || null,
      folder: folder,
      favorite: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      blocks: validatedBlocks
    };

    if (window.aetheraNotesApp) {
      window.aetheraNotesApp.createNewNoteFromAI(fullNote);
    } else if (window.aetheraDB) {
      await window.aetheraDB.ready();
      window.aetheraDB.saveNote(fullNote);
      localStorage.setItem('aethera_last_opened_note', fullNote.id);
    } else {
      try {
        const stored = JSON.parse(localStorage.getItem('aethera_user_notes') || '[]');
        stored.unshift(fullNote);
        localStorage.setItem('aethera_user_notes', JSON.stringify(stored));
        localStorage.setItem('aethera_last_opened_note', fullNote.id);
      } catch (e) {}
    }

    return fullNote;
  }

  attachNoteCard(row, note) {
    if (!row || !note) return;
    const bubble = row.querySelector('.chatbot-bubble');
    const meta = row.querySelector('.msg-meta');
    if (!bubble) return;

    const card = this.createNoteCardElement(note);
    if (meta) {
      bubble.insertBefore(card, meta);
    } else {
      bubble.appendChild(card);
    }
    this.scrollToBottom();
  }

  createNoteCardElement(note) {
    const isId = this.isId();
    const card = document.createElement('div');
    card.className = 'chatbot-note-card';

    const snippetBlocks = (note.blocks || []).slice(0, 3);
    const snippetHtml = snippetBlocks.map(b => {
      let prefix = '• ';
      if (b.type === 'todo') prefix = b.checked ? '☑ ' : '☐ ';
      else if (b.type === 'h1' || b.type === 'h2' || b.type === 'h3') prefix = '# ';
      else if (b.type === 'callout') prefix = `${b.icon || '💡'} `;
      return `<div class="chatbot-note-preview-item">${prefix}${this.escapeHtml(b.text || '')}</div>`;
    }).join('');

    const statusTitle = isId ? 'Dibuat di Catatan Aethera' : 'Created in Aethera Notes';
    const folderText = note.folder === 'Private' || !note.folder ? (isId ? 'Pribadi' : 'Private') : note.folder;
    const metaText = isId
      ? `${note.blocks ? note.blocks.length : 0} blok • ${folderText} • Tersinkronisasi ke Cloud`
      : `${note.blocks ? note.blocks.length : 0} blocks • ${folderText} • Synced to Cloud`;

    card.innerHTML = `
      <div class="chatbot-note-card-header">
        <div class="chatbot-note-status">
          <span>${statusTitle}</span>
        </div>
        <span class="chatbot-note-icon-badge">${note.icon || '📄'}</span>
      </div>

      <div class="chatbot-note-body">
        <div class="chatbot-note-title">
          <span>${note.icon || '📄'}</span>
          <span>${this.escapeHtml(note.title || (isId ? 'Halaman Baru' : 'Untitled'))}</span>
        </div>
        <div class="chatbot-note-meta">${metaText}</div>
        ${snippetHtml ? `<div class="chatbot-note-preview-list">${snippetHtml}</div>` : ''}
      </div>

      <div class="chatbot-note-card-footer">
        <button type="button" class="chatbot-note-btn-open">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          <span>${isId ? 'Buka Catatan' : 'Open Note'}</span>
        </button>
        <button type="button" class="chatbot-note-btn-undo" title="${isId ? 'Hapus catatan' : 'Delete note'}">
          <span>${isId ? 'Urungkan' : 'Undo'}</span>
        </button>
      </div>
    `;

    const openBtn = card.querySelector('.chatbot-note-btn-open');
    if (openBtn) {
      openBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.aetheraNotesApp) {
          window.aetheraNotesApp.openNote(note.id);
          openBtn.innerHTML = `<span>${isId ? '✓ Catatan Dibuka' : '✓ Opened Note'}</span>`;
          setTimeout(() => {
            openBtn.innerHTML = `
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              <span>${isId ? 'Buka Catatan' : 'Open Note'}</span>
            `;
          }, 2000);
        } else {
          window.location.href = `notes.html?id=${encodeURIComponent(note.id)}`;
        }
      });
    }

    const undoBtn = card.querySelector('.chatbot-note-btn-undo');
    if (undoBtn) {
      undoBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        undoBtn.disabled = true;
        undoBtn.textContent = isId ? 'Menghapus...' : 'Removing...';

        if (window.aetheraNotesApp) {
          window.aetheraNotesApp.deleteNote(note.id, false);
        } else if (window.aetheraDB) {
          await window.aetheraDB.deleteNote(note.id);
        }

        card.classList.add('is-undone');
        const footer = card.querySelector('.chatbot-note-card-footer');
        if (footer) {
          footer.innerHTML = `<div class="chatbot-cal-undone-notice">${isId ? '✓ Catatan dihapus dari ruang kerja' : '✓ Removed note from workspace'}</div>`;
        }
      });
    }

    return card;
  }
}

// Global Chatbot initialization with immediate-ready fallback
function initAetheraChatbot() {
  if (!window.aetheraChatbot) {
    window.aetheraChatbot = new AetheraChatbot();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAetheraChatbot);
} else {
  initAetheraChatbot();
}

window.openChatbot = function(text = '') {
  if (!window.aetheraChatbot) initAetheraChatbot();
  if (window.aetheraChatbot) window.aetheraChatbot.openWindow(text);
};
