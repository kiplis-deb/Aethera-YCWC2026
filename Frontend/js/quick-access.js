/**
 * AETHERA - QUICK ACCESS FLOATING DOCK CONTROLLER
 * Implements user's quick-access right sidebar:
 * 1. AI Tools Page (ai.html)
 * 2. Calendar (calendar.html)
 * 3. Smart Notes (notes.html)
 * 4. Tech News (news.html)
 * 5. Aethera Chat (toggles floating chatbot dialog)
 */

(function () {
  'use strict';

  class AetheraQuickAccess {
    constructor() {
      this.init();
    }

    init() {
      if (document.getElementById('aethera-quick-access')) return;
      this.render();
      this.bindEvents();
      this.highlightCurrentPage();
      this.monitorActiveStates();
      if (window.aetheraI18n) {
        window.aetheraI18n.applyTranslations(document.getElementById('aethera-quick-access'));
      }
    }

    render() {
      const container = document.createElement('div');
      container.id = 'aethera-quick-access';
      container.className = 'quick-access-container';
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', 'Quick Access Sidebar');

      container.innerHTML = `
        <!-- Full Quick Access Dock (Permanently visible) -->
        <nav class="quick-access-dock" id="qa-dock" role="toolbar" aria-label="Quick Access Bar">
          <div class="quick-access-header">
            <span class="quick-access-badge-title" data-i18n="qa.title">Quick Access</span>
          </div>

          <div class="quick-access-items">
            <!-- 1. AI Tools Page -->
            <a href="ai.html" id="qa-ai-btn" class="quick-access-btn" aria-label="AI Tools Page">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2a4 4 0 0 1 4 4c0 1.95-1.4 3.58-3.25 3.93L12 10v2h2a3 3 0 0 1 3 3v1a2 2 0 0 1-2 2h-1v2a2 2 0 0 1-4 0v-2H9a2 2 0 0 1-2-2v-1a3 3 0 0 1 3-3h2v-2l-.75-.07C9.4 9.58 8 7.95 8 6a4 4 0 0 1 4-4z"/>
                <circle cx="12" cy="6" r="1.5" fill="currentColor"/>
              </svg>
              <span class="quick-access-tooltip" data-i18n="qa.ai">AI Tools Page</span>
            </a>

            <!-- 2. Calendar -->
            <a href="calendar.html" id="qa-cal-btn" class="quick-access-btn" aria-label="Interactive Calendar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span class="quick-access-tooltip" data-i18n="qa.calendar">Calendar</span>
            </a>

            <!-- 3. Notion Notes -->
            <a href="notes.html" id="qa-notes-btn" class="quick-access-btn" aria-label="Smart Notes">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
              <span class="quick-access-tooltip" data-i18n="qa.notes">Smart Notes</span>
            </a>

            <!-- 4. Tech & Business News -->
            <a href="news.html" id="qa-news-btn" class="quick-access-btn" aria-label="Tech & Business News">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/>
                <path d="M18 14h-8"/>
                <path d="M15 18h-5"/>
                <path d="M10 6h8v4h-8V6Z"/>
              </svg>
              <span class="quick-access-tooltip" data-i18n="qa.news">Tech News</span>
            </a>

            <!-- 5. Aethera Chat Trigger -->
            <button type="button" id="qa-chat-btn" class="quick-access-btn" aria-label="Aethera Chat">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <span class="quick-access-tooltip" data-i18n="qa.chat">Aethera Chat</span>
            </button>
          </div>
        </nav>
      `;

      document.body.appendChild(container);
    }

    bindEvents() {
      const chatBtn = document.getElementById('qa-chat-btn');

      // Aethera Chat Toggle
      if (chatBtn) {
        chatBtn.addEventListener('click', () => {
          if (window.aetheraChatbot) {
            window.aetheraChatbot.toggleWindow();
          } else if (window.openChatbot) {
            window.openChatbot();
          } else {
            window.location.href = 'ai.html';
          }
        });
      }

      // Re-apply translations on language change
      window.addEventListener('aethera:language-change', () => {
        const container = document.getElementById('aethera-quick-access');
        if (container && window.aetheraI18n) {
          window.aetheraI18n.applyTranslations(container);
        }
      });
    }

    highlightCurrentPage() {
      const path = window.location.pathname.toLowerCase();
      const aiBtn = document.getElementById('qa-ai-btn');
      const calBtn = document.getElementById('qa-cal-btn');
      const notesBtn = document.getElementById('qa-notes-btn');
      const newsBtn = document.getElementById('qa-news-btn');

      if (path.includes('ai.html') && aiBtn) {
        aiBtn.classList.add('active');
      } else if (path.includes('calendar.html') && calBtn) {
        calBtn.classList.add('active');
      } else if (path.includes('notes.html') && notesBtn) {
        notesBtn.classList.add('active');
      } else if (path.includes('news.html') && newsBtn) {
        newsBtn.classList.add('active');
      }
    }

    monitorActiveStates() {
      const chatBtn = document.getElementById('qa-chat-btn');
      const updateState = () => {
        const chatWin = document.getElementById('chatbot-window');
        if (chatBtn) {
          if (chatWin && chatWin.classList.contains('open')) {
            chatBtn.classList.add('active');
          } else {
            chatBtn.classList.remove('active');
          }
        }
      };

      // Event-driven state updates (Zero CPU polling)
      window.addEventListener('aethera:chat-toggle', updateState);
      const chatWin = document.getElementById('chatbot-window');
      if (chatWin) {
        const observer = new MutationObserver(updateState);
        observer.observe(chatWin, { attributes: true, attributeFilter: ['class'] });
        updateState();
      } else {
        const bodyObserver = new MutationObserver(() => {
          const win = document.getElementById('chatbot-window');
          if (win) {
            bodyObserver.disconnect();
            const obs = new MutationObserver(updateState);
            obs.observe(win, { attributes: true, attributeFilter: ['class'] });
            updateState();
          }
        });
        bodyObserver.observe(document.body, { childList: true });
      }
    }
  }

  // Auto-init on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new AetheraQuickAccess());
  } else {
    new AetheraQuickAccess();
  }
})();
