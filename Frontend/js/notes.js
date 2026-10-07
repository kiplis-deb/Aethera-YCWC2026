/**
 * AETHERA - NOTION-STYLE NOTES WORKSPACE CONTROLLER
 * Real-time multi-device cloud synchronization, block-based rich editor,
 * slash commands (/), Ctrl+K quick search, calendar event notes, and AI assistance.
 */

(function () {
  'use strict';

  class AetheraNotesApp {
    constructor() {
      this.db = window.aetheraDB;
      this.notes = [];
      this.currentNoteId = null;
      this.activeBlockEl = null;
      this.saveDebounceTimer = null;
      this.slashMenuIndex = 0;
      this.slashFilteredItems = [];

      this.init();
    }

    isId() {
      return !!(window.aetheraI18n && window.aetheraI18n.getLanguage() === 'id');
    }

    getLocale() {
      return this.isId() ? 'id-ID' : 'en-US';
    }

    getUntitledPlaceholder() {
      return this.isId() ? 'Halaman baru' : 'New page';
    }

    async init() {
      // 1. Initial Load from local & server
      try {
        await this.loadNotes();
      } catch (err) {
        console.error('[Notes] loadNotes error:', err);
      }
      if (!Array.isArray(this.notes) || this.notes.length === 0) {
        this.notes = (this.db && typeof this.db._getDefaultStarterNotes === 'function') ? this.db._getDefaultStarterNotes() : [];
      }

      // 2. Bind all UI events
      this.bindEvents();

      // 3. Render Calendar Upcoming Events
      this.renderUpcomingEvents();

      // Listen for language changes across the platform
      window.addEventListener('aethera:language-change', () => {
        this.renderSidebar();
        this.renderUpcomingEvents();
        if (this.currentNoteId) {
          const currentNote = this.notes.find(n => n.id === this.currentNoteId);
          if (currentNote) {
            const breadcrumbTitle = document.getElementById('breadcrumb-page-title');
            if (breadcrumbTitle && (!currentNote.title || currentNote.title === 'Untitled' || currentNote.title === 'New page' || currentNote.title === 'Halaman baru')) {
              breadcrumbTitle.textContent = this.getUntitledPlaceholder();
            }
            this.updateEditedTimestamp(currentNote.updatedAt);
            const createdDateEl = document.getElementById('prop-created-date');
            if (createdDateEl) {
              const rawDate = currentNote.createdAt || currentNote.updatedAt || new Date().toISOString();
              const d = new Date(rawDate);
              createdDateEl.textContent = d.toLocaleDateString(this.getLocale(), { month: 'short', day: 'numeric', year: 'numeric' });
            }
          }
        }
        const syncText = document.getElementById('sync-text');
        if (syncText) {
          syncText.textContent = this.isId() ? 'Tersinkronisasi ke cloud' : 'Synced to cloud';
        }
      });

      // 4. Listen for real-time sync from other devices
      window.addEventListener('aethera:notes-synced', (e) => {
        console.log('[Aethera Notes] Received cloud sync update', e.detail);
        if (this.db && typeof this.db.getNotes === 'function') {
          const fresh = this.db.getNotes();
          if (Array.isArray(fresh)) {
            this.notes = fresh;
            this.renderSidebar();
            if (this.currentNoteId) {
              const updated = this.notes.find(n => n.id === this.currentNoteId);
              if (updated) {
                const titleEl = document.getElementById('breadcrumb-page-title');
                if (titleEl) titleEl.textContent = updated.title || 'Untitled';
              }
            }
          }
        }
      });

      // 5. Select default note or first note (supports URL ?id=...)
      const urlParams = new URLSearchParams(window.location.search);
      const urlNoteId = urlParams.get('id');
      const lastNoteId = localStorage.getItem('aethera_last_opened_note');
      const targetNote = (urlNoteId && this.notes.find(n => n.id === urlNoteId)) ||
        this.notes.find(n => n.id === lastNoteId) ||
        this.notes[0];

      if (targetNote) {
        this.openNote(targetNote.id);
      } else {
        this.createNewNote('Untitled');
      }

      // 6. Update user profile / workspace title
      this.updateWorkspaceInfo();

      // 7. Initialize Theme
      this.initTheme();
    }

    updateWorkspaceInfo() {
      const user = this.db ? (typeof this.db.getCurrentUser === 'function' ? this.db.getCurrentUser() : this.db.getUser()) : null;
      const workspaceNameEl = document.getElementById('workspace-name');
      const workspaceAvatarEl = document.getElementById('workspace-avatar');
      const workspaceSwitcherEl = document.getElementById('workspace-switcher');

      if (workspaceSwitcherEl) {
        workspaceSwitcherEl.setAttribute('href', 'index.html');
        workspaceSwitcherEl.setAttribute('title', user && user.username ? `Aethera Overview (${user.username})` : 'Go to Aethera Landing Page');
      }

      if (workspaceNameEl) {
        workspaceNameEl.textContent = 'Aethera';
      }

      if (workspaceAvatarEl) {
        workspaceAvatarEl.innerHTML = `
          <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 18px; height: 18px;">
            <circle cx="16" cy="16" r="14" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 2" opacity="0.4"/>
            <polygon points="16,6 26,22 6,22" stroke="currentColor" stroke-width="2" fill="none"/>
            <circle cx="16" cy="16" r="3" fill="currentColor"/>
          </svg>
        `;
      }
    }

    async loadNotes() {
      if (this.db && typeof this.db.getNotes === 'function') {
        // Pull latest from local DB synchronously
        const raw = this.db.getNotes();
        this.notes = Array.isArray(raw) ? raw : [];
        // Trigger server sync in background if logged in
        const isAuth = typeof this.db.isLoggedIn === 'function' ? this.db.isLoggedIn() :
                       (typeof this.db.isAuthenticated === 'function' ? this.db.isAuthenticated() : false);
        if (isAuth && typeof this.db.syncFromServer === 'function') {
          this.db.syncFromServer().then(() => {
            const fresh = this.db.getNotes();
            if (Array.isArray(fresh)) {
              this.notes = fresh;
              this.renderSidebar();
            }
          }).catch(err => console.warn('[Notes] Cloud sync background notice:', err));
        }
      }

      if (!Array.isArray(this.notes) || this.notes.length === 0) {
        this.notes = (this.db && typeof this.db._getDefaultStarterNotes === 'function') ? this.db._getDefaultStarterNotes() : [];
      }
    }

    /* ==========================================================================
       SIDEBAR & UPCOMING EVENTS RENDERING
       ========================================================================== */
    renderSidebar() {
      const recentsList = document.getElementById('sidebar-recents-list');
      const privateList = document.getElementById('sidebar-private-list');

      if (!recentsList || !privateList) return;

      recentsList.innerHTML = '';
      privateList.innerHTML = '';

      if (!Array.isArray(this.notes)) {
        this.notes = [];
      }

      // Sort notes by recency (lastOpenedAt or updatedAt or createdAt)
      const getNoteRecency = (n) => {
        const opened = n.lastOpenedAt ? new Date(n.lastOpenedAt).getTime() : 0;
        const updated = n.updatedAt ? new Date(n.updatedAt).getTime() : 0;
        const created = n.createdAt ? new Date(n.createdAt).getTime() : 0;
        return Math.max(opened, updated, created);
      };

      const sortedByRecency = [...this.notes].sort((a, b) => getNoteRecency(b) - getNoteRecency(a));

      // Recents (Top 7)
      const recents = sortedByRecency.slice(0, 7);
      recents.forEach(note => {
        recentsList.appendChild(this.createSidebarItemEl(note));
      });

      // Private (All user notes)
      sortedByRecency.forEach(note => {
        privateList.appendChild(this.createSidebarItemEl(note));
      });
    }

    createSidebarItemEl(note) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.className = `sidebar-page-item ${note.id === this.currentNoteId ? 'active' : ''}`;
      a.dataset.noteId = note.id;
      a.setAttribute('href', '#');
      a.setAttribute('role', 'button');
      a.setAttribute('tabindex', '0');

      const displayTitle = (note.title && note.title.trim().length > 0 && note.title !== 'Untitled' && note.title !== 'New page' && note.title !== 'Halaman baru')
        ? note.title
        : this.getUntitledPlaceholder();

      a.innerHTML = `
        <span class="sidebar-page-icon">${note.icon || '📄'}</span>
        <span class="sidebar-page-title">${this.escapeHtml(displayTitle)}</span>
        <div class="sidebar-page-actions">
          <button type="button" class="page-action-icon btn-delete-note" title="${this.isId() ? 'Hapus halaman' : 'Delete page'}" data-note-id="${note.id}">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      `;

      a.addEventListener('click', (e) => {
        e.preventDefault();
        if (e.target.closest('.btn-delete-note')) {
          e.stopPropagation();
          this.deleteNote(note.id);
          return;
        }
        this.openNote(note.id);
      });

      a.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.openNote(note.id);
        }
      });

      li.appendChild(a);
      return li;
    }

    renderUpcomingEvents() {
      const container = document.getElementById('upcoming-events-container');
      if (!container) return;

      container.innerHTML = '';

      let events = [];
      if (this.db && typeof this.db.getCalendarEvents === 'function') {
        try {
          const raw = this.db.getCalendarEvents();
          events = Array.isArray(raw) ? raw : [];
        } catch (_) {
          events = [];
        }
      }

      // Filter upcoming or today's events, fallback to standard demo events if empty
      if (!Array.isArray(events) || events.length === 0) {
        events = [
          { id: 'demo-1', title: 'Brainstorm', time: '8 – 9 AM' },
          { id: 'demo-2', title: 'Project overview', time: '9 – 10 AM' }
        ];
      }

      events.slice(0, 3).forEach(evt => {
        const item = document.createElement('div');
        item.className = 'upcoming-event-item';
        item.style.cursor = 'pointer';
        item.title = `Click to create/open meeting note for "${evt.title}"`;

        const timeStr = evt.time || (evt.startTime ? `${evt.startTime} – ${evt.endTime || ''}` : 'Today');

        item.innerHTML = `
          <div class="upcoming-event-dot"></div>
          <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 140px;">${this.escapeHtml(evt.title)}</span>
          <span class="upcoming-event-time">${this.escapeHtml(timeStr)}</span>
        `;

        item.addEventListener('click', () => {
          this.createMeetingNoteForEvent(evt);
        });

        container.appendChild(item);
      });
    }

    createMeetingNoteForEvent(evt) {
      const existing = this.notes.find(n => n.title && n.title.includes(evt.title));
      if (existing) {
        this.openNote(existing.id);
        return;
      }

      const now = new Date().toISOString();
      const note = {
        id: 'note_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        title: `Meeting Notes: ${evt.title}`,
        icon: '📋',
        cover: null,
        folder: 'Private',
        favorite: false,
        createdAt: now,
        updatedAt: now,
        lastOpenedAt: now,
        blocks: [
          { id: 'b1', type: 'h2', text: 'Agenda & Context' },
          { id: 'b2', type: 'callout', text: `Event scheduled for ${evt.time || 'today'}. Objectives: Define deliverables & action items.`, icon: '💡' },
          { id: 'b3', type: 'h2', text: 'Action Items' },
          { id: 'b4', type: 'todo', text: 'Review project requirements with the team', checked: false },
          { id: 'b5', type: 'todo', text: 'Sync calendar milestones with Aethera Cortex', checked: false },
          { id: 'b6', type: 'p', text: '' }
        ]
      };

      if (this.db && typeof this.db.saveNote === 'function') {
        this.db.saveNote(note);
      }
      this.notes.unshift(note);
      this.openNote(note.id);
    }

    /* ==========================================================================
       NOTE CRUD OPERATIONS
       ========================================================================== */
    createNewNote(title = 'Untitled', initialBlocks = null) {
      const now = new Date().toISOString();
      const note = {
        id: 'note_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        title: title,
        icon: '📄',
        cover: null,
        folder: 'Private',
        favorite: false,
        createdAt: now,
        updatedAt: now,
        lastOpenedAt: now,
        blocks: initialBlocks || [
          { id: 'b_' + Date.now(), type: 'p', text: '' }
        ]
      };

      if (this.db && typeof this.db.saveNote === 'function') {
        this.db.saveNote(note);
      }
      this.notes.unshift(note);
      this.openNote(note.id);

      // Focus title input
      const titleInput = document.getElementById('page-title-input');
      if (titleInput) {
        titleInput.value = (title === 'Untitled' || title === 'New page') ? '' : title;
        titleInput.focus();
      }
      return note;
    }

    createNewNoteFromAI(noteData) {
      if (!noteData) return null;
      const now = new Date().toISOString();
      const note = {
        id: noteData.id || ('note_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6)),
        title: noteData.title || 'Untitled Note',
        icon: noteData.icon || '📄',
        cover: noteData.cover || null,
        folder: noteData.folder || 'Private',
        favorite: !!noteData.favorite,
        createdAt: noteData.createdAt || now,
        updatedAt: now,
        lastOpenedAt: now,
        blocks: (noteData.blocks && noteData.blocks.length > 0) ? noteData.blocks : [
          { id: 'b_' + Date.now(), type: 'p', text: '' }
        ]
      };

      if (this.db && typeof this.db.saveNote === 'function') {
        this.db.saveNote(note);
      }
      this.notes.unshift(note);
      this.openNote(note.id);
      return note;
    }

    openNote(noteId) {
      const note = this.notes.find(n => n.id === noteId);
      if (!note) return;

      this.currentNoteId = note.id;
      note.lastOpenedAt = new Date().toISOString();
      localStorage.setItem('aethera_last_opened_note', note.id);

      // Save updated lastOpenedAt in DB so recents order is preserved
      if (this.db && typeof this.db.saveNote === 'function') {
        this.db.saveNote(note);
      }

      // Auto-collapse sidebar on mobile/tablet upon opening a note
      const sidebar = document.getElementById('notes-sidebar');
      const backdrop = document.getElementById('notes-sidebar-backdrop');
      if (window.innerWidth <= 1024 && sidebar && !sidebar.classList.contains('collapsed')) {
        sidebar.classList.add('collapsed');
        if (backdrop) backdrop.classList.remove('is-open');
      }

      // Update Topbar
      const breadcrumbTitle = document.getElementById('breadcrumb-page-title');
      const breadcrumbIcon = document.getElementById('breadcrumb-page-icon');
      const activeDisplayTitle = (note.title && note.title.trim().length > 0 && note.title !== 'Untitled' && note.title !== 'New page' && note.title !== 'Halaman baru')
        ? note.title
        : this.getUntitledPlaceholder();
      if (breadcrumbTitle) breadcrumbTitle.textContent = activeDisplayTitle;
      if (breadcrumbIcon) breadcrumbIcon.textContent = note.icon || '📄';

      // Favorite button
      const favBtn = document.getElementById('btn-favorite-note');
      if (favBtn) {
        favBtn.classList.toggle('active', !!note.favorite);
        const star = favBtn.querySelector('svg');
        if (star) {
          star.setAttribute('fill', note.favorite ? '#f59e0b' : 'none');
          star.setAttribute('stroke', note.favorite ? '#f59e0b' : 'currentColor');
        }
      }

      // Title & Icon
      const titleInput = document.getElementById('page-title-input');
      const iconBtn = document.getElementById('page-icon-btn');
      if (titleInput) titleInput.value = note.title || '';
      if (iconBtn) iconBtn.textContent = note.icon || '📄';

      // Cover banner
      const coverBanner = document.getElementById('page-cover-banner');
      if (coverBanner) {
        if (note.cover) {
          coverBanner.style.backgroundImage = `url(${note.cover})`;
          coverBanner.classList.add('has-cover');
        } else {
          coverBanner.style.backgroundImage = 'none';
          coverBanner.classList.remove('has-cover');
        }
      }

      // Properties: CREATION DATE MATCHING WHEN USER MADE THE NOTE
      const createdDateEl = document.getElementById('prop-created-date');
      const folderTagEl = document.getElementById('prop-folder-tag');
      if (createdDateEl) {
        const rawDate = note.createdAt || note.updatedAt || new Date().toISOString();
        const d = new Date(rawDate);
        const formattedDate = !isNaN(d.getTime())
          ? d.toLocaleDateString(this.getLocale(), { month: 'short', day: 'numeric', year: 'numeric' })
          : new Date().toLocaleDateString(this.getLocale(), { month: 'short', day: 'numeric', year: 'numeric' });
        createdDateEl.textContent = formattedDate;
        createdDateEl.title = !isNaN(d.getTime()) ? `${this.isId() ? 'Dibuat pada' : 'Created on'} ${d.toLocaleString(this.getLocale())}` : '';
      }
      if (folderTagEl) {
        folderTagEl.textContent = (note.folder === 'Private' || !note.folder)
          ? (this.isId() ? 'Pribadi' : 'Private')
          : note.folder;
      }

      // Last edited time
      this.updateEditedTimestamp(note.updatedAt);

      // Render Blocks - Guarantee at least 1 editable block exists
      if (!note.blocks || !Array.isArray(note.blocks) || note.blocks.length === 0) {
        note.blocks = [{ id: 'b_' + Date.now(), type: 'p', text: '' }];
      }
      this.renderBlocks(note.blocks);

      // Check if page is empty (show/hide starter chips)
      this.evaluateEmptyStarterChips();

      // Re-render sidebar so that Recents list updates and active item is selected
      this.renderSidebar();
    }

    deleteNote(noteId, requireConfirm = true) {
      const confirmMsg = this.isId() ? 'Apakah Anda yakin ingin menghapus halaman ini?' : 'Are you sure you want to delete this page?';
      if (requireConfirm && !confirm(confirmMsg)) return;

      if (this.db) {
        this.db.deleteNote(noteId);
      }
      this.notes = this.notes.filter(n => n.id !== noteId);
      this.renderSidebar();

      if (this.currentNoteId === noteId) {
        if (this.notes.length > 0) {
          this.openNote(this.notes[0].id);
        } else {
          this.createNewNote('Untitled');
        }
      }
    }

    updateEditedTimestamp(isoDate) {
      const el = document.getElementById('note-edited-time');
      if (!el) return;
      const isId = this.isId();

      if (!isoDate) {
        el.textContent = isId ? 'Baru saja diedit' : 'Edited just now';
        return;
      }

      const diffMs = Date.now() - new Date(isoDate).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) {
        el.textContent = isId ? 'Baru saja diedit' : 'Edited just now';
      } else if (diffMins < 60) {
        el.textContent = isId ? `Diedit ${diffMins} mnt lalu` : `Edited ${diffMins}m ago`;
      } else if (diffHours < 24) {
        el.textContent = isId ? `Diedit ${diffHours} jam lalu` : `Edited ${diffHours}h ago`;
      } else {
        el.textContent = isId ? `Diedit ${diffDays} hari lalu` : `Edited ${diffDays}d ago`;
      }
    }

    /* ==========================================================================
       BLOCK CANVAS RENDERING & INTERACTIVE EDITING
       ========================================================================== */
    renderBlocks(blocks) {
      const container = document.getElementById('notes-blocks-canvas');
      if (!container) return;

      container.innerHTML = '';

      if (!blocks || blocks.length === 0) {
        blocks = [{ id: 'b_' + Date.now(), type: 'p', text: '' }];
      }

      blocks.forEach((block, index) => {
        const blockEl = this.createBlockElement(block, index);
        container.appendChild(blockEl);
      });
    }

    createBlockElement(block, index = 0) {
      const el = document.createElement('div');
      el.className = `note-block block-${block.type || 'p'} ${block.checked ? 'completed' : ''}`;
      el.dataset.blockId = block.id;
      el.dataset.blockType = block.type || 'p';

      const isEmpty = !(block.text && String(block.text).trim().length > 0);
      const emptyClass = isEmpty ? ' is-empty' : '';

      let innerContent = '';

      const isId = this.isId();
      if (block.type === 'todo') {
        innerContent = `
          <button type="button" class="todo-checkbox ${block.checked ? 'checked' : ''}" aria-label="Toggle task">
            ${block.checked ? '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>' : ''}
          </button>
          <div class="block-content${emptyClass}" contenteditable="true" data-placeholder="${isId ? 'Tugas to-do' : 'To-do item'}">${this.escapeHtml(block.text || '')}</div>
        `;
      } else if (block.type === 'number') {
        innerContent = `
          <span class="block-number-label">${index + 1}.</span>
          <div class="block-content${emptyClass}" contenteditable="true" data-placeholder="${isId ? 'Daftar bernomor' : 'List item'}">${this.escapeHtml(block.text || '')}</div>
        `;
      } else if (block.type === 'callout') {
        innerContent = `
          <div class="callout-icon">${block.icon || '💡'}</div>
          <div class="block-content${emptyClass}" contenteditable="true" data-placeholder="${isId ? 'Teks sorotan' : 'Callout text'}">${this.escapeHtml(block.text || '')}</div>
        `;
      } else if (block.type === 'code') {
        innerContent = `
          <div class="code-header">
            <span>JavaScript / Code</span>
            <button type="button" class="code-copy-btn">${isId ? 'Salin kode' : 'Copy code'}</button>
          </div>
          <div class="block-content${emptyClass}" contenteditable="true" data-placeholder="${isId ? '// Tulis kode di sini' : '// Write code here'}">${this.escapeHtml(block.text || '')}</div>
        `;
      } else if (block.type === 'today-date') {
        const dateStr = block.text || new Date().toLocaleDateString(this.getLocale(), { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        innerContent = `
          <div class="note-date-chip" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.35rem 0.75rem; background: var(--notion-hover); border: 1px solid var(--notion-border); border-radius: 6px; font-family: var(--font-mono); font-size: 0.8rem; color: var(--accent-cyan, #06b6d4);">
            <span>📅</span>
            <div class="block-content" contenteditable="true" data-placeholder="Date">${this.escapeHtml(dateStr)}</div>
          </div>
        `;
      } else if (block.type === 'table') {
        innerContent = `
          <div class="notes-table-wrap" style="width: 100%; overflow-x: auto; margin: 4px 0;">
            <table class="notes-table-grid">
              <thead>
                <tr>
                  <th contenteditable="true">${this.escapeHtml(block.headers?.[0] || 'Topic / Task')}</th>
                  <th contenteditable="true">${this.escapeHtml(block.headers?.[1] || 'Status')}</th>
                  <th contenteditable="true">${this.escapeHtml(block.headers?.[2] || 'Priority')}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td contenteditable="true">${this.escapeHtml(block.rows?.[0]?.[0] || 'Strategic Roadmap')}</td>
                  <td contenteditable="true">${this.escapeHtml(block.rows?.[0]?.[1] || 'In Progress')}</td>
                  <td contenteditable="true">${this.escapeHtml(block.rows?.[0]?.[2] || 'Q2 Deep Work')}</td>
                </tr>
                <tr>
                  <td contenteditable="true">${this.escapeHtml(block.rows?.[1]?.[0] || 'Team Alignment')}</td>
                  <td contenteditable="true">${this.escapeHtml(block.rows?.[1]?.[1] || 'Planned')}</td>
                  <td contenteditable="true">${this.escapeHtml(block.rows?.[1]?.[2] || 'Q3 Delegate')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        `;
      } else if (block.type === 'calendar-event') {
        const title = block.text || 'Calendar Event';
        const time = block.eventTime || '09:00 - 10:30';
        const date = block.eventDate || new Date().toISOString().split('T')[0];
        const prio = block.priority || 'Q2';
        innerContent = `
          <div class="note-cal-event-info">
            <div class="note-cal-event-title">${this.escapeHtml(title)}</div>
            <div class="note-cal-event-meta">
              <span>📅 ${date}</span>
              <span>⏰ ${time}</span>
              <span style="color: var(--accent-cyan, #06b6d4); font-weight: 700;">[${prio}]</span>
            </div>
          </div>
          <a href="calendar.html" class="note-cal-event-btn" title="View in Aethera Calendar">Open in Calendar &rarr;</a>
        `;
      } else if (block.type === 'matrix') {
        innerContent = `
          <div class="note-block block-matrix-grid">
            <div class="matrix-quad-box q1">
              <span class="matrix-quad-title">Q1: Urgent &amp; Important</span>
              <div class="block-content" contenteditable="true" data-placeholder="Add critical deadlines...">${this.escapeHtml(block.q1 || '• Critical deadline / submission')}</div>
            </div>
            <div class="matrix-quad-box q2">
              <span class="matrix-quad-title">Q2: Deep Work &amp; Strategic</span>
              <div class="block-content" contenteditable="true" data-placeholder="Add focus goals...">${this.escapeHtml(block.q2 || '• Architecture & deep study')}</div>
            </div>
            <div class="matrix-quad-box q3">
              <span class="matrix-quad-title">Q3: Delegate &amp; Sync</span>
              <div class="block-content" contenteditable="true" data-placeholder="Add meetings/chores...">${this.escapeHtml(block.q3 || '• Team standup & sync')}</div>
            </div>
            <div class="matrix-quad-box q4">
              <span class="matrix-quad-title">Q4: Wellness &amp; Personal</span>
              <div class="block-content" contenteditable="true" data-placeholder="Add recovery/rest...">${this.escapeHtml(block.q4 || '• Workout & recovery')}</div>
            </div>
          </div>
        `;
      } else if (block.type === 'divider') {
        innerContent = `<div class="divider-line"></div>`;
      } else {
        // p, h1, h2, h3, bullet, quote
        const placeholder = block.type === 'h1' ? (isId ? 'Judul 1' : 'Heading 1') :
          block.type === 'h2' ? (isId ? 'Judul 2' : 'Heading 2') :
            block.type === 'h3' ? (isId ? 'Judul 3' : 'Heading 3') :
              block.type === 'quote' ? (isId ? 'Kutipan' : 'Quote') :
                block.type === 'bullet' ? (isId ? 'Daftar berpoin' : 'List item') : (isId ? "Ketik '/' untuk perintah atau mulai menulis..." : "Type '/' for commands or start writing...");

        innerContent = `<div class="block-content${emptyClass}" contenteditable="true" data-placeholder="${placeholder}">${this.escapeHtml(block.text || '')}</div>`;
      }

      el.innerHTML = innerContent;
      this.attachBlockListeners(el);
      return el;
    }

    attachBlockListeners(blockEl) {
      const content = blockEl.querySelector('.block-content');
      const checkbox = blockEl.querySelector('.todo-checkbox');
      const copyBtn = blockEl.querySelector('.code-copy-btn');

      // Clicking on block's surrounding whitespace/margin focuses the editable area
      blockEl.addEventListener('click', (e) => {
        if (e.target === blockEl || e.target.classList.contains('block-handle')) {
          if (content) {
            this.focusContentEditable(content);
          }
        }
      });

      // Checkbox click
      if (checkbox) {
        checkbox.addEventListener('click', () => {
          const isChecked = !checkbox.classList.contains('checked');
          checkbox.classList.toggle('checked', isChecked);
          blockEl.classList.toggle('completed', isChecked);
          checkbox.innerHTML = isChecked ? '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>' : '';
          this.triggerAutoSave();
        });
      }

      // Code copy button
      if (copyBtn && content) {
        copyBtn.addEventListener('click', () => {
          navigator.clipboard.writeText(content.innerText).then(() => {
            copyBtn.textContent = 'Copied!';
            setTimeout(() => { copyBtn.textContent = 'Copy code'; }, 2000);
          });
        });
      }

      if (!content) return;

      const updateEmptyState = () => {
        const raw = (content.innerText || content.textContent || '')
          .replace(/[\r\n\u00A0]/g, '')
          .trim();
        if (raw.length === 0) {
          content.classList.add('is-empty');
        } else {
          content.classList.remove('is-empty');
        }
        this.evaluateEmptyStarterChips();
      };

      // Track active block and ensure empty placeholder status is current
      content.addEventListener('focus', () => {
        this.activeBlockEl = blockEl;
        updateEmptyState();
      });

      content.addEventListener('blur', () => {
        updateEmptyState();
      });

      content.addEventListener('keyup', () => {
        updateEmptyState();
      });

      // Keydown handling for Enter, Backspace, Arrow navigation, and Slash command
      content.addEventListener('keydown', (e) => {
        const slashMenu = document.getElementById('notion-slash-menu');
        const isSlashOpen = slashMenu && slashMenu.style.display !== 'none';

        if (isSlashOpen) {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.navigateSlashMenu(1);
            return;
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.navigateSlashMenu(-1);
            return;
          } else if (e.key === 'Enter') {
            e.preventDefault();
            this.selectSlashMenuItem();
            return;
          } else if (e.key === 'Escape') {
            this.hideSlashMenu();
            return;
          }
        }

        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.handleEnterKey(blockEl);
        } else if (e.key === 'Backspace') {
          const raw = (content.innerText || content.textContent || '').replace(/[\r\n\u00A0]/g, '').trim();
          if (raw === '') {
            this.handleBackspaceKey(e, blockEl);
          }
        }
      });

      // Input event to catch '/' slash command, toggle empty state, and trigger auto-save
      content.addEventListener('input', () => {
        updateEmptyState();
        const text = content.innerText || '';
        if (text.includes('/')) {
          const slashMenu = document.getElementById('notion-slash-menu');
          if (!slashMenu || slashMenu.style.display === 'none') {
            this.showSlashMenu(content);
          }
          const query = text.substring(text.lastIndexOf('/') + 1);
          this.filterSlashMenu(query);
        } else {
          this.hideSlashMenu();
        }

        this.triggerAutoSave();
      });
    }

    handleEnterKey(currentBlockEl) {
      const type = currentBlockEl.dataset.blockType;
      let nextType = 'p';

      // Consecutive list continuation
      if (type === 'todo') nextType = 'todo';
      else if (type === 'bullet') nextType = 'bullet';
      else if (type === 'number') nextType = 'number';

      const newBlock = {
        id: 'b_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
        type: nextType,
        text: '',
        checked: false
      };

      const newBlockEl = this.createBlockElement(newBlock);
      currentBlockEl.after(newBlockEl);

      const nextContent = newBlockEl.querySelector('.block-content');
      if (nextContent) {
        this.focusContentEditable(nextContent);
      }

      this.evaluateEmptyStarterChips();
      this.triggerAutoSave();
    }

    handleBackspaceKey(e, currentBlockEl) {
      const type = currentBlockEl.dataset.blockType;
      const prevBlockEl = currentBlockEl.previousElementSibling;

      if (type !== 'p') {
        // Convert back to paragraph 'p'
        e.preventDefault();
        this.convertBlockType(currentBlockEl, 'p');
        return;
      }

      // If already 'p' and there is a previous block, remove current block
      if (prevBlockEl) {
        e.preventDefault();
        currentBlockEl.remove();
        const prevContent = prevBlockEl.querySelector('.block-content');
        if (prevContent) {
          this.focusContentEditable(prevContent, true);
        }
        this.evaluateEmptyStarterChips();
        this.triggerAutoSave();
      }
    }

    convertBlockType(blockEl, newType, extraData = {}) {
      const content = blockEl.querySelector('.block-content');
      const text = (extraData.text !== undefined)
        ? extraData.text
        : (content ? content.innerText.replace(/\/.*$/, '').trim() : '');

      const updatedBlock = {
        id: blockEl.dataset.blockId || ('b_' + Date.now()),
        type: newType,
        text: text,
        icon: extraData.icon || (newType === 'callout' ? '💡' : null),
        checked: false,
        ...extraData
      };

      const newEl = this.createBlockElement(updatedBlock);
      blockEl.replaceWith(newEl);

      const newContent = newEl.querySelector('.block-content');
      if (newContent) {
        newContent.focus();
      }

      this.hideSlashMenu();
      this.triggerAutoSave();
    }

    insertBlockFromMobile(type) {
      const container = document.getElementById('notes-blocks-canvas');
      if (!container) return;

      let targetEl = this.activeBlockEl;
      if (!targetEl || !document.contains(targetEl)) {
        const blocks = container.querySelectorAll('.note-block');
        targetEl = blocks.length > 0 ? blocks[blocks.length - 1] : null;
      }

      if (targetEl) {
        const content = targetEl.querySelector('.block-content');
        const isEmpty = !content || content.innerText.trim() === '';
        if (isEmpty) {
          this.convertBlockType(targetEl, type === 'new-block' ? 'p' : type);
          return;
        }
      }

      const newBlock = {
        id: 'b_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
        type: type === 'new-block' ? 'p' : type,
        text: '',
        checked: false
      };
      const newBlockEl = this.createBlockElement(newBlock);
      if (targetEl) {
        targetEl.after(newBlockEl);
      } else {
        container.appendChild(newBlockEl);
      }

      const nextContent = newBlockEl.querySelector('.block-content');
      if (nextContent) {
        this.focusContentEditable(nextContent);
      }

      this.evaluateEmptyStarterChips();
      this.triggerAutoSave();
    }

    /* ==========================================================================
       SLASH COMMAND MENU (/)
       ========================================================================== */
    showSlashMenu(anchorEl) {
      const menu = document.getElementById('notion-slash-menu');
      if (!menu) return;

      if (window.innerWidth <= 768) {
        menu.style.position = 'fixed';
        menu.style.left = '50%';
        menu.style.transform = 'translateX(-50%)';
        menu.style.top = 'max(60px, 14vh)';
        menu.style.width = 'min(320px, 94vw)';
      } else {
        const rect = (anchorEl && typeof anchorEl.getBoundingClientRect === 'function')
          ? anchorEl.getBoundingClientRect()
          : { bottom: 100, left: 240, top: 100 };
        menu.style.transform = '';
        menu.style.position = 'fixed';
        const menuWidth = 280;
        const menuHeight = 320;
        let top = rect.bottom + 6;
        let left = rect.left;
        if (top + menuHeight > window.innerHeight) {
          top = Math.max(10, rect.top - menuHeight - 6);
        }
        if (left + menuWidth > window.innerWidth) {
          left = Math.max(10, window.innerWidth - menuWidth - 16);
        }
        menu.style.top = `${top}px`;
        menu.style.left = `${left}px`;
        menu.style.width = '';
      }
      menu.style.display = 'flex';

      this.slashMenuIndex = 0;
      this.filterSlashMenu('');
    }

    hideSlashMenu() {
      const menu = document.getElementById('notion-slash-menu');
      if (menu) menu.style.display = 'none';
    }

    filterSlashMenu(query) {
      const menu = document.getElementById('notion-slash-menu');
      if (!menu) return;

      const items = menu.querySelectorAll('.slash-menu-item');
      this.slashFilteredItems = [];

      items.forEach(item => {
        const label = (item.querySelector('.slash-item-label')?.textContent || '').toLowerCase();
        const desc = (item.querySelector('.slash-item-desc')?.textContent || '').toLowerCase();
        const q = query.toLowerCase().trim();

        if (!q || label.includes(q) || desc.includes(q)) {
          item.style.display = 'flex';
          this.slashFilteredItems.push(item);
        } else {
          item.style.display = 'none';
        }
      });

      this.highlightSlashMenuItem();
    }

    navigateSlashMenu(delta) {
      if (this.slashFilteredItems.length === 0) return;
      this.slashMenuIndex = (this.slashMenuIndex + delta + this.slashFilteredItems.length) % this.slashFilteredItems.length;
      this.highlightSlashMenuItem();
    }

    highlightSlashMenuItem() {
      this.slashFilteredItems.forEach((item, i) => {
        item.classList.toggle('selected', i === this.slashMenuIndex);
        if (i === this.slashMenuIndex) {
          item.scrollIntoView({ block: 'nearest' });
        }
      });
    }

    async selectSlashMenuItem(explicitItem = null) {
      const selected = explicitItem || this.slashFilteredItems[this.slashMenuIndex];
      if (!selected || !this.activeBlockEl) return;

      const type = selected.dataset.blockType;
      this.hideSlashMenu();

      if (type === 'ai-draft') {
        this.runAiAssistance('draft');
      } else if (type === 'ai-summary') {
        this.runAiAssistance('summary');
      } else if (type === 'ai-actions') {
        this.runAiAssistance('actions');
      } else if (type === 'today-date') {
        const nowFormatted = new Date().toLocaleDateString(this.getLocale(), {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        this.convertBlockType(this.activeBlockEl, 'today-date', { text: nowFormatted });
      } else if (type === 'calendar-event') {
        const titlePrompt = this.isId() ? 'Judul acara kalender:' : 'Calendar event title:';
        const defaultTitle = 'Team & Project Sync';
        const title = window.prompt(titlePrompt, defaultTitle) || defaultTitle;
        const now = new Date().toISOString().split('T')[0];
        const newEvt = {
          title,
          date: now,
          startTime: '10:00',
          endTime: '11:00',
          category: 'work',
          priority: 'Q2',
          quadrant: 'Important, Not Urgent',
          notes: 'Created from Notes workspace slash command'
        };
        if (window.aetheraDB && typeof window.aetheraDB.saveCalendarEvent === 'function') {
          try {
            await window.aetheraDB.saveCalendarEvent(newEvt);
          } catch (e) {
            console.warn('[Notes] saveCalendarEvent error:', e);
          }
        }
        this.convertBlockType(this.activeBlockEl, 'calendar-event', {
          text: title,
          eventDate: now,
          eventTime: '10:00 - 11:00',
          priority: 'Q2'
        });
      } else if (type === 'matrix') {
        this.convertBlockType(this.activeBlockEl, 'matrix', {
          q1: '• Critical deadline / submission',
          q2: '• Architecture & deep study',
          q3: '• Team standup & sync',
          q4: '• Workout & recovery'
        });
      } else if (type === 'table') {
        this.convertBlockType(this.activeBlockEl, 'table', {
          headers: ['Topic / Task', 'Status', 'Priority'],
          rows: [
            ['Strategic Roadmap', 'In Progress', 'Q2 Deep Work'],
            ['Team Alignment', 'Planned', 'Q3 Delegate']
          ]
        });
      } else {
        this.convertBlockType(this.activeBlockEl, type);
      }
    }

    /* ==========================================================================
       FOCUS & CARET POSITIONING HELPERS
       ========================================================================== */
    focusContentEditable(el, atEnd = true) {
      if (!el) return;
      el.focus();
      try {
        const range = document.createRange();
        const sel = window.getSelection();
        if (el.childNodes.length > 0) {
          range.selectNodeContents(el);
          range.collapse(!atEnd);
        } else {
          range.setStart(el, 0);
          range.collapse(true);
        }
        sel.removeAllRanges();
        sel.addRange(range);
      } catch (err) {
        console.warn('[Notes] Caret positioning fallback:', err);
      }
    }

    focusFirstBlock() {
      const container = document.getElementById('notes-blocks-canvas');
      if (!container) return;

      let firstBlock = container.querySelector('.note-block');
      if (!firstBlock) {
        const newBlock = { id: 'b_' + Date.now(), type: 'p', text: '' };
        firstBlock = this.createBlockElement(newBlock, 0);
        container.appendChild(firstBlock);
      }

      const content = firstBlock.querySelector('.block-content');
      if (content) {
        this.focusContentEditable(content);
      }
    }

    focusLastOrNewBlock() {
      const container = document.getElementById('notes-blocks-canvas');
      if (!container) return;

      const blocks = container.querySelectorAll('.note-block');
      if (blocks.length === 0) {
        const newBlock = { id: 'b_' + Date.now(), type: 'p', text: '' };
        const newBlockEl = this.createBlockElement(newBlock, 0);
        container.appendChild(newBlockEl);
        const content = newBlockEl.querySelector('.block-content');
        this.focusContentEditable(content);
        return;
      }

      const lastBlock = blocks[blocks.length - 1];
      const lastContent = lastBlock.querySelector('.block-content');
      const lastText = (lastContent?.innerText || lastContent?.textContent || '')
        .replace(/[\r\n\u00A0]/g, '')
        .trim();

      if (lastText.length === 0 && lastContent) {
        this.focusContentEditable(lastContent);
      } else {
        const newBlock = {
          id: 'b_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
          type: 'p',
          text: ''
        };
        const newBlockEl = this.createBlockElement(newBlock, blocks.length);
        container.appendChild(newBlockEl);
        const content = newBlockEl.querySelector('.block-content');
        this.focusContentEditable(content);
        this.triggerAutoSave();
      }
    }

    /* ==========================================================================
       EMPTY STARTER ACTION CHIPS (MATCHING USER SCREENSHOT)
       ========================================================================== */
    evaluateEmptyStarterChips() {
      const starterBox = document.getElementById('empty-page-starter-actions');
      const blocksContainer = document.getElementById('notes-blocks-canvas');
      if (!starterBox || !blocksContainer) return;

      const blocks = blocksContainer.querySelectorAll('.note-block');
      let hasContent = false;

      blocks.forEach(b => {
        const text = (b.querySelector('.block-content')?.innerText || '')
          .replace(/[\r\n\u00A0]/g, '')
          .trim();
        if (text.length > 0) hasContent = true;
        if (b.dataset.blockType && b.dataset.blockType !== 'p') hasContent = true;
      });

      if (blocks.length > 1) hasContent = true;

      starterBox.style.display = hasContent ? 'none' : 'flex';
    }

    applyStarterTemplate(templateType) {
      if (!this.currentNoteId) return;

      let newBlocks = [];
      let newTitle = '';

      if (templateType === 'draft') {
        newTitle = 'Document Draft';
        newBlocks = [
          { id: 'b1', type: 'h1', text: 'Executive Summary' },
          { id: 'b2', type: 'p', text: 'Provide high-level context and overview of the initiative here...' },
          { id: 'b3', type: 'h2', text: 'Key Goals' },
          { id: 'b4', type: 'bullet', text: 'Accelerate cross-functional collaboration' },
          { id: 'b5', type: 'bullet', text: 'Eliminate friction between planning and execution' },
          { id: 'b6', type: 'h2', text: 'Next Steps' },
          { id: 'b7', type: 'todo', text: 'Circulate draft to team leads', checked: false }
        ];
      } else if (templateType === 'brainstorm') {
        newTitle = 'Brainstorming Session';
        newBlocks = [
          { id: 'b1', type: 'callout', text: 'Focus: How might we solve this challenge creatively?', icon: '💡' },
          { id: 'b2', type: 'h2', text: 'Wild Ideas' },
          { id: 'b3', type: 'bullet', text: 'Idea 1: Automated cross-device synchronization' },
          { id: 'b4', type: 'bullet', text: 'Idea 2: Instant schedule AI parsing' },
          { id: 'b5', type: 'h2', text: 'Top Candidates' },
          { id: 'b6', type: 'todo', text: 'Validate technical feasibility', checked: false }
        ];
      } else if (templateType === 'research') {
        newTitle = 'Research & Investigation';
        newBlocks = [
          { id: 'b1', type: 'h2', text: 'Hypothesis' },
          { id: 'b2', type: 'quote', text: 'A unified workspace improves flow state and reduces cognitive switching costs.' },
          { id: 'b3', type: 'h2', text: 'Findings' },
          { id: 'b4', type: 'bullet', text: 'Primary source evaluation complete' },
          { id: 'b5', type: 'bullet', text: 'Benchmark data shows 35% speed increase' },
          { id: 'b6', type: 'h2', text: 'References' },
          { id: 'b7', type: 'p', text: '1. Internal architecture documentation' }
        ];
      } else if (templateType === 'meeting') {
        newTitle = 'AI Meeting Notes';
        newBlocks = [
          { id: 'b1', type: 'callout', text: 'Participants: Engineering, Product, Design | Date: Today', icon: '📋' },
          { id: 'b2', type: 'h2', text: 'Key Decisions' },
          { id: 'b3', type: 'bullet', text: 'Approved Notion-style UX specification' },
          { id: 'b4', type: 'h2', text: 'Action Items' },
          { id: 'b5', type: 'todo', text: 'Deploy real-time sync endpoint to production', checked: false },
          { id: 'b6', type: 'todo', text: 'Verify cross-device session continuity', checked: true }
        ];
      } else if (templateType === 'database') {
        newTitle = 'Project Tracker';
        newBlocks = [
          { id: 'b1', type: 'h2', text: 'Active Deliverables' },
          { id: 'b2', type: 'todo', text: 'Frontend UI layout alignment', checked: true },
          { id: 'b3', type: 'todo', text: 'Multi-device account data synchronization', checked: true },
          { id: 'b4', type: 'todo', text: 'Performance testing & KaTeX verification', checked: false },
          { id: 'b5', type: 'code', text: '// Data Model\nconst task = { id: 1, title: "Notes Feature", status: "Done" };' }
        ];
      } else {
        newTitle = 'Quick Note';
        newBlocks = [
          { id: 'b1', type: 'p', text: 'Start jotting down thoughts...' }
        ];
      }

      const note = this.notes.find(n => n.id === this.currentNoteId);
      if (note) {
        if (!note.title || note.title === 'New page' || note.title === 'Untitled') {
          note.title = newTitle;
          const titleInput = document.getElementById('page-title-input');
          if (titleInput) titleInput.value = newTitle;
          const breadcrumbTitle = document.getElementById('breadcrumb-page-title');
          if (breadcrumbTitle) breadcrumbTitle.textContent = newTitle;
        }

        note.blocks = newBlocks;
        this.renderBlocks(newBlocks);
        this.evaluateEmptyStarterChips();
        this.triggerAutoSave();
        this.renderSidebar();
        this.focusFirstBlock();
      }
    }

    /* ==========================================================================
       AI ASSISTANT WRITING INTEGRATION
       ========================================================================== */
    async runAiAssistance(promptType = 'draft') {
      let prompt = '';
      if (promptType === 'draft') {
        const defaultPrompt = this.isId() ? 'Rangkuman ringkas dan 3 poin rencana kerja' : 'A concise overview and 3 strategic bullet points';
        prompt = window.prompt(this.isId() ? 'Apa yang ingin Anda tulis atau curah ide bersama AI?' : 'What would you like Aethera AI to write or brainstorm for this note?', defaultPrompt);
        if (!prompt) return;
      }

      const syncBadge = document.getElementById('sync-text');
      if (syncBadge) syncBadge.textContent = this.isId() ? 'AI Aethera sedang menganalisis...' : 'Aethera AI generating...';

      const currentNote = this.notes.find(n => n.id === this.currentNoteId);
      const noteTitle = currentNote?.title || 'Notes Document';
      const existingText = (currentNote?.blocks || []).map(b => b.text || '').filter(Boolean).join('\n');

      let output = '';
      try {
        let requestPrompt = '';
        if (promptType === 'summary') {
          requestPrompt = `Summarize the following note clearly with key takeaways and executive bullets:\nTitle: ${noteTitle}\nContent:\n${existingText || 'Quick notes'}`;
        } else if (promptType === 'actions') {
          requestPrompt = `Extract actionable checklist to-do items from this note:\nTitle: ${noteTitle}\nContent:\n${existingText || 'Daily plans'}`;
        } else {
          requestPrompt = `You are an expert Notion assistant. Write a clean, well-structured note based on this request: "${prompt}". Return 3-4 bullet points and a concluding takeaway.`;
        }

        const res = await fetch('/api/ai/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: requestPrompt,
            mode: 'concise'
          })
        });

        if (res.ok) {
          const data = await res.json();
          output = data.reply || data.text || '';
        }
      } catch (e) {
        console.warn('[Notes AI] Server proxy unreachable, activating local intelligence engine:', e);
      }

      // Robust fallback if AI proxy is offline or returns error
      if (!output) {
        if (promptType === 'summary') {
          output = this.isId()
            ? `💡 Ringkasan Catatan: ${noteTitle}\n- Tinjauan utama telah dirumuskan untuk meningkatkan fokus dan alur kerja.\n- Sasaran prioritas utama dijadwalkan untuk eksekusi terarah.\n- Kesimpulan: Pertahankan ritme kerja terstruktur dan sinkronkan dengan kalender.`
            : `💡 Executive Summary: ${noteTitle}\n- Core objectives synthesized to enhance cognitive focus and workflow.\n- High-priority milestones aligned for focused daily execution.\n- Key takeaway: Maintain structured work rhythm and review timeblocks in calendar.`;
        } else if (promptType === 'actions') {
          output = this.isId()
            ? `[ ] Tinjau draf dokumen dan finalisasi poin utama\n[ ] Sinkronkan jadwal dan blok waktu dengan Kalender\n[ ] Lakukan pemeriksaan kualitas sebelum pengiriman`
            : `[ ] Review document draft and finalize primary deliverables\n[ ] Sync schedule and hourly time blocks with Calendar\n[ ] Execute quality review before sign-off`;
        } else {
          output = this.isId()
            ? `## ${prompt}\n- Sasaran 1: Melakukan analisis mendalam dan pemetaan kebutuhan sistem.\n- Sasaran 2: Mengintegrasikan komponen kerja dengan prioritas Eisenhower.\n- Sasaran 3: Menyelesaikan deliverable sesuai tenggat waktu yang ditentukan.\nKesimpulan: Pelaksanaan bertahap menghasilkan produktivitas maksimal.`
            : `## ${prompt}\n- Milestone 1: Deep work architectural focus and requirements mapping.\n- Milestone 2: Streamlined integration of core deliverables with Eisenhower priority.\n- Milestone 3: Validation and automated sync across connected devices.\nKey takeaway: Consistent deliberate execution ensures optimal output.`;
        }
      }

      // Convert output lines into blocks
      const lines = output.split('\n').filter(l => l.trim().length > 0);
      const container = document.getElementById('notes-blocks-canvas');

      lines.forEach(line => {
        let type = 'p';
        let text = line.trim();

        if (text.startsWith('# ')) {
          type = 'h1';
          text = text.replace(/^#\s*/, '');
        } else if (text.startsWith('## ')) {
          type = 'h2';
          text = text.replace(/^##\s*/, '');
        } else if (text.startsWith('- ') || text.startsWith('* ')) {
          type = 'bullet';
          text = text.replace(/^[-*]\s*/, '');
        } else if (/^\d+\./.test(text)) {
          type = 'number';
          text = text.replace(/^\d+\.\s*/, '');
        } else if (text.startsWith('[ ] ') || text.startsWith('☑ ') || text.startsWith('[] ')) {
          type = 'todo';
          text = text.replace(/^(?:\[ \]|☑|\[\])\s*/, '');
        } else if (text.startsWith('💡 ')) {
          type = 'callout';
          text = text.replace(/^💡\s*/, '');
        }

        const blockObj = {
          id: 'b_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
          type,
          text
        };

        const blockEl = this.createBlockElement(blockObj);
        if (container) container.appendChild(blockEl);
      });

      this.hideSlashMenu();
      this.evaluateEmptyStarterChips();
      this.triggerAutoSave();
      if (syncBadge) syncBadge.textContent = this.isId() ? 'Tersinkronisasi ke cloud' : 'Synced to cloud';
    }

    /* ==========================================================================
       REAL-TIME MULTI-DEVICE CLOUD AUTO-SAVE
       ========================================================================== */
    triggerAutoSave() {
      const syncDot = document.getElementById('sync-dot');
      const syncText = document.getElementById('sync-text');

      if (syncDot) syncDot.classList.add('saving');
      if (syncText) syncText.textContent = this.isId() ? 'Menyimpan perubahan...' : 'Saving changes...';

      clearTimeout(this.saveDebounceTimer);
      this.saveDebounceTimer = setTimeout(() => {
        this.saveCurrentNote();
      }, 400);
    }

    saveCurrentNote() {
      if (!this.currentNoteId) {
        const titleInput = document.getElementById('page-title-input');
        const newTitle = titleInput ? titleInput.value.trim() : 'Untitled';
        const created = this.createNewNote(newTitle || 'Untitled');
        if (created) this.currentNoteId = created.id;
        return;
      }

      const note = this.notes.find(n => n.id === this.currentNoteId);
      if (!note) return;

      // Extract current title
      const titleInput = document.getElementById('page-title-input');
      const newTitle = titleInput ? titleInput.value.trim() || 'Untitled' : note.title;
      note.title = newTitle;

      // Update breadcrumb & sidebar
      const breadcrumbTitle = document.getElementById('breadcrumb-page-title');
      if (breadcrumbTitle) breadcrumbTitle.textContent = newTitle;

      // Extract all blocks from DOM
      const container = document.getElementById('notes-blocks-canvas');
      const blockEls = container ? container.querySelectorAll('.note-block') : [];
      const updatedBlocks = [];

      blockEls.forEach((el, index) => {
        const id = el.dataset.blockId || ('b_' + Date.now() + '_' + index);
        const type = el.dataset.blockType || 'p';
        const text = (el.querySelector('.block-content')?.innerText || '').trim();
        const checked = el.querySelector('.todo-checkbox')?.classList.contains('checked') || false;
        const icon = el.querySelector('.callout-icon')?.textContent || null;

        const blockData = { id, type, text, checked, icon };

        if (type === 'matrix') {
          blockData.q1 = el.querySelector('.matrix-quad-box.q1 .block-content')?.innerText || '• Critical deadline / submission';
          blockData.q2 = el.querySelector('.matrix-quad-box.q2 .block-content')?.innerText || '• Architecture & deep study';
          blockData.q3 = el.querySelector('.matrix-quad-box.q3 .block-content')?.innerText || '• Team standup & sync';
          blockData.q4 = el.querySelector('.matrix-quad-box.q4 .block-content')?.innerText || '• Workout & recovery';
        } else if (type === 'table') {
          blockData.headers = Array.from(el.querySelectorAll('table th')).map(th => th.innerText.trim());
          blockData.rows = Array.from(el.querySelectorAll('table tbody tr')).map(tr =>
            Array.from(tr.querySelectorAll('td')).map(td => td.innerText.trim())
          );
        } else if (type === 'calendar-event') {
          blockData.eventTitle = el.querySelector('.note-cal-event-title')?.textContent?.trim() || text;
          blockData.text = blockData.eventTitle;
          const metaSpans = el.querySelectorAll('.note-cal-event-meta span');
          if (metaSpans[0]) blockData.eventDate = metaSpans[0].textContent.replace('📅', '').trim();
          if (metaSpans[1]) blockData.eventTime = metaSpans[1].textContent.replace('⏰', '').trim();
          if (metaSpans[2]) blockData.priority = metaSpans[2].textContent.replace(/[\[\]]/g, '').trim();
        }

        updatedBlocks.push(blockData);
      });

      note.blocks = updatedBlocks;
      note.updatedAt = new Date().toISOString();
      if (!note.createdAt) {
        note.createdAt = note.updatedAt;
      }

      // Persist to user database (Local + Cloud Server)
      if (this.db && typeof this.db.saveNote === 'function') {
        this.db.saveNote(note);
      }

      this.updateEditedTimestamp(note.updatedAt);
      this.renderSidebar();

      const syncDot = document.getElementById('sync-dot');
      const syncText = document.getElementById('sync-text');

      if (syncDot) syncDot.classList.remove('saving');
      if (syncText) syncText.textContent = this.isId() ? 'Tersinkronisasi ke cloud' : 'Synced to cloud';
    }

    /* ==========================================================================
       EVENT BINDINGS & SHORTCUTS
       ========================================================================== */
    bindEvents() {
      // 1. Sidebar Toggle & Mobile Auto-Collapse
      const sidebar = document.getElementById('notes-sidebar');
      const collapseBtn = document.getElementById('sidebar-collapse-btn');
      const topbarToggleBtn = document.getElementById('topbar-toggle-sidebar');
      const mainArea = document.querySelector('.notes-main-area');
      const backdrop = document.getElementById('notes-sidebar-backdrop');

      const updateBackdrop = () => {
        if (!backdrop || !sidebar) return;
        const isOverlay = window.innerWidth <= 1024;
        const isOpen = !sidebar.classList.contains('collapsed');
        if (isOverlay && isOpen) {
          backdrop.classList.add('is-open');
        } else {
          backdrop.classList.remove('is-open');
        }
      };

      // Auto-collapse sidebar on mobile/tablet screen on initial load
      if (window.innerWidth <= 1024 && sidebar) {
        sidebar.classList.add('collapsed');
      }

      const toggleSidebar = () => {
        if (sidebar) {
          sidebar.classList.toggle('collapsed');
          updateBackdrop();
        }
      };

      if (collapseBtn) collapseBtn.addEventListener('click', toggleSidebar);
      if (topbarToggleBtn) topbarToggleBtn.addEventListener('click', toggleSidebar);
      if (backdrop) backdrop.addEventListener('click', () => {
        if (sidebar) {
          sidebar.classList.add('collapsed');
          updateBackdrop();
        }
      });

      // Mobile/Tablet: Close sidebar when tapping outside on canvas
      if (mainArea) {
        mainArea.addEventListener('click', (e) => {
          if (window.innerWidth <= 1024 && sidebar && !sidebar.classList.contains('collapsed')) {
            if (!e.target.closest('#topbar-toggle-sidebar') && !e.target.closest('#notes-sidebar')) {
              sidebar.classList.add('collapsed');
              updateBackdrop();
            }
          }
        });
      }

      // Keyboard shortcut Ctrl+\ to toggle sidebar
      window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === '\\') {
          e.preventDefault();
          toggleSidebar();
        }
      });

      // Mobile Quick Formatting & Command Bar
      const mobileFormatBar = document.getElementById('notes-mobile-format-bar');
      if (mobileFormatBar) {
        mobileFormatBar.querySelectorAll('.notes-mobile-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            const action = btn.dataset.action;
            if (action === 'slash') {
              const slashMenu = document.getElementById('notion-slash-menu');
              if (slashMenu && slashMenu.style.display === 'flex') {
                this.hideSlashMenu();
              } else {
                const anchor = this.activeBlockEl || document.querySelector('.note-block') || document.body;
                this.showSlashMenu(anchor);
              }
            } else if (action === 'ai-draft') {
              this.runAiAssistance('draft');
            } else if (action) {
              this.insertBlockFromMobile(action);
            }
          });
        });
      }

      // 2. Add New Page Buttons
      const addPrivateBtn = document.getElementById('btn-add-private-page');
      const footerAddBtn = document.getElementById('sidebar-add-page-footer-btn');

      if (addPrivateBtn) addPrivateBtn.addEventListener('click', () => this.createNewNote('Untitled'));
      if (footerAddBtn) footerAddBtn.addEventListener('click', () => this.createNewNote('Untitled'));

      // Keyboard shortcut Ctrl+J to toggle Aethera Chat
      window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'j') {
          e.preventDefault();
          if (window.openChatbot) {
            window.openChatbot();
          } else if (window.aetheraChatbot) {
            window.aetheraChatbot.toggleWindow();
          }
        }
      });

      // 3. Page Title Input changes & Enter navigation to canvas
      const titleInput = document.getElementById('page-title-input');
      if (titleInput) {
        titleInput.addEventListener('input', () => {
          this.triggerAutoSave();
        });
        titleInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === 'ArrowDown') {
            e.preventDefault();
            this.focusFirstBlock();
          }
        });
      }

      // 4. Page Emoji Icon selector
      const iconBtn = document.getElementById('page-icon-btn');
      if (iconBtn) {
        const emojis = ['📄', '💡', '📐', '📖', '💻', '🚀', '🔥', '✨', '⚡', '📊', '🛡️', '🎯'];
        iconBtn.addEventListener('click', () => {
          const current = iconBtn.textContent.trim();
          const nextIndex = (emojis.indexOf(current) + 1) % emojis.length;
          const nextEmoji = emojis[nextIndex];
          iconBtn.textContent = nextEmoji;

          const breadcrumbIcon = document.getElementById('breadcrumb-page-icon');
          if (breadcrumbIcon) breadcrumbIcon.textContent = nextEmoji;

          const note = this.notes.find(n => n.id === this.currentNoteId);
          if (note) {
            note.icon = nextEmoji;
            this.triggerAutoSave();
            this.renderSidebar();
          }
        });
      }

      // 5. Cover Banner Trigger & Removal
      const addCoverBtn = document.getElementById('btn-add-cover-trigger');
      const removeCoverBtn = document.getElementById('btn-remove-cover');
      const coverBanner = document.getElementById('page-cover-banner');

      const coverGradients = [
        'linear-gradient(135deg, #1e3a8a, #9333ea)',
        'linear-gradient(135deg, #065f46, #0284c7)',
        'linear-gradient(135deg, #831843, #ea580c)',
        'linear-gradient(135deg, #111827, #374151)'
      ];

      if (addCoverBtn && coverBanner) {
        addCoverBtn.addEventListener('click', () => {
          const randomCover = coverGradients[Math.floor(Math.random() * coverGradients.length)];
          coverBanner.style.background = randomCover;
          coverBanner.classList.add('has-cover');

          const note = this.notes.find(n => n.id === this.currentNoteId);
          if (note) {
            note.cover = randomCover;
            this.triggerAutoSave();
          }
        });
      }

      if (removeCoverBtn && coverBanner) {
        removeCoverBtn.addEventListener('click', () => {
          coverBanner.style.background = 'none';
          coverBanner.classList.remove('has-cover');

          const note = this.notes.find(n => n.id === this.currentNoteId);
          if (note) {
            note.cover = null;
            this.triggerAutoSave();
          }
        });
      }

      // 6. Favorite Star Button
      const favBtn = document.getElementById('btn-favorite-note');
      if (favBtn) {
        favBtn.addEventListener('click', () => {
          const note = this.notes.find(n => n.id === this.currentNoteId);
          if (!note) return;

          note.favorite = !note.favorite;
          favBtn.classList.toggle('active', note.favorite);
          const star = favBtn.querySelector('svg');
          if (star) {
            star.setAttribute('fill', note.favorite ? '#f59e0b' : 'none');
            star.setAttribute('stroke', note.favorite ? '#f59e0b' : 'currentColor');
          }
          this.triggerAutoSave();
        });
      }

      // 7. Share / Export Note Button
      const shareBtn = document.getElementById('btn-share-note');
      if (shareBtn) {
        shareBtn.addEventListener('click', () => {
          const note = this.notes.find(n => n.id === this.currentNoteId);
          if (!note) return;

          let md = `# ${note.title || 'Untitled'}\n\n`;
          (note.blocks || []).forEach(b => {
            if (b.type === 'h1') md += `# ${b.text}\n\n`;
            else if (b.type === 'h2') md += `## ${b.text}\n\n`;
            else if (b.type === 'h3') md += `### ${b.text}\n\n`;
            else if (b.type === 'todo') md += `- [${b.checked ? 'x' : ' '}] ${b.text}\n`;
            else if (b.type === 'bullet') md += `- ${b.text}\n`;
            else if (b.type === 'number') md += `1. ${b.text}\n`;
            else if (b.type === 'quote') md += `> ${b.text}\n\n`;
            else if (b.type === 'code') md += `\`\`\`\n${b.text}\n\`\`\`\n\n`;
            else md += `${b.text}\n\n`;
          });

          navigator.clipboard.writeText(md).then(() => {
            alert('Note markdown copied to clipboard! You can share it or paste it into any app.');
          }).catch(() => {
            alert('Markdown content:\n\n' + md);
          });
        });
      }

      // 8. Starter Template Chips
      document.querySelectorAll('.notion-starter-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          const template = chip.dataset.template;
          this.applyStarterTemplate(template);
        });
      });

      // 9. Slash Menu items click & prevent blur on mousedown
      const slashMenu = document.getElementById('notion-slash-menu');
      if (slashMenu) {
        slashMenu.addEventListener('mousedown', (e) => {
          e.preventDefault(); // Keep contenteditable focus intact
        });
        slashMenu.querySelectorAll('.slash-menu-item').forEach(item => {
          item.addEventListener('click', () => {
            this.selectSlashMenuItem(item);
          });
        });
      }

      // Hide slash menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!e.target.closest('#notion-slash-menu')) {
          this.hideSlashMenu();
        }
      });

      // 10. Ctrl + K Quick Search Modal
      const searchTriggerBtn = document.getElementById('sidebar-search-btn');
      const searchModalBackdrop = document.getElementById('notion-search-modal-backdrop');
      const searchInput = document.getElementById('modal-search-input');

      const openSearch = () => {
        if (searchModalBackdrop && searchInput) {
          searchModalBackdrop.style.display = 'flex';
          searchInput.value = '';
          this.renderSearchResults('');
          searchInput.focus();
        }
      };

      const closeSearch = () => {
        if (searchModalBackdrop) searchModalBackdrop.style.display = 'none';
      };

      if (searchTriggerBtn) searchTriggerBtn.addEventListener('click', openSearch);

      if (searchModalBackdrop) {
        searchModalBackdrop.addEventListener('click', (e) => {
          if (e.target === searchModalBackdrop) closeSearch();
        });
      }

      if (searchInput) {
        searchInput.addEventListener('input', () => {
          this.renderSearchResults(searchInput.value.trim());
        });
      }

      window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          openSearch();
        } else if (e.key === 'Escape' && searchModalBackdrop && searchModalBackdrop.style.display !== 'none') {
          closeSearch();
        }
      });

      // 11. Click Anywhere on Empty Canvas / Blank Area to Focus & Type Immediately
      const canvasScroll = document.getElementById('notes-canvas-scroll');
      const blocksCanvas = document.getElementById('notes-blocks-canvas');
      const pageContainer = typeof document.querySelector === 'function' ? document.querySelector('.notes-page-container') : null;

      const handleCanvasClick = (e) => {
        // Ignore clicks on explicit controls and buttons
        if (
          e.target.closest('#page-title-input') ||
          e.target.closest('.page-properties-bar') ||
          e.target.closest('#page-cover-banner') ||
          e.target.closest('#page-icon-btn') ||
          e.target.closest('.notion-starter-chip') ||
          e.target.closest('#notion-slash-menu') ||
          e.target.closest('.block-content') ||
          e.target.closest('.todo-checkbox') ||
          e.target.closest('.code-copy-btn')
        ) {
          return;
        }

        const clickedBlock = e.target.closest('.note-block');
        if (clickedBlock) {
          const content = clickedBlock.querySelector('.block-content');
          if (content) {
            this.focusContentEditable(content);
            return;
          }
        }

        this.focusLastOrNewBlock();
      };

      if (canvasScroll) canvasScroll.addEventListener('click', handleCanvasClick);
      if (blocksCanvas) blocksCanvas.addEventListener('click', handleCanvasClick);
      if (pageContainer) pageContainer.addEventListener('click', handleCanvasClick);
    }

    /* ==========================================================================
       SEARCH MODAL RESULTS
       ========================================================================== */
    renderSearchResults(query) {
      const resultsContainer = document.getElementById('modal-search-results');
      if (!resultsContainer) return;

      resultsContainer.innerHTML = '';
      const q = query.toLowerCase();

      const matched = this.notes.filter(n => {
        if (!q) return true;
        const titleMatch = (n.title || '').toLowerCase().includes(q);
        const blockMatch = (n.blocks || []).some(b => (b.text || '').toLowerCase().includes(q));
        return titleMatch || blockMatch;
      });

      if (matched.length === 0) {
        resultsContainer.innerHTML = `
          <div style="padding: 1rem; text-align: center; color: var(--notion-text-muted); font-size: 0.85rem;">
            No notes matching "${this.escapeHtml(query)}"
          </div>
        `;
        return;
      }

      matched.forEach(note => {
        const item = document.createElement('div');
        item.className = 'modal-search-item';

        let snippet = 'No extra text';
        const foundBlock = (note.blocks || []).find(b => b.text && b.text.trim().length > 0);
        if (foundBlock) snippet = foundBlock.text;

        item.innerHTML = `
          <span style="font-size: 1.1rem;">${note.icon || '📄'}</span>
          <div style="display: flex; flex-direction: column; min-width: 0;">
            <span class="modal-search-item-title">${this.escapeHtml(note.title || 'Untitled')}</span>
            <span class="modal-search-item-snippet">${this.escapeHtml(snippet)}</span>
          </div>
        `;

        item.addEventListener('click', () => {
          const searchModalBackdrop = document.getElementById('notion-search-modal-backdrop');
          if (searchModalBackdrop) searchModalBackdrop.style.display = 'none';
          this.openNote(note.id);
        });

        resultsContainer.appendChild(item);
      });
    }

    /* ==========================================================================
       THEME CONTROLLER
       Matches user's landing page theme preference (aethera-theme / aethera_theme)
       ========================================================================== */
    initTheme() {
      const toggleBtn = document.getElementById('theme-toggle-notes');

      const getLandingThemePreference = () => {
        return localStorage.getItem('aethera-theme') ||
               localStorage.getItem('aethera_theme') ||
               document.documentElement.getAttribute('data-theme') ||
               'dark';
      };

      const applyTheme = (theme, transition = false) => {
        const validated = theme === 'light' ? 'light' : 'dark';
        if (transition) {
          if (typeof window.triggerAetheraThemeTransition === 'function') {
            window.triggerAetheraThemeTransition(800);
          } else {
            document.documentElement.classList.add('theme-transitioning');
            setTimeout(() => document.documentElement.classList.remove('theme-transitioning'), 800);
          }
        }
        document.documentElement.setAttribute('data-theme', validated);
        this.updateThemeIcons(validated);
        // Persist across both keys to guarantee landing page, calendar, news & notes remain synced
        localStorage.setItem('aethera-theme', validated);
        localStorage.setItem('aethera_theme', validated);
      };

      // 1. Match landing page theme immediately on load
      const preferredTheme = getLandingThemePreference();
      applyTheme(preferredTheme, false);

      // 2. Sidebar theme toggle button
      if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
          const current = document.documentElement.getAttribute('data-theme') || 'dark';
          const next = current === 'dark' ? 'light' : 'dark';
          applyTheme(next, true);
        });
      }

      // 3. Real-time multi-tab sync when landing page theme is changed
      window.addEventListener('storage', (e) => {
        if (e.key === 'aethera-theme' || e.key === 'aethera_theme') {
          if (e.newValue && (e.newValue === 'light' || e.newValue === 'dark')) {
            applyTheme(e.newValue, true);
          }
        }
      });
    }

    updateThemeIcons(theme) {
      const sunIcon = document.getElementById('theme-icon-sun');
      const moonIcon = document.getElementById('theme-icon-moon');
      if (!sunIcon || !moonIcon) return;

      // Allow CSS class [data-theme] to drive smooth 0.85s rotating transform and opacity morph
      sunIcon.style.display = '';
      moonIcon.style.display = '';
    }

    escapeHtml(str) {
      return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }
  }

  // Auto-instantiate on DOM load and assign global reference
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.aetheraNotesApp = new AetheraNotesApp();
    });
  } else {
    window.aetheraNotesApp = new AetheraNotesApp();
  }
})();
