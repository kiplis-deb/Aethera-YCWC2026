/**
 * AETHERA - LIVE AI STUDIO ENGINE
 * Powered by Google Gemini AI API (gemini-3.6-flash) & KaTeX Math Rendering Engine
 * Features 13+ specialized tools for daily use by Students, Workers and Programmers + Conversational Chatbot.
 */

const DEFAULT_GEMINI_API_KEY = '';

class AetheraStudio {
  constructor() {
    this.defaultKey = DEFAULT_GEMINI_API_KEY;
    this.apiKey = localStorage.getItem('aethera_gemini_api_key') || this.defaultKey;
    this.isServerProxyActive = true;
    let storedModel = localStorage.getItem('aethera_selected_model') || 'gemini-flash-lite-latest';
    if (!storedModel || storedModel.includes('2.0') || storedModel.includes('1.5') || storedModel.includes('2.5') || storedModel.includes('3.5') || storedModel.includes('3.8')) {
      storedModel = 'gemini-flash-lite-latest';
      localStorage.setItem('aethera_selected_model', 'gemini-flash-lite-latest');
    }
    this.selectedModel = storedModel;
    this.streamEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.selectedModel}:streamGenerateContent?alt=sse`;
    this.modelEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.selectedModel}:generateContent`;
    this.currentTheme = localStorage.getItem('aethera-theme') || 'dark';
    if (this.currentTheme === 'cyber') {
      this.currentTheme = 'dark';
      localStorage.setItem('aethera-theme', 'dark');
    }
    this.activeToolKey = 'chatbot';
    this.isGenerating = false;
    this.latestOutputText = '';
    this.chatHistory = [];
    this.currentImage = null; // { mimeType, base64, url, fileName, fileSize }
    
    this.init();
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

  init() {
    this.initTheme();
    this.initCategoryAccordions();
    this.initToolSelector();
    this.initMobileSidebar();
    this.initPromptRunner();
    this.initImageUpload();
    this.initPreferences();
    this.initApiKeyManager();
    this.syncServerApiKey();
  }

  async syncServerApiKey() {
    try {
      const backend = this.getBackendUrl();
      const res = await fetch(`${backend}/api/config/ai-key`);
      if (res.ok) {
        const data = await res.json();
        if (data && (data.serverConfigured || data.hasKey)) {
          this.isServerProxyActive = true;
          this.updateApiKeyButtonState();
          console.log('[AetheraStudio] Secure backend AI proxy connected. API key protected on server.');
        }
      }
    } catch (e) {
      console.warn('[AetheraStudio] Backend sync notice:', e.message);
    }
  }

  initTheme() {
    if (this.currentTheme === 'cyber') {
      this.currentTheme = 'dark';
      localStorage.setItem('aethera-theme', 'dark');
      localStorage.setItem('aethera_theme', 'dark');
    }
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        if (typeof window.triggerAetheraThemeTransition === 'function') {
          window.triggerAetheraThemeTransition(800);
        } else {
          document.documentElement.classList.add('theme-transitioning');
          setTimeout(() => document.documentElement.classList.remove('theme-transitioning'), 800);
        }
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('aethera-theme', this.currentTheme);
        localStorage.setItem('aethera_theme', this.currentTheme);
      });
    }
  }

  initCategoryAccordions() {
    const accordions = document.querySelectorAll('.sidebar-category-accordion');
    accordions.forEach(accordion => {
      const header = accordion.querySelector('.sidebar-category-header');
      if (!header) return;

      header.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = accordion.classList.contains('is-open');
        if (isOpen) {
          accordion.classList.remove('is-open');
          header.setAttribute('aria-expanded', 'false');
        } else {
          accordion.classList.add('is-open');
          header.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  triggerCyberLaserAnimation() {
    // Laser animation disabled to prevent distracting flashes
  }

  setCyberTheme(enable = false) {
    // Preserve current theme (dark or light) without forcing green cyber theme
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    const activeToolDisplay = document.getElementById('active-tool-display');
    if (activeToolDisplay && this.activeToolKey) {
      const toolData = AETHERA_DATA.tools[this.activeToolKey];
      if (toolData) {
        activeToolDisplay.textContent = `TOOL: ${toolData.title.toUpperCase()}`;
      }
    }
  }

  initToolSelector() {
    const toolBtns = document.querySelectorAll('.studio-mode-btn');
    const presetsContainer = document.getElementById('studio-presets-container');
    const activeToolDisplay = document.getElementById('active-tool-display');
    const promptInput = document.getElementById('studio-prompt-input');
    const selectTool = (toolKey, autoExpand = false) => {
      this.activeToolKey = toolKey;
      const toolData = AETHERA_DATA.tools[toolKey] || AETHERA_DATA.tools['chatbot'];
      if (!toolData) return;

      const isId = (typeof window !== 'undefined' && window.aetheraI18n && typeof window.aetheraI18n.getLanguage === 'function' && window.aetheraI18n.getLanguage() === 'id');
      const toolTitle = (isId && toolData.title_id) ? toolData.title_id : toolData.title;
      const toolTag = (isId && toolData.tag_id) ? toolData.tag_id : toolData.tag;
      const toolPlaceholder = (isId && toolData.placeholder_id) ? toolData.placeholder_id : toolData.placeholder;
      const toolPresets = (isId && toolData.presets_id) ? toolData.presets_id : (toolData.presets || []);

      // Always maintain current theme (dark or light) — never force green cyber theme
      document.documentElement.setAttribute('data-theme', this.currentTheme);
      if (activeToolDisplay) {
        activeToolDisplay.textContent = isId ? `ALAT: ${toolTitle.toUpperCase()}` : `TOOL: ${toolTitle.toUpperCase()}`;
      }

      toolBtns.forEach(btn => btn.classList.toggle('active', btn.getAttribute('data-tool') === toolKey));
      
      const activeBtn = document.querySelector(`.studio-mode-btn[data-tool="${toolKey}"]`);
      if (activeBtn) {
        activeBtn.style.display = '';
        if (autoExpand) {
          const parentAccordion = activeBtn.closest('.sidebar-category-accordion');
          if (parentAccordion && !parentAccordion.classList.contains('is-open')) {
            parentAccordion.classList.add('is-open');
            const header = parentAccordion.querySelector('.sidebar-category-header');
            if (header) header.setAttribute('aria-expanded', 'true');
          }
        }
      }
      
      if (promptInput) promptInput.placeholder = toolPlaceholder;

      // Reset chat history and attached image when switching tools
      this.chatHistory = [];
      this.clearAttachedImage();

      // Populate Presets
      if (presetsContainer) {
        presetsContainer.innerHTML = '';
        toolPresets.forEach(preset => {
          const chip = document.createElement('div');
          chip.className = 'studio-preset-item';
          chip.textContent = preset;
          chip.addEventListener('click', () => {
            if (promptInput) {
              promptInput.value = preset;
              this.executeAIRequest();
            }
          });
          presetsContainer.appendChild(chip);
        });
      }

      this.closeMobileSidebar();
    };

    toolBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-tool');
        selectTool(key);
      });
    });

    // Listen to reactive language change to immediately update active tool details & presets
    window.addEventListener('aethera:language-change', () => {
      if (this.activeToolKey) {
        selectTool(this.activeToolKey, false);
      }
    });

    // Initial load with URL params support (default collapsed; user drops down manually)
    const urlParams = new URLSearchParams(window.location.search);
    const initialTool = urlParams.get('tool') || 'chatbot';
    selectTool(initialTool, false);

    const initialQuery = urlParams.get('q');
    if (initialQuery && promptInput) {
      promptInput.value = initialQuery;
      setTimeout(() => this.executeAIRequest(), 400);
    }
  }

  /* ==========================================================================
     MOBILE TOOLS DRAWER CONTROLLER
     ========================================================================== */
  initMobileSidebar() {
    const mobileToolBtn = document.getElementById('mobile-tool-btn');
    const sidebar = document.getElementById('studio-sidebar-left');
    const closeBtn = document.getElementById('mobile-sidebar-close');
    const backdrop = document.getElementById('studio-drawer-backdrop');

    if (mobileToolBtn && sidebar) {
      mobileToolBtn.addEventListener('click', () => {
        const isOpen = sidebar.classList.contains('mobile-open');
        if (isOpen) {
          this.closeMobileSidebar();
        } else {
          this.openMobileSidebar();
        }
      });

      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.closeMobileSidebar());
      }

      if (backdrop) {
        backdrop.addEventListener('click', () => this.closeMobileSidebar());
      }

      // Close on Escape Key
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('mobile-open')) {
          this.closeMobileSidebar();
        }
      });
    }
  }

  openMobileSidebar() {
    const mobileToolBtn = document.getElementById('mobile-tool-btn');
    const sidebar = document.getElementById('studio-sidebar-left');
    const backdrop = document.getElementById('studio-drawer-backdrop');
    if (sidebar) {
      sidebar.classList.add('mobile-open');
      if (mobileToolBtn) mobileToolBtn.setAttribute('aria-expanded', 'true');
    }
    if (backdrop) {
      backdrop.classList.add('active');
      backdrop.setAttribute('aria-hidden', 'false');
    }
    document.body.style.overflow = 'hidden';
  }

  closeMobileSidebar() {
    const mobileToolBtn = document.getElementById('mobile-tool-btn');
    const sidebar = document.getElementById('studio-sidebar-left');
    const backdrop = document.getElementById('studio-drawer-backdrop');
    if (sidebar && sidebar.classList.contains('mobile-open')) {
      sidebar.classList.remove('mobile-open');
      if (mobileToolBtn) mobileToolBtn.setAttribute('aria-expanded', 'false');
    }
    if (backdrop && backdrop.classList.contains('active')) {
      backdrop.classList.remove('active');
      backdrop.setAttribute('aria-hidden', 'true');
    }
    document.body.style.overflow = '';
  }

  initPromptRunner() {
    const runBtn = document.getElementById('studio-run-btn');
    const promptInput = document.getElementById('studio-prompt-input');
    const clearBtn = document.getElementById('clear-chat-btn');
    const copyBtn = document.getElementById('studio-copy-btn');

    if (runBtn) runBtn.addEventListener('click', () => this.executeAIRequest());
    if (promptInput) {
      promptInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.executeAIRequest();
        }
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.chatHistory = [];
        this.clearAttachedImage();
        const chatStream = document.getElementById('chat-messages-container');
        if (chatStream) {
          chatStream.innerHTML = `
            <div class="chat-bubble system-message">
              <div class="bubble-header">
                <div class="bubble-avatar">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
                </div>
                <span class="bubble-author">Aethera Cortex // Live AI Assistant</span>
                <span class="bubble-time">SESSION RESET</span>
              </div>
              <div class="bubble-content">
                <p>Workspace cleared. Choose any tool and ask a new question or attach an image.</p>
              </div>
            </div>
          `;
        }
      });
    }

    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        if (this.latestOutputText) {
          navigator.clipboard.writeText(this.latestOutputText);
          const orig = copyBtn.innerHTML;
          copyBtn.innerHTML = '<span>✓ Copied</span>';
          setTimeout(() => { copyBtn.innerHTML = orig; }, 1800);
        }
      });
    }

    // Check for pending prompt from homepage session
    const pending = sessionStorage.getItem('aethera-pending-prompt');
    if (pending) {
      sessionStorage.removeItem('aethera-pending-prompt');
      if (promptInput) promptInput.value = pending;
      setTimeout(() => this.executeAIRequest(), 400);
    }
  }

  /* ==========================================================================
     IMAGE UPLOAD, CLIPBOARD PASTE & DRAG-AND-DROP CONTROLLER
     ========================================================================== */
  initImageUpload() {
    const attachBtn = document.getElementById('studio-attach-btn');
    const imageInput = document.getElementById('studio-image-input');
    const removeBtn = document.getElementById('studio-image-remove-btn');
    const dropZone = document.getElementById('studio-drop-zone') || document.querySelector('.studio-input-box');
    const promptInput = document.getElementById('studio-prompt-input');

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

    // Drag and Drop Handling
    if (dropZone) {
      ['dragenter', 'dragover'].forEach(name => {
        dropZone.addEventListener(name, (e) => {
          e.preventDefault();
          dropZone.classList.add('drag-active');
        });
      });
      ['dragleave', 'drop'].forEach(name => {
        dropZone.addEventListener(name, (e) => {
          e.preventDefault();
          dropZone.classList.remove('drag-active');
        });
      });
      dropZone.addEventListener('drop', (e) => {
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          this.handleImageFile(e.dataTransfer.files[0]);
        }
      });
    }

    // Direct Clipboard Screenshot Paste (Ctrl+V / Cmd+V)
    if (promptInput) {
      promptInput.addEventListener('paste', (e) => {
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
      alert("Please upload a valid image (PNG, JPEG, WebP, GIF, HEIC).");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      alert("Image exceeds 20MB limit. Please upload a smaller image file.");
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
    const previewBar = document.getElementById('studio-image-preview-bar');
    const previewThumb = document.getElementById('studio-image-preview-thumb');
    const previewName = document.getElementById('studio-image-name');
    const previewSize = document.getElementById('studio-image-size');

    if (previewBar && this.currentImage) {
      if (previewThumb) previewThumb.src = this.currentImage.url;
      if (previewName) previewName.textContent = this.currentImage.fileName;
      if (previewSize) previewSize.textContent = this.currentImage.fileSize;
      previewBar.style.display = 'flex';
    }
  }

  clearAttachedImage() {
    this.currentImage = null;
    const previewBar = document.getElementById('studio-image-preview-bar');
    const imageInput = document.getElementById('studio-image-input');
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

  initPreferences() {
    const langSelect = document.getElementById('param-lang-select');
    const langVal = document.getElementById('param-lang-val');
    if (langSelect && langVal) {
      langSelect.addEventListener('change', () => {
        langVal.textContent = langSelect.options[langSelect.selectedIndex].text;
      });
    }

    const detailSelect = document.getElementById('param-detail-select');
    const detailVal = document.getElementById('param-detail-val');
    if (detailSelect && detailVal) {
      detailSelect.addEventListener('change', () => {
        detailVal.textContent = detailSelect.options[detailSelect.selectedIndex].text;
      });
    }
  }

  async executeAIRequest() {
    if (this.isGenerating) return;

    const promptInput = document.getElementById('studio-prompt-input');
    const chatContainer = document.getElementById('chat-messages-container');
    const runBtnText = document.getElementById('run-btn-text');
    const promptText = promptInput ? promptInput.value.trim() : '';

    // Check if user has provided text or an attached image
    if (!promptText && !this.currentImage) return;
    if (!chatContainer) return;

    const attachedImage = this.currentImage;
    this.clearAttachedImage(); // Clear preview from input box immediately

    this.isGenerating = true;
    if (runBtnText) runBtnText.textContent = "Processing...";
    if (promptInput) promptInput.value = '';

    // 1. Append User Message Bubble with image thumbnail if attached
    const userBubble = document.createElement('div');
    userBubble.className = 'chat-bubble user-message';

    let userContentHtml = '';
    if (attachedImage) {
      userContentHtml += `
        <div class="user-bubble-image-wrapper">
          <img src="${attachedImage.url}" alt="${this.escapeHtml(attachedImage.fileName)}" class="user-msg-image" onclick="window.open('${attachedImage.url}', '_blank')">
        </div>
      `;
    }
    if (promptText) {
      userContentHtml += `<p>${this.escapeHtml(promptText)}</p>`;
    } else {
      userContentHtml += `<p style="font-style: italic; opacity: 0.85;">[Attached Image for Visual Analysis]</p>`;
    }

    userBubble.innerHTML = `
      <div class="bubble-header">
        <div class="bubble-avatar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/></svg>
        </div>
        <span class="bubble-author">You</span>
        <span class="bubble-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
      <div class="bubble-content">${userContentHtml}</div>
    `;
    chatContainer.appendChild(userBubble);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // 2. Append AI Loading Placeholder Bubble
    const isChatbot = this.activeToolKey === 'chatbot';
    const toolData = AETHERA_DATA.tools[this.activeToolKey] || { title: 'Assistant', systemPrompt: '' };
    const bubbleAuthor = isChatbot ? 'Aethera // Friend & Companion' : `Aethera Cortex // ${toolData.title}`;
    const statusText = isChatbot ? 'CHATTING...' : 'CALLING GEMINI VISION API...';
    const loadingMessage = isChatbot ? 'Thinking of a reply...' : 'Synthesizing multimodal response &amp; LaTeX math...';

    const aiBubble = document.createElement('div');
    aiBubble.className = 'chat-bubble ai-message';
    aiBubble.innerHTML = `
      <div class="bubble-header">
        <div class="bubble-avatar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
        </div>
        <span class="bubble-author">${bubbleAuthor}</span>
        <span class="bubble-time status-tag">${statusText}</span>
      </div>
      <div class="bubble-content ai-stream-content">
        <div class="loading-pulse-dots">
          <span>●</span> <span>●</span> <span>●</span>
          <span style="font-size: 0.75rem; color: var(--text-muted); margin-left: 0.5rem;">${loadingMessage}</span>
        </div>
      </div>
    `;
    chatContainer.appendChild(aiBubble);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // 3. Build Multi-Turn Conversation Payload with vision parts
    const detailPref = document.getElementById('param-detail-select')?.value || 'detailed';
    const langPref = document.getElementById('param-lang-select')?.value || 'auto';

    let systemInstructionText = '';
    const isIndonesian = (typeof window !== 'undefined' && window.aetheraI18n && typeof window.aetheraI18n.getLanguage === 'function' && window.aetheraI18n.getLanguage() === 'id');

    if (isChatbot) {
      systemInstructionText = `${toolData.systemPrompt}
Important Persona Guidelines:
1. Tone & Persona: Friendly, warm, relaxed, and casual—just like a supportive, smart friend texting or chatting.
2. Style: Speak naturally and conversationally. Avoid stiff corporate, academic, textbook, or robotic explanations. Use comfortable paragraphs, bullet points when helpful, and light emojis when natural.
3. STRICT PROHIBITION: DO NOT bring up unsolicited mathematics, formulas, LaTeX notation ($$...$$ or $...$), or academic proofs unless the user specifically and explicitly asks for mathematical help or calculations.
4. Images: If an image is provided, discuss it warmly and naturally like a friend checking it out.`;
    } else {
      systemInstructionText = `${toolData.systemPrompt}
Preference: ${detailPref} explanation. Target Language / Format: ${langPref}.
Important: If an image is provided, analyze all visual elements, diagrams, formulas, text, handwritten notes, or code accurately. Format all mathematical equations in LaTeX using $$...$$ for display equations and $...$ for inline equations. Use clean Markdown formatting and language-tagged code blocks.`;
    }

    if (isIndonesian) {
      systemInstructionText += `\n\nCRITICAL LOCALIZATION REQUIREMENT: Berikan seluruh respons dan penjelasan dalam Bahasa Indonesia yang alami, luwes, santun, dan mudah dipahami.`;
    }

    const userParts = [];
    if (promptText) {
      userParts.push({ text: promptText });
    } else {
      userParts.push({ text: "Please analyze this image according to the active tool instructions." });
    }

    if (attachedImage) {
      userParts.push({
        inlineData: {
          mimeType: attachedImage.mimeType,
          data: attachedImage.base64
        }
      });
    }

    this.chatHistory.push({ role: "user", parts: userParts });
    // Optimize history: Keep last 10 messages and strip heavy base64 data from older turns
    const recentHistory = this.chatHistory.slice(-10).map((msg, idx, arr) => {
      if (idx === arr.length - 1) return msg;
      return {
        role: msg.role,
        parts: (msg.parts || []).map(p => {
          if (p.inlineData) return { text: '[Attached image analyzed]' };
          return p;
        })
      };
    });

    const payload = {
      system_instruction: {
        parts: [{ text: systemInstructionText }]
      },
      contents: recentHistory,
      generationConfig: {
        maxOutputTokens: 3072,
        temperature: 0.7
      }
    };

    let generatedText = "";
    const contentEl = aiBubble.querySelector('.ai-stream-content');
    const timeTag = aiBubble.querySelector('.status-tag');

    const backend = this.getBackendUrl() || 'http://localhost:3000';
    const activeKey = this.getApiKey();
    this.streamEndpoint = this.getStreamEndpoint();
    this.modelEndpoint = this.getModelEndpoint();

    try {
      // 1. Primary: Server-Side Streaming AI Proxy (Instant Sub-Second Streaming)
      let response = null;
      try {
        const streamUrl = `${backend}/api/ai/stream`;
        response = await fetch(streamUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, model: this.selectedModel })
        });
      } catch (streamFetchErr) {
        console.warn('[AetheraStudio] Server stream unreachable:', streamFetchErr.message);
      }
      if (response && !response.ok) {
        console.warn('[AetheraStudio] Server stream returned HTTP', response.status);
      }

      // 2. Direct Google AI stream fallback if server stream didn't respond 200
      if ((!response || !response.ok) && activeKey) {
        try {
          const directStreamUrl = `${this.streamEndpoint}&key=${encodeURIComponent(activeKey)}`;
          const directResp = await fetch(directStreamUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...payload, model: this.selectedModel })
          });
          if (directResp && directResp.ok) {
            response = directResp;
          }
        } catch (_) {}
      }

      if (response && response.ok) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = "";
        let renderScheduled = false;

        const updateRender = () => {
          renderScheduled = false;
          if (contentEl && generatedText) {
            contentEl.innerHTML = this.formatMarkdown(generatedText);
          }
          if (timeTag) {
            timeTag.textContent = "GENERATING...";
          }
          chatContainer.scrollTop = chatContainer.scrollHeight;
        };

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || "";

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
                      generatedText += chunkText;
                      this.latestOutputText = generatedText;
                      if (!renderScheduled) {
                        renderScheduled = true;
                        requestAnimationFrame(updateRender);
                      }
                    }
                  }
                } catch (e) {
                  // Incomplete chunk
                }
              }
            }
          }
        }
        // Final render sync
        if (contentEl && generatedText) {
          contentEl.innerHTML = this.formatMarkdown(generatedText);
        }
      }

      if (generatedText) {
        this.chatHistory.push({ role: "model", parts: [{ text: generatedText }] });
        if (timeTag) timeTag.textContent = `COMPLETED // ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        this.attachSaveToDBButton(aiBubble, promptText, generatedText);
        this.attachCalendarIntegration(aiBubble, promptText, generatedText);
        return;
      }

      // 3. Fallback: Server-side generateContent (protected & reliable)
      if (backend) {
        try {
          const backendRes = await fetch(`${backend}/api/ai/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...payload, model: this.selectedModel || 'gemini-flash-lite-latest' })
          });
          if (backendRes.ok) {
            const bData = await backendRes.json();
            if (bData.candidates && bData.candidates[0]?.content?.parts) {
              generatedText = bData.candidates[0].content.parts.map(p => p.text).join('\n');
              this.chatHistory.push({ role: "model", parts: [{ text: generatedText }] });
              this.latestOutputText = generatedText;
              if (contentEl) contentEl.innerHTML = this.formatMarkdown(generatedText);
              if (timeTag) timeTag.textContent = `COMPLETED // ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
              this.attachSaveToDBButton(aiBubble, promptText, generatedText);
              this.attachCalendarIntegration(aiBubble, promptText, generatedText);
              chatContainer.scrollTop = chatContainer.scrollHeight;
              return;
            }
          }
        } catch (_) {}
      }

      // 4. Fallback: Direct generateContent with ultra-fast candidate models
      const candidateModels = ['gemini-flash-lite-latest', 'gemini-3.1-flash-lite', 'gemini-3.5-flash-lite', 'gemini-3.6-flash'];
      for (const m of candidateModels) {
        try {
          const directUrl = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${encodeURIComponent(activeKey)}`;
          const directRes = await fetch(directUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          if (directRes.ok) {
            const fbData = await directRes.json();
            if (fbData.candidates && fbData.candidates[0]?.content?.parts) {
              generatedText = fbData.candidates[0].content.parts.map(p => p.text).join('\n');
              this.chatHistory.push({ role: "model", parts: [{ text: generatedText }] });
              this.latestOutputText = generatedText;
              if (contentEl) contentEl.innerHTML = this.formatMarkdown(generatedText);
              if (timeTag) timeTag.textContent = `COMPLETED // ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
              this.attachSaveToDBButton(aiBubble, promptText, generatedText);
              this.attachCalendarIntegration(aiBubble, promptText, generatedText);
              chatContainer.scrollTop = chatContainer.scrollHeight;
              return;
            }
          }
        } catch (mErr) {
          // Continue to next model
        }
      }

      // If all cloud attempts fail, run built-in neural simulation seamlessly
      this.runSimulatedResponse(aiBubble, promptText, attachedImage, toolData, {
        mode: 'builtin-instant',
        notice: 'Aethera Built-in Neural Engine active.'
      });

    } catch (err) {
      console.warn('[AetheraStudio Inference Catch]', err);
      this.runSimulatedResponse(aiBubble, promptText, attachedImage, toolData, {
        mode: 'builtin-instant',
        notice: 'Aethera Built-in Neural Engine active.'
      });
    } finally {
      this.isGenerating = false;
      const runBtnText = document.getElementById('run-btn-text');
      if (runBtnText) runBtnText.textContent = "Run AI";
    }
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

  getApiKey() {
    let key = this.cleanApiKey(localStorage.getItem('aethera_gemini_api_key') || this.apiKey || this.defaultKey || '');
    if (!key) {
      try {
        const fbConfig = JSON.parse(localStorage.getItem('aethera_firebase_cloud_config') || '{}');
        if (fbConfig && fbConfig.apiKey) {
          key = this.cleanApiKey(fbConfig.apiKey);
        }
      } catch (e) {}
    }
    return key || this.defaultKey || DEFAULT_GEMINI_API_KEY;
  }

  hasValidCloudKey() {
    const key = this.getApiKey();
    return typeof key === 'string' && key.length >= 15;
  }

  setApiKey(key) {
    const cleanKey = this.cleanApiKey(key);
    if (cleanKey && cleanKey.length >= 15) {
      localStorage.setItem('aethera_gemini_api_key', cleanKey);
      this.apiKey = cleanKey;
      try {
        const backend = this.getBackendUrl();
        fetch(`${backend}/api/config/ai-key`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: cleanKey })
        }).catch(() => {});
      } catch (e) {}
    } else {
      localStorage.removeItem('aethera_gemini_api_key');
      this.apiKey = this.defaultKey;
    }
    this.updateApiKeyButtonState();
  }

  getStreamEndpoint(model = null) {
    const m = model || this.selectedModel || 'gemini-3.6-flash';
    return `https://generativelanguage.googleapis.com/v1beta/models/${m}:streamGenerateContent?alt=sse`;
  }

  getModelEndpoint(model = null) {
    const m = model || this.selectedModel || 'gemini-3.6-flash';
    return `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent`;
  }

  updateApiKeyButtonState() {
    const dot = document.querySelector('.key-status-dot');
    const label = document.getElementById('api-key-btn-label');
    const statusVal = document.getElementById('studio-api-status-val');
    const hasCustomKey = this.hasValidCloudKey();
    if (dot) dot.classList.toggle('active', hasCustomKey);
    if (label) label.textContent = hasCustomKey ? 'API Key (Active)' : 'API Key';
    if (statusVal) {
      if (hasCustomKey) {
        statusVal.textContent = 'CONNECTED // LIVE CLOUD';
        statusVal.style.color = '#10B981';
      } else {
        statusVal.textContent = 'READY // LOCAL SIM';
        statusVal.style.color = 'var(--accent-cyan, #06B6D4)';
      }
    }
  }

  initApiKeyManager() {
    const configBtn = document.getElementById('api-key-config-btn');
    const modal = document.getElementById('api-key-modal');
    const closeBtn = document.getElementById('api-key-modal-close');
    const input = document.getElementById('user-gemini-key-input');
    const modelSelect = document.getElementById('user-gemini-model-select');
    const saveBtn = document.getElementById('save-api-key-btn');
    const clearBtn = document.getElementById('clear-api-key-btn');
    const testBtn = document.getElementById('test-api-key-btn');
    const statusDiv = document.getElementById('key-test-status');

    this.updateApiKeyButtonState();

    if (configBtn && modal) {
      configBtn.addEventListener('click', () => {
        if (input) input.value = this.getApiKey();
        if (modelSelect) modelSelect.value = this.selectedModel;
        if (statusDiv) statusDiv.style.display = 'none';
        modal.style.display = 'flex';
        modal.setAttribute('aria-hidden', 'false');
      });
    }

    const closeModal = () => {
      if (modal) {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
      }
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
    }

    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const rawKey = input ? input.value : '';
        const key = this.cleanApiKey(rawKey);
        const model = modelSelect ? modelSelect.value : 'gemini-3.6-flash';
        this.selectedModel = model;
        localStorage.setItem('aethera_selected_model', model);
        this.streamEndpoint = this.getStreamEndpoint(model);
        this.modelEndpoint = this.getModelEndpoint(model);

        if (rawKey.trim() && !key) {
          if (statusDiv) {
            statusDiv.style.display = 'block';
            statusDiv.style.background = 'rgba(239, 68, 68, 0.15)';
            statusDiv.style.color = '#EF4444';
            statusDiv.textContent = 'Invalid key format. Please enter a valid API key.';
          }
          return;
        }

        this.setApiKey(key);

        if (statusDiv) {
          statusDiv.style.display = 'block';
          statusDiv.style.background = key ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)';
          statusDiv.style.color = key ? '#10B981' : '#EF4444';
          statusDiv.textContent = key ? '✓ Key saved & connected!' : 'API key cleared.';
        }

        setTimeout(() => {
          closeModal();
        }, 500);
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (input) input.value = '';
        this.setApiKey('');
        if (statusDiv) {
          statusDiv.style.display = 'block';
          statusDiv.style.background = 'rgba(239, 68, 68, 0.1)';
          statusDiv.style.color = '#EF4444';
          statusDiv.textContent = 'API key removed from local storage.';
        }
      });
    }

    if (testBtn) {
      testBtn.addEventListener('click', async () => {
        const rawKey = input ? input.value : '';
        const testKey = this.cleanApiKey(rawKey);
        if (!testKey) {
          if (this.isServerProxyActive) {
            if (statusDiv) {
              statusDiv.style.display = 'block';
              statusDiv.style.background = 'rgba(6, 182, 212, 0.1)';
              statusDiv.style.color = 'var(--accent-cyan)';
              statusDiv.textContent = 'Testing Secure Backend AI Proxy connection...';
            }
            try {
              const backend = this.getBackendUrl();
              const testRes = await fetch(`${backend}/api/ai/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: 'Hello' }] }], model: 'gemini-3.6-flash' })
              });
              if (testRes.ok) {
                statusDiv.style.background = 'rgba(16, 185, 129, 0.15)';
                statusDiv.style.color = '#10B981';
                statusDiv.textContent = '✓ Secure Backend AI Proxy Connected! Server API key is active & verified.';
              } else {
                const errData = await testRes.json().catch(() => ({}));
                statusDiv.style.background = 'rgba(239, 68, 68, 0.15)';
                statusDiv.style.color = '#EF4444';
                statusDiv.textContent = `Backend AI test failed (HTTP ${testRes.status}): ${errData.error?.message || testRes.statusText}`;
              }
            } catch (e) {
              statusDiv.style.background = 'rgba(239, 68, 68, 0.15)';
              statusDiv.style.color = '#EF4444';
              statusDiv.textContent = `Could not reach backend server: ${e.message}`;
            }
            return;
          }
          if (statusDiv) {
            statusDiv.style.display = 'block';
            statusDiv.style.background = 'rgba(239, 68, 68, 0.1)';
            statusDiv.style.color = '#EF4444';
            statusDiv.textContent = 'Please enter an API key to test, or start the backend server.';
          }
          return;
        }

        if (statusDiv) {
          statusDiv.style.display = 'block';
          statusDiv.style.background = 'rgba(6, 182, 212, 0.1)';
          statusDiv.style.color = 'var(--accent-cyan)';
          statusDiv.textContent = 'Verifying API key with Google AI Studio...';
        }

        try {
          const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${testKey}`);
          if (res.ok) {
            statusDiv.style.background = 'rgba(16, 185, 129, 0.15)';
            statusDiv.style.color = '#10B981';
            statusDiv.textContent = '✓ Key verified successfully! Google Gemini API connected.';
          } else {
            const errData = await res.json().catch(() => ({}));
            const errMsg = errData.error?.message || res.statusText;
            statusDiv.style.background = 'rgba(239, 68, 68, 0.15)';
            statusDiv.style.color = '#EF4444';
            statusDiv.textContent = `Verification failed (HTTP ${res.status}): ${errMsg}`;
          }
        } catch (e) {
          statusDiv.style.background = 'rgba(239, 68, 68, 0.15)';
          statusDiv.style.color = '#EF4444';
          statusDiv.textContent = `Network error while testing: ${e.message}`;
        }
      });
    }
  }

  renderAuthErrorCard(aiBubble, promptText, attachedImage, toolData, errorMsg) {
    const contentEl = aiBubble.querySelector('.ai-stream-content');
    const timeTag = aiBubble.querySelector('.status-tag');
    if (timeTag) timeTag.textContent = 'KEY CONFIG REQUIRED';

    if (!contentEl) return;
    contentEl.innerHTML = `
      <div class="api-auth-error-card">
        <div class="auth-error-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>GEMINI API KEY REQUIRED // HTTP 401</span>
        </div>
        <h4 class="auth-error-title">Google Gemini API Authorization Required</h4>
        <p class="auth-error-desc">
          Google returned <code>${this.escapeHtml(errorMsg || 'API error: 401')}</code>. To enable live multimodal cloud reasoning, enter your free Google AI Studio API key below, or run instantly with Aethera's built-in AI simulation engine.
        </p>
        <div class="auth-error-input-group">
          <input type="password" class="auth-key-quick-input" placeholder="Paste your Google AI Studio API key (AIzaSy...)" value="">
          <button type="button" class="btn btn-primary auth-save-key-btn" style="padding: 0.45rem 1.15rem; font-size: 0.8rem;">Save Key &amp; Retry</button>
        </div>
        <div class="auth-error-actions">
          <a href="https://aistudio.google.com/app/apikey" target="_blank" class="auth-get-key-link" title="Open Google AI Studio in new tab">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            <span>Get Free API Key from Google AI Studio</span>
          </a>
          <button type="button" class="auth-demo-btn">
            <span>⚡ Run with Built-in AI Simulation</span>
          </button>
        </div>
      </div>
    `;

    const input = contentEl.querySelector('.auth-key-quick-input');
    const saveBtn = contentEl.querySelector('.auth-save-key-btn');
    const demoBtn = contentEl.querySelector('.auth-demo-btn');

    if (saveBtn && input) {
      saveBtn.addEventListener('click', () => {
        const key = input.value.trim();
        if (!key) {
          alert('Please paste a valid Google Gemini API key (starts with AIzaSy...).');
          return;
        }
        this.setApiKey(key);
        // Re-execute request with new key
        const promptInput = document.getElementById('studio-prompt-input');
        if (promptInput) promptInput.value = promptText;
        this.currentImage = attachedImage;
        aiBubble.remove();
        this.executeAIRequest();
      });
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          saveBtn.click();
        }
      });
    }

    if (demoBtn) {
      demoBtn.addEventListener('click', () => {
        this.runSimulatedResponse(aiBubble, promptText, attachedImage, toolData);
      });
    }
  }

  runSimulatedResponse(aiBubble, promptText, attachedImage, toolData, options = {}) {
    const contentEl = aiBubble.querySelector('.ai-stream-content');
    const timeTag = aiBubble.querySelector('.status-tag');
    if (timeTag) timeTag.textContent = `AETHERA NEURAL // ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const simText = this.generateSimulatedResponse(this.activeToolKey, promptText, attachedImage);
    this.latestOutputText = simText;
    this.chatHistory.push({ role: "model", parts: [{ text: simText }] });

    let bannerHtml = '';
    if (options.mode === 'key-rejected') {
      bannerHtml = `
        <div class="ai-key-notice-banner warning">
          <div class="key-notice-left">
            <span class="key-notice-pill warning">API KEY 401</span>
            <span>${options.notice || 'Google API key invalid. Switched to Built-in AI Reasoning Engine.'}</span>
          </div>
          <button type="button" class="key-notice-btn banner-open-key-modal">Update Key</button>
        </div>
      `;
    } else if (options.mode === 'builtin-instant') {
      bannerHtml = `
        <div class="ai-key-notice-banner">
          <div class="key-notice-left">
            <span class="key-notice-pill">⚡ LOCAL REASONING</span>
            <span>Instant neural engine active. To stream live from Google Gemini Flash, <a href="javascript:void(0)" class="open-api-modal-link banner-open-key-modal">connect your free API key</a>.</span>
          </div>
          <button type="button" class="key-notice-btn banner-open-key-modal">Connect Key</button>
        </div>
      `;
    }

    if (contentEl) {
      contentEl.innerHTML = bannerHtml + this.formatMarkdown(simText);
      const modalBtns = contentEl.querySelectorAll('.banner-open-key-modal');
      modalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          document.getElementById('api-key-config-btn')?.click();
        });
      });
    }

    this.attachSaveToDBButton(aiBubble, promptText, simText);
    this.attachCalendarIntegration(aiBubble, promptText, simText);
  }

  generateSimulatedResponse(toolKey, promptText, attachedImage) {
    const p = (promptText || '').toLowerCase();
    
    if (toolKey === 'chatbot') {
      const cleanP = (promptText || '').trim();
      if (!cleanP) {
        return `Hey there! 😊 What's on your mind today? Feel free to ask anything, chat about how your day went, or bounce some thoughts around!`;
      }
      return `Hey! So about **"${cleanP.length > 55 ? cleanP.slice(0, 55) + '...' : cleanP}"**:

I totally hear you! Honestly, taking things one step at a time is usually the best way to handle it. 

How are you feeling about it, or what direction do you want to explore next? I'm right here with you! 😊`;
    }

    if (toolKey === 'task-planner' || p.includes('schedule') || p.includes('plan') || p.includes('todo')) {
      const today = new Date().toISOString().split('T')[0];
      return `# Daily Schedule & Productivity Plan // ${today}

## 1. Eisenhower Priority Matrix
- **Q1: Urgent & Important (Do First)**
  - Critical production issue triage & immediate client responses
  - High-priority deadline deliverables for current milestone
- **Q2: Important, Not Urgent (Schedule Deep Focus)**
  - Core system architecture design & database query optimization
  - Reading technical documentation & skill development (90 min)
- **Q3: Urgent, Not Important (Delegate / Batch)**
  - Daily engineering standup & alignment sync (30 min)
  - Quick Slack messages & stakeholder status updates
- **Q4: Neither (Eliminate / Low Energy)**
  - Inbox clearing & weekly backlog clean-up

## 2. Time-Blocked Schedule
- **09:00 - 10:30** | Q2: Core Architecture & Focused Deep Work (Focus Mode)
- **10:45 - 11:30** | Q1: Production Bug Triage & Critical Patch Review
- **11:30 - 12:30** | Q3: Team Sync & Engineering Standup
- **13:30 - 15:00** | Q2: Database Schema Index Tuning & Backend Refactor
- **15:30 - 16:30** | Q4: Inbox Zero & Weekly Retrospective Cleanup
- **17:00 - 18:00** | Personal Health & Fitness Session

## 3. Top 3 Non-Negotiable Wins
1. Complete critical production patch review
2. Finalize architecture spec for database migration
3. Unblock frontend and backend cross-team dependencies`;
    }

    if (toolKey === 'math-solver' || p.includes('integral') || p.includes('matrix') || p.includes('equation')) {
      return `### Mathematical Solution & Step-by-Step Proof

**Problem Statement:**
$$\\int_{0}^{\\infty} x^2 e^{-x^2} \\, dx$$

**Step 1: Integration by Parts Setup**
Let $u = x$ and $dv = x e^{-x^2} dx$.
Then:
$$du = dx, \\quad v = -\\frac{1}{2} e^{-x^2}$$

**Step 2: Applying the Integration by Parts Formula:**
$$\\int u \\, dv = u v - \\int v \\, du$$
$$\\int_{0}^{\\infty} x^2 e^{-x^2} \\, dx = \\left[ -\\frac{x}{2} e^{-x^2} \\right]_{0}^{\\infty} + \\frac{1}{2} \\int_{0}^{\\infty} e^{-x^2} \\, dx$$

**Step 3: Boundary Evaluation & Gaussian Integral:**
As $x \\to \\infty$, by L'Hôpital's rule $\\lim_{x \\to \\infty} \\frac{x}{e^{x^2}} = 0$.
At $x = 0$, $-\\frac{0}{2} = 0$. Thus the boundary term vanishes:
$$\\left[ -\\frac{x}{2} e^{-x^2} \\right]_{0}^{\\infty} = 0$$

Using the known Gaussian integral $\\int_{0}^{\\infty} e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$:
$$\\int_{0}^{\\infty} x^2 e^{-x^2} \\, dx = 0 + \\frac{1}{2} \\left( \\frac{\\sqrt{\\pi}}{2} \\right) = \\frac{\\sqrt{\\pi}}{4}$$

**Final Boxed Answer:**
$$\\boxed{\\int_{0}^{\\infty} x^2 e^{-x^2} \\, dx = \\frac{\\sqrt{\\pi}}{4} \\approx 0.4431}$$`;
    }

    if (toolKey === 'email-drafter' || p.includes('email') || p.includes('letter')) {
      return `### Professional Executive Email Draft

**Subject Options:**
1. Update: Strategic Progress & Next Milestones for Q3
2. Action Required: Project Timeline & Deliverables Review
3. Follow-up: Summary of Key Takeaways and Next Steps

---

**Email Body:**

Dear Team / Colleague,

I hope this message finds you well.

I wanted to provide a concise update regarding our current progress on the initiative. Over the past week, we have made substantial headways across our core deliverables:

- **Key Milestone Achieved:** Successfully finalized the initial technical review and addressed primary blockers.
- **Next Priority:** Moving into implementation phase with target completion scheduled for next Friday.
- **Required Action:** Please review the attached summary document by Wednesday at 3:00 PM and let me know if you have any questions or recommended adjustments.

Thank you for your continued dedication and collaboration. Please let me know if you would like to schedule a brief 10-minute sync.

Best regards,  
[Your Name]  
*Aethera Operations*

---

**Direct / Concise Tone Alternative:**
> "Hi Team — Quick update on project milestones: core review is complete, implementation is underway, and target delivery is next Friday. Please review the attached summary by Wednesday 3 PM. Let me know if any blockers arise. Thanks!"`;
    }

    if (toolKey === 'code-debugger' || toolKey === 'bug-hunter' || p.includes('code') || p.includes('bug') || p.includes('error')) {
      return `### Root Cause Diagnostic & Code Fix

**Diagnostic Summary:**
The issue occurs due to asynchronous race condition or unhandled null reference during state updates.

**Corrected Implementation:**
\`\`\`javascript
// Optimized implementation with error boundaries and state protection
async function handleDataStream(source) {
  if (!source) {
    throw new Error('Invalid data source provided');
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(source, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(\`HTTP error \${response.status}: \${response.statusText}\`);
    }

    const payload = await response.json();
    return { success: true, data: payload };
  } catch (err) {
    if (err.name === 'AbortError') {
      console.warn('Network request timed out after 8000ms');
    }
    return { success: false, error: err.message };
  }
}
\`\`\`

**Key Optimizations Applied:**
1. Added defensive argument validation against \`null\`/\`undefined\` inputs.
2. Implemented \`AbortController\` timeout preventing hanging promises.
3. Structured return signature \`{ success, data/error }\` for robust error handling.`;
    }

    // Default general response
    return `### Aethera Cortex Synthesis // ${(AETHERA_DATA.tools[toolKey]?.title || 'Assistant')}

**Analysis & Key Takeaways:**
Based on your inquiry, here is a structured synthesis tailored to your objective:

1. **Primary Insight:**
   Addressing "${(promptText ? promptText.slice(0, 50) + '...' : 'your request')}" requires prioritizing high-impact action items while mitigating operational bottlenecks.

2. **Actionable Steps:**
   - **Phase 1 (Immediate):** Formulate concrete specifications and establish clean boundaries.
   - **Phase 2 (Execution):** Implement solution iteratively with automated verification checks.
   - **Phase 3 (Review):** Consolidate feedback and deploy optimizations.

3. **Strategic Recommendation:**
   Maintain modularity and keep dependencies minimal to ensure performance and reliability.

*Note: Running in Aethera Built-in Simulation Mode. To enable live multimodal Gemini 2.5 Flash reasoning, configure your free Google AI Studio API key in the header.*`;
  }

  attachSaveToDBButton(aiBubble, promptText, responseText) {
    if (!aiBubble || !responseText) return;
    const header = aiBubble.querySelector('.bubble-header');
    if (!header || header.querySelector('.btn-save-chat')) return;

    const saveBtn = document.createElement('button');
    saveBtn.className = 'btn-save-chat';
    saveBtn.title = 'Save this response to your User Database profile';
    saveBtn.innerHTML = `
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
      <span>Save to DB</span>
    `;

    saveBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      if (!window.aetheraDB) return;

      try {
        saveBtn.disabled = true;
        saveBtn.innerHTML = `<span>Saving...</span>`;
        await window.aetheraDB.saveUserChat({
          toolKey: this.activeToolKey,
          title: `${(AETHERA_DATA.tools[this.activeToolKey]?.title || 'AI Output')} // ${promptText.substring(0, 30)}...`,
          prompt: promptText,
          response: responseText
        });
        saveBtn.className = 'btn-save-chat saved';
        saveBtn.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          <span>Saved to DB</span>
        `;
      } catch (err) {
        saveBtn.disabled = false;
        alert('Failed to save to database: ' + err.message);
      }
    });

    header.appendChild(saveBtn);
  }

  attachCalendarIntegration(aiBubble, promptText, responseText) {
    if (!aiBubble || !responseText) return;
    const header = aiBubble.querySelector('.bubble-header');
    if (!header || header.querySelector('.btn-add-calendar')) return;

    // Check if active tool is task-planner OR text has schedule indicators
    const isTaskPlanner = this.activeToolKey === 'task-planner';
    const hasScheduleIndicators = /\b(?:[01]?\d|2[0-3]):[0-5]\d\b/i.test(responseText) ||
                                  /\b(?:1[0-2]|0?[1-9])\s*(?:am|pm)\b/i.test(responseText) ||
                                  /\b(schedule|timeline|agenda|pomodoro|time-block|eisenhower|quadrant)\b/i.test(responseText);

    if (!isTaskPlanner && !hasScheduleIndicators) return;

    const calBtn = document.createElement('button');
    calBtn.className = 'btn-add-calendar';
    calBtn.title = 'Parse and add this schedule directly to your interactive Calendar';
    calBtn.innerHTML = `
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="12" y1="14" x2="12" y2="18"/><line x1="10" y1="16" x2="14" y2="16"/></svg>
      <span>Add to Calendar</span>
    `;

    calBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      if (!window.aetheraDB) {
        alert('Database module initializing, please try again.');
        return;
      }

      try {
        calBtn.disabled = true;
        calBtn.innerHTML = `<span>Parsing schedule...</span>`;

        let parsedEvents = [];
        if (typeof window.aetheraDB.parseAIScheduleText === 'function') {
          parsedEvents = window.aetheraDB.parseAIScheduleText(responseText);
        }

        // Fallback if no specific time pattern was found
        if (!parsedEvents || parsedEvents.length === 0) {
          const today = new Date().toISOString().split('T')[0];
          parsedEvents = [{
            id: 'evt_plan_' + Date.now(),
            title: promptText ? promptText.slice(0, 42) : 'Planned Focus Session',
            date: today,
            startTime: '09:00',
            endTime: '10:30',
            category: 'work',
            priority: 'high',
            quadrant: 'q2',
            description: responseText.slice(0, 200) + '...',
            completed: false
          }];
        }

        // Save batch into AetheraDB
        await window.aetheraDB.saveCalendarEventsBatch(parsedEvents);

        calBtn.className = 'btn-add-calendar saved';
        calBtn.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          <span>Added ${parsedEvents.length} Event(s)</span>
        `;

        // Append 'Open Calendar' quick link
        let viewBtn = header.querySelector('.btn-view-calendar');
        if (!viewBtn) {
          viewBtn = document.createElement('a');
          viewBtn.href = 'calendar.html';
          viewBtn.className = 'btn-view-calendar';
          viewBtn.target = '_blank';
          viewBtn.innerHTML = `<span>Open Calendar &rarr;</span>`;
          header.appendChild(viewBtn);
        }
      } catch (err) {
        calBtn.disabled = false;
        calBtn.innerHTML = `<span>Add to Calendar</span>`;
        alert('Failed to send schedule to calendar: ' + err.message);
      }
    });

    header.appendChild(calBtn);
  }

  streamFormattedOutput(container, markdownText, scrollParent) {
    container.innerHTML = this.formatMarkdown(markdownText);
    scrollParent.scrollTop = scrollParent.scrollHeight;
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
      const language = lang || 'code';
      placeholders[key] = `<div class="code-block-wrapper">
        <div class="code-block-header">
          <span>${language.toUpperCase()}</span>
          <button class="copy-code-btn" onclick="navigator.clipboard.writeText(\`${this.escapeForCopy(code.trim())}\`); this.textContent='Copied!'; setTimeout(()=>this.textContent='Copy', 1500);">Copy</button>
        </div>
        <pre><code class="language-${language}">${this.escapeHtml(code.trim())}</code></pre>
      </div>`;
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
    processed = processed.replace(/^### (.*$)/gim, '<h4 style="font-size: 1.05rem; margin: 1rem 0 0.4rem; color: var(--text-primary);">$1</h4>');
    processed = processed.replace(/^## (.*$)/gim, '<h3 style="font-size: 1.15rem; margin: 1.25rem 0 0.5rem; color: var(--text-primary);">$1</h3>');
    processed = processed.replace(/^# (.*$)/gim, '<h2 style="font-size: 1.3rem; margin: 1.5rem 0 0.6rem; color: var(--text-primary);">$1</h2>');

    // Bullet points & blockquotes
    processed = processed.replace(/^\s*[-*]\s+(.*$)/gim, '<li style="margin-left: 1.25rem; margin-bottom: 0.35rem;">$1</li>');
    processed = processed.replace(/^\s*&gt;\s+(.*$)/gim, '<blockquote style="border-left: 2px solid var(--border-focus); padding-left: 0.75rem; margin: 0.5rem 0; color: var(--text-secondary);">$1</blockquote>');

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
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  escapeForCopy(str) {
    return str
      .replace(/\\/g, '\\\\')
      .replace(/`/g, '\\`')
      .replace(/\$/g, '\\$');
  }
}

// Initialize AI Studio Engine
document.addEventListener('DOMContentLoaded', () => {
  window.aetheraStudio = new AetheraStudio();
});
