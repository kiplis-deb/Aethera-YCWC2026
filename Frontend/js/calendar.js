/**
 * AETHERA - INTERACTIVE CALENDAR & SCHEDULE PLANNER ENGINE
 * High-performance, multi-view productivity workspace connected
 * bi-directionally to Aethera Cortex AI Schedule & Task Planner.
 */

class AetheraCalendarApp {
  constructor() {
    this.currentDate = new Date();
    this.selectedDate = this.formatDate(this.currentDate);
    this.currentView = 'month'; // 'month' | 'week' | 'matrix' | 'agenda'
    this.categoryFilter = 'all';
    this.events = [];
    this.isGeneratingAI = false;

    // Gemini API Configuration (Backend AI Proxy protects API key)
    this.defaultApiKey = "";
    this.isServerProxyActive = false;
    this.apiKey = localStorage.getItem('aethera_gemini_api_key') || "";
    this.selectedModel = localStorage.getItem('aethera_selected_model') || 'gemini-flash-lite-latest';
    if (this.selectedModel.includes('2.5') || this.selectedModel.includes('2.0') || this.selectedModel.includes('1.5') || this.selectedModel.includes('3.5') || this.selectedModel.includes('3.8')) {
      this.selectedModel = 'gemini-flash-lite-latest';
    }
    this.modelEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.selectedModel}:generateContent`;

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
        }
      }
    } catch (e) {}
  }

  getApiKey() {
    let key = this.cleanApiKey(localStorage.getItem('aethera_gemini_api_key') || this.apiKey || '');
    if (!key) {
      try {
        const fbConfig = JSON.parse(localStorage.getItem('aethera_firebase_cloud_config') || '{}');
        if (fbConfig && fbConfig.apiKey) {
          key = this.cleanApiKey(fbConfig.apiKey);
        }
      } catch (e) {}
    }
    return key || '';
  }

  hasValidCloudKey() {
    if (this.isServerProxyActive) return true;
    const key = this.getApiKey();
    return typeof key === 'string' && key.length >= 15;
  }

  getLocale() {
    return (window.aetheraI18n && window.aetheraI18n.getLanguage() === 'id') ? 'id-ID' : 'en-US';
  }

  isId() {
    return !!(window.aetheraI18n && window.aetheraI18n.getLanguage() === 'id');
  }

  async init() {
    this.initTheme();
    this.initURLParams();
    this.bindDOMEvents();
    this.initDayDetailModalEvents();
    this.initSlashCommands();

    // Wait for database ready
    if (window.aetheraDB) {
      await window.aetheraDB.ready();
    }

    await this.loadEvents();
    this.render();
    this.updateSyncStatusIndicator();

    // Listen for auth or database updates
    window.addEventListener('aethera:auth-change', () => {
      this.onAuthChanged();
      this.updateSyncStatusIndicator();
    });
    window.addEventListener('aethera:auth-changed', () => {
      this.onAuthChanged();
      this.updateSyncStatusIndicator();
    });
    window.addEventListener('aethera:sync-start', () => {
      const pill = document.getElementById('cal-sync-status-indicator');
      if (pill) pill.classList.add('is-syncing');
      const textEl = document.getElementById('cal-sync-status-text');
      if (textEl && window.aetheraDB && window.aetheraDB.isLoggedIn()) {
        textEl.textContent = this.isId() ? 'Menyinkronkan...' : 'Syncing...';
      }
    });
    window.addEventListener('aethera:sync-end', () => {
      const pill = document.getElementById('cal-sync-status-indicator');
      if (pill) pill.classList.remove('is-syncing');
      this.updateSyncStatusIndicator();
    });
    window.addEventListener('aethera:calendar-event-saved', () => this.refreshData());
    window.addEventListener('aethera:calendar-event-updated', () => this.refreshData());
    window.addEventListener('aethera:calendar-event-deleted', () => this.refreshData());
    window.addEventListener('aethera:calendar-batch-saved', () => this.refreshData());
    window.addEventListener('aethera:calendar-events-batch-saved', () => this.refreshData());
    window.addEventListener('aethera:calendar-events-cleared', () => this.refreshData());
    window.addEventListener('aethera:calendar-synced', () => this.refreshData());

    // Instant reactivity to platform language changes
    window.addEventListener('aethera:language-change', () => {
      this.render();
      this.syncCustomSelects();
      this.updateSyncStatusIndicator();
      const modal = document.getElementById('cal-day-detail-modal');
      if (modal && modal.classList.contains('is-open')) {
        this.renderDayDetailModal(this.selectedDate);
      }
    });
  }

  /* --------------------------------------------------------------------------
     THEME & URL STATE CONTROLLER
     -------------------------------------------------------------------------- */
  initTheme() {
    const savedTheme = localStorage.getItem('aethera-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        if (typeof window.triggerAetheraThemeTransition === 'function') {
          window.triggerAetheraThemeTransition(800);
        } else {
          document.documentElement.classList.add('theme-transitioning');
          setTimeout(() => document.documentElement.classList.remove('theme-transitioning'), 800);
        }
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('aethera-theme', next);
        localStorage.setItem('aethera_theme', next);
      });
    }
  }

  initURLParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('view')) {
      const v = params.get('view');
      if (['month', 'week', 'matrix', 'agenda'].includes(v)) {
        this.currentView = v;
      }
    }
    if (params.has('date')) {
      const d = params.get('date');
      if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
        this.selectedDate = d;
        this.currentDate = new Date(d + 'T12:00:00');
      }
    }
    // Auto-trigger AI modal if requested
    if (params.get('action') === 'plan') {
      setTimeout(() => this.openAIModal(), 350);
    }
  }

  async onAuthChanged() {
    await this.loadEvents();
    this.render();
    this.updateSyncStatusIndicator();
    const modal = document.getElementById('cal-day-detail-modal');
    if (modal && modal.classList.contains('is-open')) {
      this.renderDayDetailModal(this.selectedDate);
    }
  }

  async refreshData() {
    await this.loadEvents();
    this.render();
    this.updateSyncStatusIndicator();
    const modal = document.getElementById('cal-day-detail-modal');
    if (modal && modal.classList.contains('is-open')) {
      this.renderDayDetailModal(this.selectedDate);
    }
  }

  /* --------------------------------------------------------------------------
     EVENT DATA LAYER
     -------------------------------------------------------------------------- */
  async loadEvents() {
    if (window.aetheraDB) {
      try {
        const rawEvents = await window.aetheraDB.getCalendarEvents();
        // Clean professional slate: reject any artificial demo/seed items
        this.events = (rawEvents || []).filter(e => e && e.id && !e.id.startsWith('evt_seed_') && !e.id.startsWith('test_evt_'));
      } catch (err) {
        console.warn('[CalendarApp] Error loading events:', err);
        this.events = [];
      }
    } else {
      this.events = [];
    }
  }

  getFilteredEvents() {
    if (this.categoryFilter === 'all') {
      return this.events;
    }
    return this.events.filter(e => e.category === this.categoryFilter);
  }

  getEventsForDate(dateStr) {
    return this.getFilteredEvents().filter(e => e.date === dateStr);
  }

  /* --------------------------------------------------------------------------
     DOM EVENT BINDINGS
     -------------------------------------------------------------------------- */
  bindDOMEvents() {
    // 1. Navigation Prev / Next / Today
    document.getElementById('cal-prev-btn')?.addEventListener('click', () => this.navigatePrev());
    document.getElementById('cal-next-btn')?.addEventListener('click', () => this.navigateNext());
    document.getElementById('cal-today-btn')?.addEventListener('click', () => this.jumpToToday());

    // 2. Mini Calendar Prev / Next
    document.getElementById('cal-mini-prev')?.addEventListener('click', () => {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
      this.render();
    });
    document.getElementById('cal-mini-next')?.addEventListener('click', () => {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
      this.render();
    });

    // 3. View Mode Switcher
    const tabBtns = document.querySelectorAll('.cal-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const view = btn.dataset.view;
        if (view) {
          this.switchView(view);
        }
      });
    });

    // 4. Category Filter Items
    const filterItems = document.querySelectorAll('.cal-filter-item');
    filterItems.forEach(item => {
      item.addEventListener('click', () => {
        filterItems.forEach(f => f.classList.remove('active'));
        item.classList.add('active');
        this.categoryFilter = item.dataset.category || 'all';
        this.render();
      });
    });

    // 5. Modals & Add Event Buttons
    document.getElementById('cal-header-add-event-btn')?.addEventListener('click', () => this.openEventModal());
    document.getElementById('cal-inspector-add-btn')?.addEventListener('click', () => this.openEventModal(null, this.selectedDate));
    document.getElementById('cal-matrix-add-btn')?.addEventListener('click', () => this.openEventModal());
    document.getElementById('cal-modal-close')?.addEventListener('click', () => this.closeEventModal());
    document.getElementById('cal-modal-cancel-btn')?.addEventListener('click', () => this.closeEventModal());

    // Event Form Submit
    document.getElementById('cal-event-form')?.addEventListener('submit', (e) => this.handleEventFormSubmit(e));

    // Date header in inspector opens Day Details
    document.getElementById('cal-inspector-date')?.addEventListener('click', () => {
      this.openDayDetailModal(this.selectedDate);
    });

    // Custom Rounded Glass Select Dropdowns
    this.initCustomSelects();

    // 6. Quick Add Task in Inspector
    const quickInput = document.getElementById('cal-quick-input');
    const quickBtn = document.getElementById('cal-quick-submit-btn');
    const submitQuick = () => {
      if (!quickInput) return;
      const text = quickInput.value.trim();
      if (!text) return;
      this.handleQuickAddTask(text);
      quickInput.value = '';
    };

    quickBtn?.addEventListener('click', submitQuick);
    quickInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        submitQuick();
      }
    });

    // 7. AI Schedule Assistant Modal
    document.getElementById('cal-quick-ai-btn')?.addEventListener('click', () => this.openAIModal());
    document.getElementById('cal-ai-modal-close')?.addEventListener('click', () => this.closeAIModal());
    document.getElementById('cal-ai-modal-cancel')?.addEventListener('click', () => this.closeAIModal());
    document.getElementById('ai-generate-schedule-btn')?.addEventListener('click', () => this.generateAISchedule());
    document.getElementById('cal-ai-confirm-import-btn')?.addEventListener('click', () => this.confirmImportAISchedule());

    // 8. Clean Workspace / Reset Calendar Button
    document.getElementById('cal-sidebar-clear-btn')?.addEventListener('click', async () => {
      const confirmMsg = this.isId()
        ? 'Hapus semua acara dari kalender ini untuk memulai dari awal? Tindakan ini tidak dapat dibatalkan.'
        : 'Clear all events from this calendar for a clean slate? This action cannot be undone.';
      if (confirm(confirmMsg)) {
        if (window.aetheraDB) {
          await window.aetheraDB.clearAllCalendarEvents();
        }
        await this.loadEvents();
        this.render();
      }
    });
  }

  /* --------------------------------------------------------------------------
     NAVIGATION & VIEW CONTROLLERS
     -------------------------------------------------------------------------- */
  navigatePrev() {
    if (this.currentView === 'month' || this.currentView === 'matrix') {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    } else if (this.currentView === 'week') {
      this.currentDate.setDate(this.currentDate.getDate() - 7);
    } else {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    }
    this.render();
  }

  navigateNext() {
    if (this.currentView === 'month' || this.currentView === 'matrix') {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    } else if (this.currentView === 'week') {
      this.currentDate.setDate(this.currentDate.getDate() + 7);
    } else {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    }
    this.render();
  }

  jumpToToday() {
    this.currentDate = new Date();
    this.selectedDate = this.formatDate(this.currentDate);
    this.render();
  }

  switchView(viewName) {
    this.currentView = viewName;
    document.querySelectorAll('.cal-tab-btn').forEach(btn => {
      const active = btn.dataset.view === viewName;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    // Update visibility of view containers
    document.getElementById('cal-month-view').style.display = viewName === 'month' ? 'flex' : 'none';
    document.getElementById('cal-week-view').style.display = viewName === 'week' ? 'flex' : 'none';
    document.getElementById('cal-matrix-view').style.display = viewName === 'matrix' ? 'flex' : 'none';
    document.getElementById('cal-agenda-view').style.display = viewName === 'agenda' ? 'flex' : 'none';

    this.render();
  }

  /* --------------------------------------------------------------------------
     MAIN RENDER DISPATCHER
     -------------------------------------------------------------------------- */
  render() {
    this.updateHeaderTitle();
    this.renderMiniCalendar();
    this.renderInspector();
    this.updateProductivityHUD();

    switch (this.currentView) {
      case 'month':
        this.renderMonthView();
        break;
      case 'week':
        this.renderWeekView();
        break;
      case 'matrix':
        this.renderMatrixView();
        break;
      case 'agenda':
        this.renderAgendaView();
        break;
    }
  }

  updateHeaderTitle() {
    const titleEl = document.getElementById('cal-current-date-title');
    if (!titleEl) return;
    const locale = this.getLocale();

    if (this.currentView === 'week') {
      const weekDays = this.getWeekDays(this.currentDate);
      const start = weekDays[0];
      const end = weekDays[6];
      const startMonth = start.toLocaleDateString(locale, { month: 'short' });
      const endMonth = end.toLocaleDateString(locale, { month: 'short' });
      if (startMonth === endMonth) {
        titleEl.textContent = `${startMonth} ${start.getDate()} – ${end.getDate()}, ${start.getFullYear()}`;
      } else {
        titleEl.textContent = `${startMonth} ${start.getDate()} – ${endMonth} ${end.getDate()}, ${start.getFullYear()}`;
      }
    } else {
      titleEl.textContent = this.currentDate.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
    }
  }

  /* --------------------------------------------------------------------------
     1. MONTH VIEW RENDERER
     -------------------------------------------------------------------------- */
  renderMonthView() {
    const container = document.getElementById('cal-month-cells');
    if (!container) return;
    container.innerHTML = '';

    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Monday-indexed offset (0 = Monday, 6 = Sunday)
    let startDayOfWeek = firstDay.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6;

    const daysInMonth = lastDay.getDate();
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    const todayStr = this.formatDate(new Date());

    // 1. Trailing days from previous month
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const dayNum = prevMonthLastDay - i;
      const cellDate = new Date(year, month - 1, dayNum);
      const dateStr = this.formatDate(cellDate);
      const cell = this.createDayCell(dayNum, dateStr, true, todayStr);
      container.appendChild(cell);
    }

    // 2. Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const cellDate = new Date(year, month, day);
      const dateStr = this.formatDate(cellDate);
      const cell = this.createDayCell(day, dateStr, false, todayStr);
      container.appendChild(cell);
    }

    // 3. Leading days for next month to complete 5 or 6 weeks (35 or 42 cells)
    const totalCells = container.children.length;
    const targetTotal = totalCells > 35 ? 42 : 35;
    const remaining = targetTotal - totalCells;

    for (let day = 1; day <= remaining; day++) {
      const cellDate = new Date(year, month + 1, day);
      const dateStr = this.formatDate(cellDate);
      const cell = this.createDayCell(day, dateStr, true, todayStr);
      container.appendChild(cell);
    }
  }

  createDayCell(dayNum, dateStr, isOtherMonth, todayStr) {
    const cell = document.createElement('div');
    cell.className = `cal-cell${isOtherMonth ? ' other-month' : ''}`;
    if (dateStr === todayStr) cell.classList.add('is-today');
    if (dateStr === this.selectedDate) cell.classList.add('is-selected');

    const dayEvents = this.getEventsForDate(dateStr);

    cell.innerHTML = `
      <div class="cal-cell-top">
        <span class="cal-date-number">${dayNum}</span>
        <div style="display: flex; align-items: center; gap: 4px;">
          ${dayEvents.length > 0 ? `<span class="cal-cell-event-count">${dayEvents.length}</span>` : ''}
          <button type="button" class="cal-cell-add-btn" title="Add event on this date" aria-label="Add event">+</button>
        </div>
      </div>
      <div class="cal-cell-events"></div>
    `;

    const eventsContainer = cell.querySelector('.cal-cell-events');
    const maxChips = 3;
    dayEvents.slice(0, maxChips).forEach(evt => {
      const chip = document.createElement('div');
      chip.className = `cal-event-chip ${evt.category || 'work'}${evt.completed ? ' completed' : ''}`;
      chip.title = `${evt.startTime} - ${evt.endTime}: ${evt.title}`;
      chip.innerHTML = `
        <span class="cal-chip-time">${evt.startTime}</span>
        <span class="cal-chip-title">${this.escapeHtml(evt.title)}</span>
      `;
      chip.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openEventModal(evt);
      });
      eventsContainer.appendChild(chip);
    });

    if (dayEvents.length > maxChips) {
      const more = document.createElement('div');
      more.className = 'cal-more-chip';
      more.textContent = this.isId() ? `+${dayEvents.length - maxChips} lainnya` : `+${dayEvents.length - maxChips} more`;
      eventsContainer.appendChild(more);
    }

    cell.querySelector('.cal-cell-add-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.selectedDate = dateStr;
      this.openEventModal(null, dateStr);
    });

    cell.addEventListener('click', () => {
      this.selectedDate = dateStr;
      document.querySelectorAll('.cal-cell').forEach(c => c.classList.remove('is-selected'));
      cell.classList.add('is-selected');
      this.renderInspector();
      this.openDayDetailModal(dateStr);
    });

    cell.addEventListener('dblclick', () => {
      this.selectedDate = dateStr;
      this.openEventModal(null, dateStr);
    });

    return cell;
  }

  /* --------------------------------------------------------------------------
     2. WEEK VIEW TIME-BLOCKING RENDERER (08:00 - 22:00)
     -------------------------------------------------------------------------- */
  renderWeekView() {
    const headerContainer = document.getElementById('cal-week-headers');
    const gridContainer = document.getElementById('cal-week-grid');
    if (!headerContainer || !gridContainer) return;

    const weekDays = this.getWeekDays(this.currentDate);
    const todayStr = this.formatDate(new Date());

    // 1. Build Day Column Headers
    headerContainer.innerHTML = `
      <div style="font-family: var(--font-mono); font-size: 0.65rem; color: var(--text-muted); display:flex; align-items:center; justify-content:center;">
        ${this.isId() ? 'WAKTU' : 'TIME'}
      </div>
    `;

    weekDays.forEach(day => {
      const dateStr = this.formatDate(day);
      const isToday = dateStr === todayStr;
      const isSelected = dateStr === this.selectedDate;

      const colTitle = document.createElement('div');
      colTitle.className = `cal-week-col-title${isToday ? ' is-today' : ''}${isSelected ? ' is-selected' : ''}`;
      colTitle.style.cursor = 'pointer';
      colTitle.innerHTML = `
        <span class="cal-week-col-name">${day.toLocaleDateString(this.getLocale(), { weekday: 'short' })}</span>
        <span class="cal-week-col-date">${day.getDate()}</span>
      `;
      colTitle.addEventListener('click', () => {
        this.selectedDate = dateStr;
        this.render();
        this.openDayDetailModal(dateStr);
      });
      headerContainer.appendChild(colTitle);
    });

    // 2. Build Hourly Time Grid (08:00 to 21:00 = 14 hours)
    gridContainer.innerHTML = '';
    const startHour = 8;
    const endHour = 22;
    const totalHours = endHour - startHour;
    const slotHeight = 60; // px per hour

    // Left Time Label Column
    const timeCol = document.createElement('div');
    timeCol.className = 'cal-time-col';
    for (let h = startHour; h < endHour; h++) {
      const slot = document.createElement('div');
      slot.className = 'cal-time-slot-label';
      slot.textContent = `${String(h).padStart(2, '0')}:00`;
      timeCol.appendChild(slot);
    }
    gridContainer.appendChild(timeCol);

    // 7 Day Columns
    weekDays.forEach(day => {
      const dateStr = this.formatDate(day);
      const dayCol = document.createElement('div');
      dayCol.className = 'cal-week-day-col';
      dayCol.dataset.date = dateStr;

      // Background hourly grid lines
      for (let h = startHour; h < endHour; h++) {
        const line = document.createElement('div');
        line.className = 'cal-week-slot-line';
        dayCol.appendChild(line);
      }

      // Event Time-blocks for this day
      const dayEvents = this.getEventsForDate(dateStr);
      dayEvents.forEach(evt => {
        const startMins = this.timeToMinutes(evt.startTime || '09:00');
        const endMins = this.timeToMinutes(evt.endTime || '10:00');
        const gridStartMins = startHour * 60;

        // Calculate offset and duration in pixels
        const top = Math.max(0, ((startMins - gridStartMins) / 60) * slotHeight);
        const durationMins = Math.max(30, endMins - startMins);
        const height = Math.max(26, (durationMins / 60) * slotHeight - 4);

        const block = document.createElement('div');
        block.className = `cal-time-block cal-event-chip ${evt.category || 'work'}${evt.completed ? ' completed' : ''}`;
        block.style.top = `${top}px`;
        block.style.height = `${height}px`;
        block.innerHTML = `
          <div class="cal-block-title">${this.escapeHtml(evt.title)}</div>
          <div class="cal-block-time">${evt.startTime} – ${evt.endTime}</div>
        `;
        block.addEventListener('click', (e) => {
          e.stopPropagation();
          this.openEventModal(evt);
        });
        dayCol.appendChild(block);
      });

      // Click to create event on that day and hour
      dayCol.addEventListener('click', (e) => {
        if (e.target === dayCol || e.target.classList.contains('cal-week-slot-line')) {
          this.selectedDate = dateStr;
          const rect = dayCol.getBoundingClientRect();
          const clickY = e.clientY - rect.top;
          const clickedHour = Math.min(Math.max(Math.floor(clickY / slotHeight) + startHour, startHour), endHour - 1);
          const startStr = `${String(clickedHour).padStart(2, '0')}:00`;
          const endStr = `${String(Math.min(clickedHour + 1, 23)).padStart(2, '0')}:00`;
          this.openEventModal(null, dateStr, null, startStr, endStr);
        }
      });

      gridContainer.appendChild(dayCol);
    });
  }

  /* --------------------------------------------------------------------------
     3. EISENHOWER 4-QUADRANT MATRIX VIEW RENDERER
     -------------------------------------------------------------------------- */
  renderMatrixView() {
    const q1List = document.getElementById('matrix-list-q1');
    const q2List = document.getElementById('matrix-list-q2');
    const q3List = document.getElementById('matrix-list-q3');
    const q4List = document.getElementById('matrix-list-q4');

    if (!q1List || !q2List || !q3List || !q4List) return;

    q1List.innerHTML = '';
    q2List.innerHTML = '';
    q3List.innerHTML = '';
    q4List.innerHTML = '';

    const events = this.getFilteredEvents();

    events.forEach(evt => {
      const q = (evt.priority || 'Q2').toUpperCase();
      let targetList = q2List;
      if (q === 'Q1') targetList = q1List;
      else if (q === 'Q3') targetList = q3List;
      else if (q === 'Q4') targetList = q4List;

      const item = document.createElement('div');
      item.className = 'cal-quadrant-item';
      item.innerHTML = `
        <div class="cal-quadrant-item-left">
          <div class="cal-item-check${evt.completed ? ' checked' : ''}" title="Mark task completed">
            ${evt.completed ? `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5"><polyline points="20 6 9 17 4 12"/></svg>` : ''}
          </div>
          <span class="cal-item-text${evt.completed ? ' done' : ''}">${this.escapeHtml(evt.title)}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span class="cal-item-time-badge">${evt.date.substring(5)} ${evt.startTime}</span>
          <button class="cal-task-delete-btn" title="Delete task" aria-label="Delete">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      `;

      item.querySelector('.cal-item-check').addEventListener('click', async (e) => {
        e.stopPropagation();
        await this.toggleEventCompleted(evt.id, !evt.completed);
      });

      item.querySelector('.cal-task-delete-btn').addEventListener('click', async (e) => {
        e.stopPropagation();
        await this.deleteEvent(evt.id);
      });

      item.addEventListener('click', () => this.openEventModal(evt));
      targetList.appendChild(item);
    });

    // Empty states with clean, professional quadrant design
    const isId = this.isId();
    const quadrantMeta = [
      {
        list: q1List,
        quadrant: 'Q1',
        title: isId ? 'Tidak Ada Krisis Mendesak' : 'No Urgent Crises',
        desc: isId ? 'Tenggat waktu mendesak & keadaan darurat muncul di sini' : 'Pressing deadlines & emergencies appear here',
        btnText: isId ? '+ Tambah ke Q1' : '+ Add to Q1',
        icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
      },
      {
        list: q2List,
        quadrant: 'Q2',
        title: isId ? 'Fokus & Pertumbuhan' : 'Deep Work & Growth',
        desc: isId ? 'Perencanaan strategis, belajar & proyek penting' : 'Strategic planning, study & high-impact projects',
        btnText: isId ? '+ Tambah ke Q2' : '+ Add to Q2',
        icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>'
      },
      {
        list: q3List,
        quadrant: 'Q3',
        title: isId ? 'Tanpa Gangguan Mendesak' : 'No Urgent Interruptions',
        desc: isId ? 'Tugas delegasi, sinkronisasi cepat & tugas berkala' : 'Delegated tasks, quick syncs & batch items',
        btnText: isId ? '+ Tambah ke Q3' : '+ Add to Q3',
        icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>'
      },
      {
        list: q4List,
        quadrant: 'Q4',
        title: isId ? 'Daftar Bersih' : 'Backlog Clear',
        desc: isId ? 'Pemeliharaan rutin & pemulihan pribadi' : 'Routine maintenance & personal recharge',
        btnText: isId ? '+ Tambah ke Q4' : '+ Add to Q4',
        icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>'
      }
    ];

    quadrantMeta.forEach(({ list, quadrant, title, desc, btnText, icon }) => {
      if (list.children.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'cal-quadrant-empty-state';
        empty.innerHTML = `
          <div class="cal-quadrant-empty-icon">${icon}</div>
          <div class="cal-quadrant-empty-title">${title}</div>
          <div class="cal-quadrant-empty-desc">${desc}</div>
          <button type="button" class="cal-quadrant-quick-add-btn">${btnText}</button>
        `;
        empty.querySelector('.cal-quadrant-quick-add-btn').addEventListener('click', (e) => {
          e.stopPropagation();
          this.openEventModal(null, this.selectedDate, quadrant);
        });
        list.appendChild(empty);
      }
    });
  }

  /* --------------------------------------------------------------------------
     4. AGENDA STREAM VIEW RENDERER
     -------------------------------------------------------------------------- */
  renderAgendaView() {
    const container = document.getElementById('cal-agenda-stream-container');
    if (!container) return;
    container.innerHTML = '';

    const events = this.getFilteredEvents();
    const isId = this.isId();
    if (events.length === 0) {
      container.innerHTML = `
        <div class="cal-agenda-empty-state">
          <div class="cal-agenda-empty-icon-wrap">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
          <h3 class="cal-agenda-empty-title">${isId ? 'Jadwal Anda Bersih' : 'Your Schedule is Clean'}</h3>
          <p class="cal-agenda-empty-desc">${isId ? 'Tidak ada acara atau tugas terjadwal. Klik di bawah untuk menjadwalkan acara atau biarkan Asisten Cortex AI merencanakan hari Anda secara otomatis.' : 'No events or tasks scheduled. Click below to schedule an event or let the Cortex AI Assistant plan your day automatically.'}</p>
          <div class="cal-agenda-empty-actions">
            <button type="button" id="agenda-empty-add-btn" class="cal-btn-add-event">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              <span>${isId ? 'Jadwalkan Acara Baru' : 'Schedule New Event'}</span>
            </button>
            <button type="button" id="agenda-empty-ai-btn" class="btn-ai-plan-today" style="width: auto; padding: 0.5rem 1.15rem;">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              <span>${isId ? 'Rencanakan Otomatis dengan AI' : 'Auto-Plan with AI'}</span>
            </button>
          </div>
        </div>
      `;
      document.getElementById('agenda-empty-add-btn')?.addEventListener('click', () => this.openEventModal());
      document.getElementById('agenda-empty-ai-btn')?.addEventListener('click', () => this.openAIModal());
      return;
    }

    // Group events by date
    const groups = {};
    events.forEach(evt => {
      if (!groups[evt.date]) groups[evt.date] = [];
      groups[evt.date].push(evt);
    });

    const sortedDates = Object.keys(groups).sort();
    const todayStr = this.formatDate(new Date());

    sortedDates.forEach(dateStr => {
      const groupEl = document.createElement('div');
      groupEl.className = 'cal-agenda-group';

      const d = new Date(dateStr + 'T12:00:00');
      const isToday = dateStr === todayStr;

      groupEl.innerHTML = `
        <div class="cal-agenda-date-heading" style="cursor: pointer;" title="${isId ? 'Klik untuk melihat semua acara pada tanggal ini' : 'Click to view all events on this date'}">
          <span>${d.toLocaleDateString(this.getLocale(), { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}</span>
          ${isToday ? `<span class="cal-agenda-date-badge">${isId ? 'HARI INI' : 'TODAY'}</span>` : ''}
        </div>
        <div class="cal-agenda-items" style="display: flex; flex-direction: column; gap: 0.5rem;"></div>
      `;

      groupEl.querySelector('.cal-agenda-date-heading')?.addEventListener('click', () => {
        this.selectedDate = dateStr;
        this.openDayDetailModal(dateStr);
      });

      const itemsContainer = groupEl.querySelector('.cal-agenda-items');
      groups[dateStr].forEach(evt => {
        const item = document.createElement('div');
        item.className = 'cal-agenda-item';
        item.innerHTML = `
          <div style="display: flex; align-items: center; gap: 0.85rem;">
            <div class="cal-item-check${evt.completed ? ' checked' : ''}">
              ${evt.completed ? `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5"><polyline points="20 6 9 17 4 12"/></svg>` : ''}
            </div>
            <div>
              <div style="font-size: 0.88rem; font-weight: 600; color: var(--text-primary);" class="${evt.completed ? 'cal-item-text done' : ''}">
                ${this.escapeHtml(evt.title)}
              </div>
              <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 2px;">
                ${evt.startTime} – ${evt.endTime} • <span style="text-transform: capitalize;">${evt.category || 'Work'}</span>
                ${evt.notes ? ` • ${this.escapeHtml(evt.notes)}` : ''}
              </div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <span class="cal-event-chip ${evt.category || 'work'}" style="font-size: 0.68rem; padding: 0.15rem 0.5rem;">
              ${evt.priority || 'Q2'}
            </span>
            <button class="cal-task-delete-btn" title="Delete">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
            </button>
          </div>
        `;

        item.querySelector('.cal-item-check').addEventListener('click', async (e) => {
          e.stopPropagation();
          await this.toggleEventCompleted(evt.id, !evt.completed);
        });

        item.querySelector('.cal-task-delete-btn').addEventListener('click', async (e) => {
          e.stopPropagation();
          await this.deleteEvent(evt.id);
        });

        item.addEventListener('click', () => this.openEventModal(evt));
        itemsContainer.appendChild(item);
      });

      container.appendChild(groupEl);
    });
  }

  /* --------------------------------------------------------------------------
     MINI CALENDAR & RIGHT INSPECTOR
     -------------------------------------------------------------------------- */
  renderMiniCalendar() {
    const grid = document.getElementById('cal-mini-grid');
    const title = document.getElementById('cal-mini-title');
    if (!grid || !title) return;

    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    title.textContent = this.currentDate.toLocaleDateString(this.getLocale(), { month: 'short', year: 'numeric' });

    const dayLabels = this.isId() ? ['S', 'S', 'R', 'K', 'J', 'S', 'M'] : ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    grid.innerHTML = dayLabels.map(l => `<div class="cal-mini-day-label">${l}</div>`).join('');

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    let startDayOfWeek = firstDay.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6;

    const daysInMonth = lastDay.getDate();
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const todayStr = this.formatDate(new Date());

    // Trailing days
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const dNum = prevMonthLastDay - i;
      const cell = document.createElement('div');
      cell.className = 'cal-mini-day other-month';
      cell.textContent = dNum;
      grid.appendChild(cell);
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const dDate = new Date(year, month, d);
      const dStr = this.formatDate(dDate);
      const isToday = dStr === todayStr;
      const isSelected = dStr === this.selectedDate;
      const hasEvents = this.events.some(e => e.date === dStr);

      const cell = document.createElement('div');
      cell.className = `cal-mini-day${isToday ? ' is-today' : ''}${isSelected ? ' is-selected' : ''}${hasEvents ? ' has-events' : ''}`;
      cell.textContent = d;
      cell.addEventListener('click', () => {
        this.selectedDate = dStr;
        this.currentDate = new Date(year, month, d);
        this.render();
        this.openDayDetailModal(dStr);
      });
      grid.appendChild(cell);
    }
  }

  renderInspector() {
    const dateLabel = document.getElementById('cal-inspector-date');
    const tasksList = document.getElementById('cal-inspector-tasks');
    if (!dateLabel || !tasksList) return;

    const d = new Date(this.selectedDate + 'T12:00:00');
    dateLabel.textContent = d.toLocaleDateString(this.getLocale(), { weekday: 'short', month: 'short', day: 'numeric' });

    tasksList.innerHTML = '';
    const dayEvents = this.getEventsForDate(this.selectedDate);
    const isId = this.isId();

    if (dayEvents.length === 0) {
      tasksList.innerHTML = `
        <div class="cal-inspector-empty-card">
          <div class="cal-inspector-empty-icon-wrap">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg>
          </div>
          <div class="cal-inspector-empty-title">${isId ? 'Jadwal Bersih' : 'Schedule Clear'}</div>
          <div class="cal-inspector-empty-desc">${isId ? `Tidak ada acara terjadwal untuk ${d.toLocaleDateString(this.getLocale(), { month: 'short', day: 'numeric' })}.` : `No events scheduled for ${d.toLocaleDateString([], { month: 'short', day: 'numeric' })}.`}</div>
          <button type="button" class="cal-inspector-empty-add-btn" id="inspector-empty-add-btn">
            ${isId ? '+ Jadwalkan Acara' : '+ Schedule Event'}
          </button>
        </div>
      `;
      document.getElementById('inspector-empty-add-btn')?.addEventListener('click', () => this.openEventModal(null, this.selectedDate));
      return;
    }

    dayEvents.forEach(evt => {
      const card = document.createElement('div');
      card.className = 'cal-inspector-task-card';
      card.innerHTML = `
        <div class="cal-task-card-header">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <div class="cal-item-check${evt.completed ? ' checked' : ''}" title="Toggle Complete">
              ${evt.completed ? `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5"><polyline points="20 6 9 17 4 12"/></svg>` : ''}
            </div>
            <span class="cal-task-card-title${evt.completed ? ' cal-item-text done' : ''}">${this.escapeHtml(evt.title)}</span>
          </div>
          <button class="cal-task-delete-btn" title="Delete">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
          </button>
        </div>
        <div class="cal-task-card-footer">
          <span style="font-family: var(--font-mono); font-size: 0.68rem; color: var(--text-muted);">
            ${evt.startTime} – ${evt.endTime}
          </span>
          <span class="cal-event-chip ${evt.category || 'work'}" style="font-size: 0.65rem; padding: 0.15rem 0.45rem;">
            ${evt.priority || 'Q2'}
          </span>
        </div>
      `;

      card.querySelector('.cal-item-check').addEventListener('click', async (e) => {
        e.stopPropagation();
        await this.toggleEventCompleted(evt.id, !evt.completed);
      });

      card.querySelector('.cal-task-delete-btn').addEventListener('click', async (e) => {
        e.stopPropagation();
        await this.deleteEvent(evt.id);
      });

      card.addEventListener('click', () => this.openEventModal(evt));
      tasksList.appendChild(card);
    });
  }

  updateProductivityHUD() {
    const ratioEl = document.getElementById('cal-tasks-completed-ratio');
    const ringVal = document.getElementById('cal-progress-ring-val');
    const pctLabel = document.getElementById('cal-progress-pct-label');
    const deepworkHoursEl = document.getElementById('cal-deepwork-hours');

    // Count categories
    const countAll = this.events.length;
    const countDeep = this.events.filter(e => e.category === 'deep-work').length;
    const countMeeting = this.events.filter(e => e.category === 'meeting').length;
    const countStudy = this.events.filter(e => e.category === 'study').length;
    const countDeadline = this.events.filter(e => e.category === 'deadline').length;
    const countPersonal = this.events.filter(e => e.category === 'personal').length;

    const setBadge = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    setBadge('count-cat-all', countAll);
    setBadge('count-cat-deep-work', countDeep);
    setBadge('count-cat-meeting', countMeeting);
    setBadge('count-cat-study', countStudy);
    setBadge('count-cat-deadline', countDeadline);
    setBadge('count-cat-personal', countPersonal);

    // Productivity metrics for selected date
    const dayEvents = this.events.filter(e => e.date === this.selectedDate);
    const totalDay = dayEvents.length;
    const completedDay = dayEvents.filter(e => e.completed).length;
    const pct = totalDay > 0 ? Math.round((completedDay / totalDay) * 100) : 0;
    const isId = this.isId();

    if (ratioEl) {
      if (totalDay === 0) {
        ratioEl.textContent = isId ? 'Jadwal Bersih' : 'Schedule Clear';
      } else {
        ratioEl.textContent = isId ? `${completedDay} / ${totalDay} Selesai (${pct}%)` : `${completedDay} / ${totalDay} Done (${pct}%)`;
      }
    }
    if (pctLabel) {
      pctLabel.textContent = `${pct}%`;
    }

    if (ringVal) {
      const circ = 2 * Math.PI * 22; // radius 22 => ~138.23
      const offset = totalDay === 0 ? circ : circ - (pct / 100) * circ;
      ringVal.style.strokeDasharray = `${circ}`;
      ringVal.style.strokeDashoffset = `${offset}`;
    }

    // Deep work hours
    let deepMins = 0;
    dayEvents.filter(e => e.category === 'deep-work').forEach(e => {
      deepMins += Math.max(0, this.timeToMinutes(e.endTime) - this.timeToMinutes(e.startTime));
    });
    const hrs = (deepMins / 60).toFixed(1);
    if (deepworkHoursEl) {
      if (totalDay === 0) {
        deepworkHoursEl.textContent = isId ? 'Tidak ada tugas hari ini' : 'No tasks today';
      } else {
        deepworkHoursEl.textContent = isId ? `${hrs} jam Fokus Mendalam` : `${hrs} hrs Deep Work`;
      }
    }
  }

  /* --------------------------------------------------------------------------
     EVENT MUTATION OPERATIONS
     -------------------------------------------------------------------------- */
  async handleQuickAddTask(rawText) {
    // Check if time is in the string (e.g. "2pm Meeting" or "14:00 Sync")
    let startTime = '09:00';
    let endTime = '10:00';
    let title = rawText;

    const match = rawText.match(/^(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)\s*(?:-|to)?\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)?\s*(.*)$/i);
    if (match) {
      const parseHour = (str) => {
        const m = str.trim().match(/^(\d{1,2}):?(\d{2})?\s*(am|pm)?$/i);
        if (!m) return '09:00';
        let h = parseInt(m[1], 10);
        const mins = m[2] || '00';
        const ampm = m[3] ? m[3].toLowerCase() : null;
        if (ampm === 'pm' && h < 12) h += 12;
        if (ampm === 'am' && h === 12) h = 0;
        return `${String(h).padStart(2, '0')}:${mins}`;
      };

      if (match[1]) startTime = parseHour(match[1]);
      if (match[2]) {
        endTime = parseHour(match[2]);
      } else {
        const [hh, mm] = startTime.split(':').map(Number);
        endTime = `${String((hh + 1) % 24).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
      }
      if (match[3] && match[3].trim().length > 1) {
        title = match[3].trim();
      }
    }

    let cat = 'work';
    const lower = title.toLowerCase();
    if (/deep|code|dev|focus/i.test(lower)) cat = 'deep-work';
    else if (/meet|sync|call/i.test(lower)) cat = 'meeting';
    else if (/study|exam|homework/i.test(lower)) cat = 'study';
    else if (/due|deadline/i.test(lower)) cat = 'deadline';
    else if (/gym|lunch|break/i.test(lower)) cat = 'personal';

    const newEvent = {
      title,
      date: this.selectedDate,
      startTime,
      endTime,
      category: cat,
      priority: cat === 'deep-work' ? 'Q2' : 'Q1',
      completed: false
    };

    if (window.aetheraDB) {
      await window.aetheraDB.saveCalendarEvent(newEvent);
    }
  }

  async toggleEventCompleted(eventId, completed) {
    if (window.aetheraDB) {
      await window.aetheraDB.updateCalendarEvent(eventId, { completed });
    }
  }

  async deleteEvent(eventId) {
    const confirmMsg = this.isId() ? 'Hapus acara ini dari kalender Anda?' : 'Delete this event from your calendar?';
    if (confirm(confirmMsg)) {
      if (window.aetheraDB) {
        await window.aetheraDB.deleteCalendarEvent(eventId);
      }
    }
  }

  /* --------------------------------------------------------------------------
     EVENT MODAL (CREATE / EDIT)
     -------------------------------------------------------------------------- */
  openEventModal(event = null, defaultDate = null, defaultPriority = null, defaultStart = null, defaultEnd = null) {
    const modal = document.getElementById('cal-event-modal');
    if (!modal) return;

    const idInput = document.getElementById('event-form-id');
    const titleInput = document.getElementById('event-form-title');
    const dateInput = document.getElementById('event-form-date');
    const startInput = document.getElementById('event-form-start');
    const endInput = document.getElementById('event-form-end');
    const catInput = document.getElementById('event-form-category');
    const quadInput = document.getElementById('event-form-quadrant');
    const notesInput = document.getElementById('event-form-notes');
    const modalTitle = document.getElementById('cal-modal-title');

    if (event) {
      modalTitle.textContent = this.isId() ? 'Edit Acara Kalender' : 'Edit Calendar Event';
      idInput.value = event.id;
      titleInput.value = event.title;
      dateInput.value = event.date;
      startInput.value = event.startTime || '09:00';
      endInput.value = event.endTime || '10:00';
      catInput.value = event.category || 'work';
      quadInput.value = event.priority || 'Q2';
      notesInput.value = event.notes || '';
    } else {
      modalTitle.textContent = this.isId() ? 'Buat Acara Kalender' : 'Create Calendar Event';
      idInput.value = '';
      titleInput.value = '';
      dateInput.value = defaultDate || this.selectedDate;
      startInput.value = defaultStart || '09:00';
      endInput.value = defaultEnd || '10:30';
      const quad = defaultPriority || 'Q2';
      quadInput.value = quad;
      catInput.value = quad === 'Q1' ? 'deadline' : (quad === 'Q4' ? 'personal' : 'deep-work');
      notesInput.value = '';
    }

    this.syncCustomSelects();
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    titleInput.focus();
  }

  closeEventModal() {
    const modal = document.getElementById('cal-event-modal');
    if (!modal) return;
    document.querySelectorAll('.cal-custom-select.is-open').forEach(cs => {
      cs.classList.remove('is-open');
      cs.querySelector('.cal-custom-select-trigger')?.setAttribute('aria-expanded', 'false');
    });
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
  }

  /* --------------------------------------------------------------------------
     CUSTOM ROUNDED GLASS SELECT DROPDOWNS
     -------------------------------------------------------------------------- */
  initCustomSelects() {
    const customSelects = document.querySelectorAll('.cal-custom-select');
    customSelects.forEach(cs => {
      const targetId = cs.dataset.selectTarget;
      const select = document.getElementById(targetId);
      const trigger = cs.querySelector('.cal-custom-select-trigger');
      const options = cs.querySelectorAll('.cal-custom-select-option');

      trigger?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = cs.classList.contains('is-open');
        document.querySelectorAll('.cal-custom-select.is-open').forEach(other => {
          if (other !== cs) other.classList.remove('is-open');
        });
        cs.classList.toggle('is-open', !isOpen);
        trigger.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
      });

      options.forEach(opt => {
        opt.addEventListener('click', (e) => {
          e.stopPropagation();
          const val = opt.dataset.value;
          if (select) {
            select.value = val;
            select.dispatchEvent(new Event('change', { bubbles: true }));
          }
          this.syncCustomSelect(targetId);
          cs.classList.remove('is-open');
          trigger?.setAttribute('aria-expanded', 'false');
        });
      });
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.cal-custom-select')) {
        document.querySelectorAll('.cal-custom-select.is-open').forEach(cs => {
          cs.classList.remove('is-open');
          cs.querySelector('.cal-custom-select-trigger')?.setAttribute('aria-expanded', 'false');
        });
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.cal-custom-select.is-open').forEach(cs => {
          cs.classList.remove('is-open');
          cs.querySelector('.cal-custom-select-trigger')?.setAttribute('aria-expanded', 'false');
        });
      }
    });
  }

  syncCustomSelect(targetId) {
    const select = document.getElementById(targetId);
    const cs = document.querySelector(`.cal-custom-select[data-select-target="${targetId}"]`);
    if (!select || !cs) return;

    const val = select.value;
    const triggerVal = cs.querySelector('.cal-custom-select-val');
    const options = cs.querySelectorAll('.cal-custom-select-option');

    options.forEach(opt => {
      const isMatch = opt.dataset.value === val;
      opt.classList.toggle('is-selected', isMatch);
      if (isMatch && triggerVal) {
        const badge = opt.querySelector('.cal-quad-badge')?.cloneNode(true);
        const dot = opt.querySelector('.cal-cat-dot')?.cloneNode(true);
        const textSpan = opt.querySelector('.cal-option-text') || opt.querySelector('span:not(.cal-cat-dot):not(.cal-quad-badge)');
        const textContent = textSpan ? textSpan.textContent.trim() : (opt.dataset.label || opt.textContent.trim());

        triggerVal.innerHTML = '';
        if (badge) {
          triggerVal.appendChild(badge);
        } else if (dot) {
          triggerVal.appendChild(dot);
        }
        const label = document.createElement('span');
        label.textContent = textContent;
        triggerVal.appendChild(label);
      }
    });
  }

  syncCustomSelects() {
    this.syncCustomSelect('event-form-category');
    this.syncCustomSelect('event-form-quadrant');
  }

  async handleEventFormSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('event-form-id').value;
    const title = document.getElementById('event-form-title').value.trim();
    const date = document.getElementById('event-form-date').value;
    const startTime = document.getElementById('event-form-start').value;
    const endTime = document.getElementById('event-form-end').value;
    const category = document.getElementById('event-form-category').value;
    const priority = document.getElementById('event-form-quadrant').value;
    const notes = document.getElementById('event-form-notes').value.trim();

    if (!title || !date) return;

    const eventPayload = {
      title,
      date,
      startTime,
      endTime,
      category,
      priority,
      notes
    };

    if (id) {
      if (window.aetheraDB) {
        await window.aetheraDB.updateCalendarEvent(id, eventPayload);
      }
    } else {
      if (window.aetheraDB) {
        await window.aetheraDB.saveCalendarEvent(eventPayload);
      }
    }

    this.closeEventModal();
    const dayModal = document.getElementById('cal-day-detail-modal');
    if (dayModal && dayModal.classList.contains('is-open')) {
      this.renderDayDetailModal(this.selectedDate);
    }
  }

  /* --------------------------------------------------------------------------
     DAY EVENTS DETAIL MODAL (CLICK A DATE TO VIEW ALL EVENTS)
     -------------------------------------------------------------------------- */
  openDayDetailModal(dateStr) {
    if (!dateStr) dateStr = this.selectedDate;
    this.selectedDate = dateStr;
    const modal = document.getElementById('cal-day-detail-modal');
    if (!modal) return;

    this.renderDayDetailModal(dateStr);
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');

    // Quick add focus
    const quickInput = document.getElementById('day-detail-quick-input');
    if (quickInput) {
      quickInput.value = '';
      setTimeout(() => quickInput.focus(), 80);
    }
  }

  closeDayDetailModal() {
    const modal = document.getElementById('cal-day-detail-modal');
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
  }

  renderDayDetailModal(dateStr) {
    if (!dateStr) dateStr = this.selectedDate;
    const modal = document.getElementById('cal-day-detail-modal');
    if (!modal) return;

    const isId = this.isId();
    const d = new Date(dateStr + 'T12:00:00');
    const todayStr = this.formatDate(new Date());
    const isToday = dateStr === todayStr;

    // 1. Date Title & Today Tag
    const dateTitleEl = document.getElementById('day-detail-modal-date');
    const todayTagEl = document.getElementById('day-detail-today-tag');
    if (dateTitleEl) {
      dateTitleEl.textContent = d.toLocaleDateString(this.getLocale(), {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    }
    if (todayTagEl) {
      todayTagEl.style.display = isToday ? 'inline-block' : 'none';
      todayTagEl.textContent = isId ? 'HARI INI' : 'TODAY';
    }

    // 2. Events List
    const listContainer = document.getElementById('day-detail-events-list');
    const statsSubtitle = document.getElementById('day-detail-stats-subtitle');
    if (!listContainer) return;
    listContainer.innerHTML = '';

    // Get ALL events for this date (unfiltered to ensure user sees every event they made)
    const dayEvents = this.events.filter(e => e.date === dateStr);
    dayEvents.sort((a, b) => (a.startTime || '00:00').localeCompare(b.startTime || '00:00'));

    const totalCount = dayEvents.length;
    const completedCount = dayEvents.filter(e => e.completed).length;

    if (statsSubtitle) {
      if (totalCount === 0) {
        statsSubtitle.textContent = isId ? 'Tidak ada acara terjadwal' : '0 events scheduled';
      } else {
        const eventsWord = isId ? 'Acara' : (totalCount === 1 ? 'Event' : 'Events');
        const completedWord = isId ? 'Selesai' : 'Completed';
        statsSubtitle.textContent = `${totalCount} ${eventsWord} • ${completedCount} ${completedWord} (${Math.round((completedCount / totalCount) * 100)}%)`;
      }
    }

    // Update Sync status in modal
    this.updateSyncStatusIndicator();

    if (dayEvents.length === 0) {
      listContainer.innerHTML = `
        <div class="cal-day-empty-state">
          <div class="cal-day-empty-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <h4 class="cal-day-empty-title">${isId ? 'Tidak Ada Acara untuk Tanggal Ini' : 'No Events Scheduled for This Day'}</h4>
          <p class="cal-day-empty-desc">${isId ? 'Jadwal Anda bersih pada tanggal ini. Klik tombol di bawah untuk membuat acara baru atau gunakan Asisten AI untuk merencanakan hari Anda.' : 'Your schedule is clear for this date. Create an event to stay organized or use the Cortex AI Assistant to plan your day.'}</p>
          <div style="display: flex; gap: 0.65rem; margin-top: 0.9rem; flex-wrap: wrap; justify-content: center;">
            <button type="button" class="btn btn-primary" id="day-empty-add-action-btn" style="padding: 0.5rem 1.15rem; font-size: 0.82rem;">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              <span>${isId ? '+ Tambah Acara' : '+ Add Event'}</span>
            </button>
            <button type="button" class="btn btn-secondary" id="day-empty-ai-action-btn" style="padding: 0.5rem 1.15rem; font-size: 0.82rem;">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              <span>${isId ? 'Rencanakan dengan AI' : 'Auto-Plan with AI'}</span>
            </button>
          </div>
        </div>
      `;
      document.getElementById('day-empty-add-action-btn')?.addEventListener('click', () => {
        this.openEventModal(null, dateStr);
      });
      document.getElementById('day-empty-ai-action-btn')?.addEventListener('click', () => {
        this.closeDayDetailModal();
        this.openAIModal();
      });
      return;
    }

    // Render Event Items
    const categoryNames = {
      'deep-work': isId ? 'Fokus Mendalam' : 'Deep Work',
      'meeting': isId ? 'Rapat / Sinkronisasi' : 'Meeting / Sync',
      'study': isId ? 'Belajar & Akademik' : 'Study & Academic',
      'deadline': isId ? 'Tenggat Waktu' : 'Deadline / SecOps',
      'personal': isId ? 'Pribadi & Istirahat' : 'Personal & Wellness',
      'work': isId ? 'Pekerjaan Umum' : 'General Work'
    };

    dayEvents.forEach(evt => {
      const card = document.createElement('div');
      card.className = `cal-day-event-card ${evt.category || 'work'}${evt.completed ? ' is-completed' : ''}`;
      card.dataset.eventId = evt.id;

      const catLabel = categoryNames[evt.category] || (evt.category || 'Work');
      const quadBadge = (evt.priority || 'Q2').toUpperCase();

      card.innerHTML = `
        <div class="cal-day-event-left">
          <button type="button" class="cal-day-check-btn${evt.completed ? ' checked' : ''}" title="${isId ? 'Tandai selesai' : 'Toggle Completed'}">
            ${evt.completed ? `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5"><polyline points="20 6 9 17 4 12"/></svg>` : ''}
          </button>
          <div class="cal-day-event-info">
            <div class="cal-day-event-title${evt.completed ? ' done' : ''}">
              ${this.escapeHtml(evt.title)}
            </div>
            <div class="cal-day-event-meta">
              <span class="cal-day-time-pill">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                ${evt.startTime} – ${evt.endTime}
              </span>
              <span class="cal-event-chip ${evt.category || 'work'}" style="font-size: 0.68rem; padding: 0.15rem 0.5rem;">
                <span class="cal-cat-dot dot-${evt.category || 'work'}"></span>
                <span>${catLabel}</span>
              </span>
              <span class="cal-quad-badge badge-${quadBadge.toLowerCase()}">${quadBadge}</span>
            </div>
            ${evt.notes ? `<div class="cal-day-event-notes">${this.escapeHtml(evt.notes)}</div>` : ''}
          </div>
        </div>
        <div class="cal-day-event-actions">
          <button type="button" class="cal-action-btn edit-btn" title="${isId ? 'Edit Acara' : 'Edit Event'}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button type="button" class="cal-action-btn delete-btn" title="${isId ? 'Hapus Acara' : 'Delete Event'}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
          </button>
        </div>
      `;

      // Checkbox click
      card.querySelector('.cal-day-check-btn').addEventListener('click', async (e) => {
        e.stopPropagation();
        await this.toggleEventCompleted(evt.id, !evt.completed);
        this.renderDayDetailModal(dateStr);
      });

      // Edit click
      card.querySelector('.edit-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        this.openEventModal(evt);
      });

      // Delete click
      card.querySelector('.delete-btn').addEventListener('click', async (e) => {
        e.stopPropagation();
        await this.deleteEvent(evt.id);
        this.renderDayDetailModal(dateStr);
      });

      // Card click opens edit
      card.addEventListener('click', () => {
        this.openEventModal(evt);
      });

      listContainer.appendChild(card);
    });
  }

  async handleQuickAddTaskForDate(rawText, targetDate) {
    if (!rawText || !rawText.trim()) return;
    const date = targetDate || this.selectedDate;

    let startTime = '09:00';
    let endTime = '10:00';
    let title = rawText.trim();

    const match = title.match(/^(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)\s*(?:-|to)?\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)?\s*(.*)$/i);
    if (match) {
      const parseHour = (str) => {
        const m = str.trim().match(/^(\d{1,2}):?(\d{2})?\s*(am|pm)?$/i);
        if (!m) return '09:00';
        let h = parseInt(m[1], 10);
        const mins = m[2] || '00';
        const ampm = m[3] ? m[3].toLowerCase() : null;
        if (ampm === 'pm' && h < 12) h += 12;
        if (ampm === 'am' && h === 12) h = 0;
        return `${String(h).padStart(2, '0')}:${mins}`;
      };

      if (match[1]) startTime = parseHour(match[1]);
      if (match[2]) {
        endTime = parseHour(match[2]);
      } else {
        const [hh, mm] = startTime.split(':').map(Number);
        endTime = `${String((hh + 1) % 24).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
      }
      if (match[3] && match[3].trim().length > 1) {
        title = match[3].trim();
      }
    }

    let cat = 'work';
    const lower = title.toLowerCase();
    if (/deep|code|dev|focus/i.test(lower)) cat = 'deep-work';
    else if (/meet|sync|call/i.test(lower)) cat = 'meeting';
    else if (/study|exam|homework|math/i.test(lower)) cat = 'study';
    else if (/due|deadline/i.test(lower)) cat = 'deadline';
    else if (/gym|lunch|break|walk/i.test(lower)) cat = 'personal';

    const newEvent = {
      title,
      date,
      startTime,
      endTime,
      category: cat,
      priority: cat === 'deep-work' ? 'Q2' : 'Q1',
      completed: false
    };

    if (window.aetheraDB) {
      await window.aetheraDB.saveCalendarEvent(newEvent);
    }

    this.renderDayDetailModal(date);
    this.render();
  }

  initDayDetailModalEvents() {
    // Modal Close Buttons
    document.getElementById('cal-day-detail-close')?.addEventListener('click', () => this.closeDayDetailModal());
    document.getElementById('day-detail-close-btn')?.addEventListener('click', () => this.closeDayDetailModal());

    // Click outside modal
    document.getElementById('cal-day-detail-modal')?.addEventListener('click', (e) => {
      if (e.target.id === 'cal-day-detail-modal') {
        this.closeDayDetailModal();
      }
    });

    // Add event button in modal header
    document.getElementById('day-detail-add-event-btn')?.addEventListener('click', () => {
      this.openEventModal(null, this.selectedDate);
    });

    // Quick add task in modal
    const quickInput = document.getElementById('day-detail-quick-input');
    const quickBtn = document.getElementById('day-detail-quick-btn');
    const submitQuick = () => {
      if (!quickInput) return;
      const text = quickInput.value.trim();
      if (!text) return;
      this.handleQuickAddTaskForDate(text, this.selectedDate);
      quickInput.value = '';
    };

    quickBtn?.addEventListener('click', submitQuick);
    quickInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        submitQuick();
      }
    });

    // Sync Now trigger
    document.getElementById('day-detail-sync-now-btn')?.addEventListener('click', async (e) => {
      e.stopPropagation();
      if (window.aetheraDB) {
        const btn = document.getElementById('day-detail-sync-now-btn');
        if (btn) btn.textContent = this.isId() ? 'Menyinkronkan...' : 'Syncing...';
        await window.aetheraDB.forceSyncCalendar();
        setTimeout(() => {
          this.updateSyncStatusIndicator();
        }, 500);
      }
    });

    // Navbar sync pill click
    const syncPill = document.getElementById('cal-sync-status-indicator');
    syncPill?.addEventListener('click', async () => {
      if (window.aetheraDB && window.aetheraDB.isLoggedIn()) {
        const textEl = document.getElementById('cal-sync-status-text');
        if (textEl) textEl.textContent = this.isId() ? 'Menyinkronkan...' : 'Syncing...';
        syncPill.classList.add('is-syncing');
        await window.aetheraDB.forceSyncCalendar();
        setTimeout(() => {
          syncPill.classList.remove('is-syncing');
          this.updateSyncStatusIndicator();
        }, 600);
      } else {
        window.location.href = 'login.html?redirect=calendar.html';
      }
    });
  }

  updateSyncStatusIndicator() {
    const isId = this.isId();
    const pill = document.getElementById('cal-sync-status-indicator');
    const textEl = document.getElementById('cal-sync-status-text');
    const modalSyncText = document.getElementById('day-detail-sync-text');
    const modalSyncBtn = document.getElementById('day-detail-sync-now-btn');

    if (!window.aetheraDB) return;
    const isLoggedIn = window.aetheraDB.isLoggedIn();
    const user = window.aetheraDB.getUser();
    const username = (user && (user.displayName || user.username)) || 'Account';

    if (isLoggedIn) {
      if (pill) {
        pill.classList.add('is-logged-in');
        pill.title = isId ? `Tersinkronisasi dengan akun ${username} (Klik untuk sinkronkan sekarang)` : `Synced across devices with account ${username} (Click to force sync now)`;
      }
      if (textEl) {
        textEl.textContent = isId ? `Tersinkron (${username})` : `Synced (${username})`;
      }
      if (modalSyncText) {
        modalSyncText.textContent = isId ? `Tersinkronisasi di semua perangkat dengan ${username}` : `Synced across all devices with ${username}`;
      }
      if (modalSyncBtn) {
        modalSyncBtn.style.display = 'inline';
        modalSyncBtn.textContent = isId ? 'Sinkronkan Sekarang' : 'Sync Now';
      }
    } else {
      if (pill) {
        pill.classList.remove('is-logged-in');
        pill.title = isId ? 'Penyimpanan lokal. Masuk untuk menyinkronkan antar perangkat.' : 'Local storage. Sign in to sync across all devices.';
      }
      if (textEl) {
        textEl.textContent = isId ? 'Lokal (Masuk)' : 'Local (Sign In)';
      }
      if (modalSyncText) {
        modalSyncText.textContent = isId ? 'Penyimpanan lokal (Masuk untuk sinkronisasi antar perangkat)' : 'Local storage (Sign in to sync across devices)';
      }
      if (modalSyncBtn) {
        modalSyncBtn.style.display = 'inline';
        modalSyncBtn.textContent = isId ? 'Masuk' : 'Sign In';
        modalSyncBtn.onclick = () => { window.location.href = 'login.html?redirect=calendar.html'; };
      }
    }
  }

  /* --------------------------------------------------------------------------
     AI SCHEDULE ASSISTANT (IN-CALENDAR GENERATOR & REVIEW)
     -------------------------------------------------------------------------- */
  openAIModal() {
    const modal = document.getElementById('cal-ai-review-modal');
    if (!modal) return;

    const targetDateInput = document.getElementById('ai-schedule-target-date');
    if (targetDateInput) {
      targetDateInput.value = this.selectedDate;
    }

    const previewSection = document.getElementById('ai-parsed-schedule-section');
    if (previewSection) previewSection.style.display = 'none';

    const confirmBtn = document.getElementById('cal-ai-confirm-import-btn');
    if (confirmBtn) confirmBtn.style.display = 'none';

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');

    document.getElementById('ai-schedule-prompt')?.focus();
  }

  closeAIModal() {
    const modal = document.getElementById('cal-ai-review-modal');
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    this.parsedAIEvents = [];
  }

  parseUserPromptToScheduleEvents(promptText, targetDate = null) {
    const text = (promptText || '').trim();
    const dateStr = targetDate || this.selectedDate || new Date().toISOString().split('T')[0];
    if (!text) return [];

    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const timeRangeRegex = /(?:jam\s*)?(\d{1,2}(?:[:.]\d{2})?\s*(?:am|pm)?)\s*(?:-|–|—|sampai|to)\s*(\d{1,2}(?:[:.]\d{2})?\s*(?:am|pm)?)/i;

    const toStandardTime = (tStr, defaultHour = 9) => {
      if (!tStr) return String(defaultHour).padStart(2, '0') + ':00';
      let s = tStr.toLowerCase().trim().replace('jam', '').trim().replace('.', ':');
      let isPm = s.includes('pm');
      let isAm = s.includes('am');
      s = s.replace(/am|pm/, '').trim();
      let parts = s.split(':');
      let h = parseInt(parts[0], 10);
      let m = parts[1] ? parseInt(parts[1], 10) : 0;
      if (isNaN(h)) h = defaultHour;
      if (isNaN(m)) m = 0;
      if (isPm && h < 12) h += 12;
      if (isAm && h === 12) h = 0;
      return String(Math.min(23, Math.max(0, h))).padStart(2, '0') + ':' + String(Math.min(59, Math.max(0, m))).padStart(2, '0');
    };

    const detectQuadrant = (title) => {
      const l = (title || '').toLowerCase();
      if (/urgent|critical|deadline|submit|due|exam|fix|cve|darurat|kritis|tenggat|ujian|perbaiki|bug/i.test(l)) {
        return { priority: 'Q1', quadrant: 'Urgent & Important', category: 'deadline' };
      }
      if (/meet|sync|call|standup|discuss|client|demo|interview|rapat|temu|koordinasi|telepon|diskusi/i.test(l)) {
        return { priority: 'Q3', quadrant: 'Urgent, Not Important', category: 'meeting' };
      }
      if (/gym|workout|break|lunch|dinner|rest|walk|recovery|sleep|santai|makan|istirahat|olahraga/i.test(l)) {
        return { priority: 'Q4', quadrant: 'Not Urgent, Not Important', category: 'personal' };
      }
      if (/study|belajar|baca|math|calculus|physics|course|kelas|tugas|homework|kuliah/i.test(l)) {
        return { priority: 'Q2', quadrant: 'Important, Not Urgent', category: 'study' };
      }
      return { priority: 'Q2', quadrant: 'Important, Not Urgent', category: 'deep-work' };
    };

    let rawTasks = [];
    if (lines.length > 1) {
      rawTasks = lines;
    } else {
      rawTasks = text.split(/;|\n|(?<=[a-zA-Z0-9]),\s*(?=[a-zA-Z0-9])|\band\s+then\b|\blalu\b|\bkemudian\b/i).map(s => s.trim()).filter(Boolean);
    }

    let baseHour = 9;
    let baseMin = 0;
    const events = [];

    for (let raw of rawTasks) {
      const timeMatch = raw.match(timeRangeRegex);
      let title = raw;
      let startTime = '';
      let endTime = '';

      if (timeMatch) {
        startTime = toStandardTime(timeMatch[1], baseHour);
        endTime = toStandardTime(timeMatch[2], baseHour + 1);
        title = raw.replace(timeMatch[0], '').replace(/^(?:at|pada|jam|dari|from|–|-|:)\s*/i, '').replace(/[–\-:]\s*$/, '').trim();
      } else {
        startTime = String(baseHour).padStart(2, '0') + ':' + String(baseMin).padStart(2, '0');
        let endH = baseHour + 1;
        let endM = (baseMin + 30) % 60;
        if (baseMin + 30 >= 60) endH++;
        endTime = String(endH).padStart(2, '0') + ':' + String(endM).padStart(2, '0');
        baseHour = endH;
        baseMin = (endM + 15) % 60;
        if (endM + 15 >= 60) baseHour++;
        if (baseHour >= 22) baseHour = 9;
      }

      title = title.replace(/^[\s*•\-\d.)|:]+/, '').trim();
      if (!title) title = 'Focus Session';

      const quad = detectQuadrant(title);
      events.push({
        id: 'evt_' + Math.random().toString(36).substr(2, 9),
        title,
        date: dateStr,
        startTime,
        endTime,
        category: quad.category,
        priority: quad.priority,
        quadrant: quad.quadrant,
        notes: 'Generated from Schedule & Task Planner AI',
        completed: false,
        createdAt: new Date().toISOString()
      });
    }

    return events;
  }

  buildSimulatedScheduleText(promptText, targetDate = null) {
    const events = this.parseUserPromptToScheduleEvents(promptText, targetDate);
    if (!events || events.length === 0) {
      return `#### 1. TIME-BLOCKED SCHEDULE:\n- 09:00 - 10:30: Focus & Deep Work // Primary objective\n- 11:00 - 12:00: Team & Project Sync // Status review\n\n#### 2. EISENHOWER PRIORITY MATRIX:\n- Q2 (Important, Not Urgent): Focus & Deep Work\n- Q3 (Urgent, Not Important): Team & Project Sync`;
    }

    const scheduleLines = events.map(e => `- ${e.startTime} - ${e.endTime}: ${e.title}`).join('\n');
    const matrixLines = events.map(e => `- ${e.priority} (${e.quadrant}): ${e.title}`).join('\n');

    return `#### 1. TIME-BLOCKED SCHEDULE:\n${scheduleLines}\n\n#### 2. EISENHOWER PRIORITY MATRIX:\n${matrixLines}`;
  }

  async generateAISchedule() {
    if (this.isGeneratingAI) return;
    const promptInput = document.getElementById('ai-schedule-prompt');
    const promptText = promptInput ? promptInput.value.trim() : '';
    const targetDate = document.getElementById('ai-schedule-target-date')?.value || this.selectedDate;

    if (!promptText) {
      alert(this.isId() ? 'Harap jelaskan tugas, rapat, atau tujuan harian Anda.' : 'Please describe your to-dos, meetings, or daily goals.');
      return;
    }

    this.isGeneratingAI = true;
    const btnText = document.getElementById('ai-generate-btn-text');
    if (btnText) btnText.textContent = this.isId() ? 'Menyusun Jadwal...' : 'Formulating Schedule...';

    const hasValidKey = this.hasValidCloudKey();
    if (!hasValidKey) {
      setTimeout(() => {
        let parsed = this.parseUserPromptToScheduleEvents(promptText, targetDate);
        if (!parsed || parsed.length === 0) {
          const simulatedText = this.buildSimulatedScheduleText(promptText, targetDate);
          if (window.aetheraDB && typeof window.aetheraDB.parseAIScheduleText === 'function') {
            parsed = window.aetheraDB.parseAIScheduleText(simulatedText, targetDate);
          }
        }
        this.displayParsedAIEvents(parsed, targetDate);
        this.isGeneratingAI = false;
        if (btnText) btnText.textContent = this.isId() ? 'Buat Jadwal' : 'Generate Schedule';
      }, 350);
      return;
    }

    const apiKey = this.getApiKey();
    const backend = this.getBackendUrl();
    const generateUrl = this.isServerProxyActive
      ? `${backend}/api/ai/generate`
      : (apiKey ? `${this.modelEndpoint}?key=${encodeURIComponent(apiKey)}` : `${backend}/api/ai/generate`);

    let targetModel = this.selectedModel || 'gemini-flash-lite-latest';
    if (!targetModel || targetModel.includes('2.5') || targetModel.includes('2.0') || targetModel.includes('1.5') || targetModel.includes('3.5') || targetModel.includes('3.8')) {
      targetModel = 'gemini-flash-lite-latest';
    }

    const langInstruction = this.isId() ? '\nIMPORTANT: Respond and generate all event and task titles/descriptions in natural Indonesian (Bahasa Indonesia).' : '';
    const systemInstruction = `You are master productivity planner. Organize the user's tasks into:
1) Eisenhower Matrix Priorities (Q1 Urgent & Important, Q2 Deep Work, Q3 Delegate, Q4 Personal/Eliminate).
2) Time-blocked schedule from 08:00 to 22:00 with realistic start and end times (format: HH:MM - HH:MM: Task Description).${langInstruction}`;

    const payload = {
      model: targetModel,
      system_instruction: { parts: [{ text: systemInstruction }] },
      contents: [{ role: "user", parts: [{ text: promptText }] }],
      generationConfig: { maxOutputTokens: 900, temperature: 0.6 }
    };

    try {
      const response = await fetch(generateUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API error ${response.status}`);
      }

      const data = await response.json();
      let generatedText = "";
      if (data.candidates && data.candidates[0]?.content?.parts) {
        generatedText = data.candidates[0].content.parts.map(p => p.text).join('\n');
      }

      if (!generatedText) {
        throw new Error('No schedule returned from AI model.');
      }

      // Parse with AetheraUserDB schedule parser
      let parsed = [];
      if (window.aetheraDB && typeof window.aetheraDB.parseAIScheduleText === 'function') {
        parsed = window.aetheraDB.parseAIScheduleText(generatedText, targetDate);
      }

      if (!parsed || parsed.length === 0) {
        parsed = this.parseUserPromptToScheduleEvents(promptText, targetDate);
      }

      this.displayParsedAIEvents(parsed, targetDate);

    } catch (err) {
      console.warn('[CalendarApp] AI generation note, using structured intelligent scheduler:', err.message);
      let fallbackParsed = this.parseUserPromptToScheduleEvents(promptText, targetDate);
      if (!fallbackParsed || fallbackParsed.length === 0) {
        const simulatedText = this.buildSimulatedScheduleText(promptText, targetDate);
        if (window.aetheraDB && typeof window.aetheraDB.parseAIScheduleText === 'function') {
          fallbackParsed = window.aetheraDB.parseAIScheduleText(simulatedText, targetDate);
        }
      }
      this.displayParsedAIEvents(fallbackParsed, targetDate);
    } finally {
      this.isGeneratingAI = false;
      if (btnText) btnText.textContent = this.isId() ? 'Buat Jadwal' : 'Generate Schedule';
    }
  }

  displayParsedAIEvents(eventsList, targetDate) {
    this.parsedAIEvents = eventsList;
    const section = document.getElementById('ai-parsed-schedule-section');
    const container = document.getElementById('ai-parsed-items-list');
    const confirmBtn = document.getElementById('cal-ai-confirm-import-btn');

    if (!section || !container) return;

    if (eventsList.length === 0) {
      container.innerHTML = `<div style="font-size: 0.78rem; color: var(--text-muted); font-style: italic;">${this.isId() ? 'Tidak dapat mendeteksi blok waktu tertentu. Coba tentukan waktu (mis. 09:00 - 11:00 Fokus Mendalam).' : 'Could not detect specific time blocks. Try specifying times (e.g. 9am to 11am Deep Work).'}</div>`;
      section.style.display = 'block';
      return;
    }

    container.innerHTML = '';
    eventsList.forEach((evt, idx) => {
      const item = document.createElement('div');
      item.className = 'cal-event-chip ' + (evt.category || 'work');
      item.style.display = 'flex';
      item.style.alignItems = 'center';
      item.style.justifyContent = 'space-between';
      item.style.padding = '0.35rem 0.65rem';
      item.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem; overflow: hidden;">
          <input type="checkbox" id="parsed-evt-${idx}" checked style="cursor: pointer;">
          <span style="font-weight: 700;">${evt.startTime} – ${evt.endTime}</span>
          <span style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${this.escapeHtml(evt.title)}</span>
        </div>
        <span style="font-family: var(--font-mono); font-size: 0.65rem; opacity: 0.85;">${evt.priority || 'Q2'}</span>
      `;
      container.appendChild(item);
    });

    section.style.display = 'block';
    if (confirmBtn) confirmBtn.style.display = 'inline-flex';
  }

  async confirmImportAISchedule() {
    if (!this.parsedAIEvents || this.parsedAIEvents.length === 0) return;

    const container = document.getElementById('ai-parsed-items-list');
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    const selectedEvents = [];

    checkboxes.forEach((cb, idx) => {
      if (cb.checked && this.parsedAIEvents[idx]) {
        selectedEvents.push(this.parsedAIEvents[idx]);
      }
    });

    if (selectedEvents.length === 0) {
      alert(this.isId() ? 'Harap pilih minimal satu acara untuk diimpor.' : 'Please select at least one event to import.');
      return;
    }

    if (window.aetheraDB) {
      await window.aetheraDB.saveCalendarEventsBatch(selectedEvents);
    }

    // CRITICAL: Reload in-memory events so calendar re-renders immediately without full page refresh
    await this.loadEvents();
    this.closeAIModal();
    this.render();
    if (this.currentView === 'matrix') {
      this.renderMatrixView();
    } else if (this.currentView === 'agenda') {
      this.renderAgendaView();
    } else if (this.currentView === 'week') {
      this.renderWeekView();
    }
  }

  /* --------------------------------------------------------------------------
     HELPER UTILITIES
     -------------------------------------------------------------------------- */
  formatDate(dateObj) {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  timeToMinutes(timeStr) {
    if (!timeStr) return 540;
    const parts = timeStr.split(':');
    return (parseInt(parts[0], 10) || 0) * 60 + (parseInt(parts[1], 10) || 0);
  }

  getWeekDays(centerDate) {
    const curr = new Date(centerDate);
    const day = curr.getDay();
    // Monday as first day of week (0 = Monday, 6 = Sunday)
    const diff = curr.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(curr.setDate(diff));

    const week = [];
    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(monday);
      nextDay.setDate(monday.getDate() + i);
      week.push(nextDay);
    }
    return week;
  }

  /* --------------------------------------------------------------------------
     SLASH COMMAND PALETTE (/) CONTROLLER FOR CALENDAR
     -------------------------------------------------------------------------- */
  initSlashCommands() {
    const modal = document.getElementById('cal-slash-palette-modal');
    const input = document.getElementById('cal-slash-input');
    const resultsContainer = document.getElementById('cal-slash-results');
    const headerSlashBtn = document.getElementById('cal-header-slash-btn');

    if (!modal || !input || !resultsContainer) return;

    this.slashPaletteSelectedIndex = 0;
    this.slashPaletteCommands = [
      {
        id: 'plan',
        command: '/plan',
        icon: '⚡',
        title: this.isId() ? 'Asisten Jadwal AI' : 'AI Schedule Planner',
        tag: '/plan [prompt]',
        desc: this.isId() ? 'Susun blok waktu Eisenhower dari teks atau to-do' : 'Formulate Eisenhower time blocks from text or to-dos',
        category: this.isId() ? 'Kecerdasan AI' : 'AI Intelligence',
        action: (arg) => {
          this.openAIModal();
          if (arg) {
            const promptInput = document.getElementById('ai-schedule-prompt');
            if (promptInput) {
              promptInput.value = arg;
              promptInput.focus();
            }
          }
        }
      },
      {
        id: 'event',
        command: '/event',
        icon: '➕',
        title: this.isId() ? 'Buat Acara Baru' : 'New Calendar Event',
        tag: '/event [title]',
        desc: this.isId() ? 'Tambahkan acara atau tugas dengan blok waktu' : 'Create a new calendar time-blocked event',
        category: this.isId() ? 'Manajemen Acara' : 'Event Management',
        action: (arg) => {
          this.openEventModal(null, this.selectedDate);
          if (arg) {
            const titleInput = document.getElementById('event-form-title');
            if (titleInput) {
              titleInput.value = arg;
              titleInput.focus();
            }
          }
        }
      },
      {
        id: 'today',
        command: '/today',
        icon: '📅',
        title: this.isId() ? 'Lompat ke Hari Ini' : 'Jump to Today',
        tag: '/today',
        desc: this.isId() ? 'Kembali langsung ke tanggal dan tampilan hari ini' : 'Return immediately to today\'s date and current schedule',
        category: this.isId() ? 'Navigasi' : 'Navigation',
        action: () => this.jumpToToday()
      },
      {
        id: 'q1',
        command: '/q1',
        icon: '🔴',
        title: this.isId() ? 'Kuadran 1: Mendesak & Penting' : 'Quadrant 1: Urgent & Important',
        tag: '/q1 [title]',
        desc: this.isId() ? 'Tambah krisis, tenggat waktu, atau tugas kritis' : 'Add crisis, deadline, or immediate critical task to Q1',
        category: this.isId() ? 'Prioritas Eisenhower' : 'Eisenhower Priorities',
        action: (arg) => {
          this.openEventModal(null, this.selectedDate, 'Q1');
          if (arg) {
            const titleInput = document.getElementById('event-form-title');
            if (titleInput) { titleInput.value = arg; titleInput.focus(); }
          }
        }
      },
      {
        id: 'q2',
        command: '/q2',
        icon: '🔷',
        title: this.isId() ? 'Kuadran 2: Deep Work & Fokus Strategis' : 'Quadrant 2: Deep Work & Strategic',
        tag: '/q2 [title]',
        desc: this.isId() ? 'Tambah blok fokus, pembelajaran, atau arsitektur sistem' : 'Add high-leverage focus block or study session to Q2',
        category: this.isId() ? 'Prioritas Eisenhower' : 'Eisenhower Priorities',
        action: (arg) => {
          this.openEventModal(null, this.selectedDate, 'Q2');
          if (arg) {
            const titleInput = document.getElementById('event-form-title');
            if (titleInput) { titleInput.value = arg; titleInput.focus(); }
          }
        }
      },
      {
        id: 'q3',
        command: '/q3',
        icon: '🟡',
        title: this.isId() ? 'Kuadran 3: Delegasi & Pertemuan' : 'Quadrant 3: Delegate & Meetings',
        tag: '/q3 [title]',
        desc: this.isId() ? 'Tambah rapat tim, panggilan sinkronisasi, atau koordinasi' : 'Add meeting, team sync, or quick chore to Q3',
        category: this.isId() ? 'Prioritas Eisenhower' : 'Eisenhower Priorities',
        action: (arg) => {
          this.openEventModal(null, this.selectedDate, 'Q3');
          if (arg) {
            const titleInput = document.getElementById('event-form-title');
            if (titleInput) { titleInput.value = arg; titleInput.focus(); }
          }
        }
      },
      {
        id: 'q4',
        command: '/q4',
        icon: '🟢',
        title: this.isId() ? 'Kuadran 4: Kebugaran & Istirahat' : 'Quadrant 4: Wellness & Recovery',
        tag: '/q4 [title]',
        desc: this.isId() ? 'Tambah olahraga, istirahat, gym, atau waktu pribadi' : 'Add wellness, workout, gym, or recovery block to Q4',
        category: this.isId() ? 'Prioritas Eisenhower' : 'Eisenhower Priorities',
        action: (arg) => {
          this.openEventModal(null, this.selectedDate, 'Q4');
          if (arg) {
            const titleInput = document.getElementById('event-form-title');
            if (titleInput) { titleInput.value = arg; titleInput.focus(); }
          }
        }
      },
      {
        id: 'month',
        command: '/month',
        icon: '📆',
        title: this.isId() ? 'Tampilan Bulan (Month Grid)' : 'Month Grid View',
        tag: '/month',
        desc: this.isId() ? 'Beralih ke kisi kalender bulanan' : 'Switch to standard monthly calendar view',
        category: this.isId() ? 'Tampilan Kalender' : 'Calendar Views',
        action: () => this.switchView('month')
      },
      {
        id: 'week',
        command: '/week',
        icon: '📊',
        title: this.isId() ? 'Tampilan Minggu (Time Blocking)' : 'Week Time-Blocking View',
        tag: '/week',
        desc: this.isId() ? 'Beralih ke jadwal 7 hari per jam' : 'Switch to 7-day hourly schedule view',
        category: this.isId() ? 'Tampilan Kalender' : 'Calendar Views',
        action: () => this.switchView('week')
      },
      {
        id: 'matrix',
        command: '/matrix',
        icon: '🔲',
        title: this.isId() ? 'Tampilan Matriks Eisenhower' : 'Eisenhower Matrix View',
        tag: '/matrix',
        desc: this.isId() ? 'Beralih ke matriks prioritas 4 kuadran' : 'Switch to 4-quadrant priority matrix view',
        category: this.isId() ? 'Tampilan Kalender' : 'Calendar Views',
        action: () => this.switchView('matrix')
      },
      {
        id: 'agenda',
        command: '/agenda',
        icon: '📑',
        title: this.isId() ? 'Tampilan Agenda' : 'Chronological Agenda View',
        tag: '/agenda',
        desc: this.isId() ? 'Beralih ke daftar agenda kronologis' : 'Switch to chronological agenda stream',
        category: this.isId() ? 'Tampilan Kalender' : 'Calendar Views',
        action: () => this.switchView('agenda')
      },
      {
        id: 'sync',
        command: '/sync',
        icon: '🔄',
        title: this.isId() ? 'Sinkronkan ke Cloud' : 'Force Cloud Sync',
        tag: '/sync',
        desc: this.isId() ? 'Paksa sinkronisasi real-time multi-perangkat' : 'Trigger real-time multi-device cloud database sync',
        category: this.isId() ? 'Sistem' : 'System',
        action: async () => {
          if (window.aetheraDB && typeof window.aetheraDB.syncWithCloud === 'function') {
            await window.aetheraDB.syncWithCloud();
          }
          await this.loadEvents();
          this.render();
        }
      },
      {
        id: 'notes',
        command: '/notes',
        icon: '📝',
        title: this.isId() ? 'Buka Ruang Kerja Catatan' : 'Open Notes Workspace',
        tag: '/notes',
        desc: this.isId() ? 'Pindah ke ruang catatan bergaya Notion' : 'Open connected Notion-style workspace',
        category: this.isId() ? 'Aplikasi Terhubung' : 'Connected Apps',
        action: () => { window.location.href = 'notes.html'; }
      },
      {
        id: 'ai-studio',
        command: '/ai-studio',
        icon: '🚀',
        title: this.isId() ? 'Buka AI Studio' : 'Open AI Studio',
        tag: '/ai-studio',
        desc: this.isId() ? 'Akses Aethera Cortex AI Studio lengkap' : 'Launch full Aethera Cortex AI Studio',
        category: this.isId() ? 'Aplikasi Terhubung' : 'Connected Apps',
        action: () => { window.location.href = 'ai.html'; }
      }
    ];

    const openPalette = () => {
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      input.value = '';
      this.renderSlashPaletteResults('');
      setTimeout(() => input.focus(), 50);
    };

    const closePalette = () => {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
    };

    headerSlashBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      openPalette();
    });

    // Global keyboard listener for '/' or 'Ctrl+K'
    window.addEventListener('keydown', (e) => {
      const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
      const isEditable = document.activeElement && (document.activeElement.isContentEditable || activeTag === 'input' || activeTag === 'textarea');

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openPalette();
        return;
      }

      if (e.key === '/' && !isEditable && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        openPalette();
        return;
      }

      if (modal.classList.contains('is-open')) {
        if (e.key === 'Escape') {
          e.preventDefault();
          closePalette();
        }
      }
    });

    // Close on clicking backdrop
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closePalette();
    });

    // Search input typing and navigation
    input.addEventListener('input', () => {
      this.renderSlashPaletteResults(input.value.trim());
    });

    input.addEventListener('keydown', (e) => {
      const items = resultsContainer.querySelectorAll('.cal-slash-cmd-item');
      if (items.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.slashPaletteSelectedIndex = (this.slashPaletteSelectedIndex + 1) % items.length;
        this.highlightSlashPaletteItem(items);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.slashPaletteSelectedIndex = (this.slashPaletteSelectedIndex - 1 + items.length) % items.length;
        this.highlightSlashPaletteItem(items);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selectedEl = items[this.slashPaletteSelectedIndex];
        if (selectedEl) {
          const cmdId = selectedEl.dataset.cmdId;
          const query = input.value.trim();
          this.executeSlashPaletteCommand(cmdId, query);
          closePalette();
        }
      }
    });
  }

  renderSlashPaletteResults(rawQuery) {
    const container = document.getElementById('cal-slash-results');
    if (!container) return;

    let cleanQuery = rawQuery.replace(/^\//, '').toLowerCase().trim();
    const parts = cleanQuery.split(/\s+/);
    const mainKey = parts[0] || '';

    const filtered = this.slashPaletteCommands.filter(c => {
      if (!cleanQuery) return true;
      const cmdKey = c.command.replace(/^\//, '').toLowerCase();
      if (cmdKey.startsWith(mainKey) || cmdKey.includes(cleanQuery)) return true;
      if (c.title.toLowerCase().includes(cleanQuery)) return true;
      if (c.desc.toLowerCase().includes(cleanQuery)) return true;
      return false;
    });

    container.innerHTML = '';
    this.slashPaletteSelectedIndex = 0;

    if (filtered.length === 0) {
      container.innerHTML = `<div style="padding: 1rem; text-align: center; color: var(--text-muted); font-size: 0.82rem;">${this.isId() ? 'Tidak ada perintah yang cocok' : 'No matching commands found'}</div>`;
      return;
    }

    filtered.forEach((cmd, idx) => {
      const item = document.createElement('div');
      item.className = 'cal-slash-cmd-item' + (idx === 0 ? ' is-selected' : '');
      item.dataset.cmdId = cmd.id;
      item.innerHTML = `
        <div class="cal-slash-cmd-icon">${cmd.icon}</div>
        <div class="cal-slash-cmd-meta">
          <div class="cal-slash-cmd-name">
            <span>${cmd.title}</span>
            <span class="cal-slash-cmd-tag">${cmd.tag}</span>
          </div>
          <div class="cal-slash-cmd-desc">${cmd.desc}</div>
        </div>
      `;
      item.addEventListener('click', () => {
        this.executeSlashPaletteCommand(cmd.id, rawQuery);
        document.getElementById('cal-slash-palette-modal')?.classList.remove('is-open');
      });
      container.appendChild(item);
    });
  }

  highlightSlashPaletteItem(items) {
    items.forEach((item, i) => {
      item.classList.toggle('is-selected', i === this.slashPaletteSelectedIndex);
      if (i === this.slashPaletteSelectedIndex) {
        item.scrollIntoView({ block: 'nearest' });
      }
    });
  }

  executeSlashPaletteCommand(cmdId, rawQuery = '') {
    const cmd = this.slashPaletteCommands.find(c => c.id === cmdId);
    if (!cmd) return;

    let arg = '';
    if (rawQuery) {
      const trimmed = rawQuery.trim();
      const firstSpace = trimmed.indexOf(' ');
      if (firstSpace !== -1) {
        arg = trimmed.substring(firstSpace + 1).trim();
      }
    }

    cmd.action(arg);
  }

  escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

// Instantiate on DOM ready
let calAppInstance = null;
function initCalendar() {
  if (!calAppInstance) {
    calAppInstance = new AetheraCalendarApp();
    window.aetheraCalendar = calAppInstance;
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCalendar);
} else {
  initCalendar();
}
