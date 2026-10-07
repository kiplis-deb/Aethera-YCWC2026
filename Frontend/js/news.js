/**
 * AETHERA - TECH & BUSINESS NEWS ENGINE
 * Real-time aggregator client controller:
 * - Live feed fetching from /api/news with 5-min auto-refresh
 * - Instant multi-category filtering & search
 * - Web Speech API audio narration
 * - Cloud bookmarking via Aethera UserDB
 * - AI Executive Takeaways generation
 */

(function () {
  'use strict';

  class AetheraNewsController {
    constructor() {
      this.allNews = [];
      this.filteredNews = [];
      this.currentCategory = 'All';
      this.searchQuery = '';
      this.sortMode = 'newest';
      this.bookmarks = new Set();
      this.lastUpdated = null;
      this.isRefreshing = false;
      this.autoRefreshTimer = null;
      this.timeAgoTimer = null;

      // Audio Narration State
      this.speechSynth = window.speechSynthesis || null;
      this.currentUtterance = null;
      this.speakingId = null;
      this.isAudioPaused = false;

      this.init();
    }

    async init() {
      this.loadBookmarks();
      this.bindEvents();
      this.initThemeToggle();
      window.addEventListener('aethera:language-change', () => {
        this.updateTimeAgoLabel();
        this.applyFiltersAndRender();
      });
      await this.fetchNews(false);
      this.startAutoRefresh();
      this.startTimeAgoUpdater();
    }

    isId() {
      return !!(window.aetheraI18n && window.aetheraI18n.currentLang === 'id');
    }

    getLocale() {
      return this.isId() ? 'id-ID' : 'en-US';
    }

    /* --------------------------------------------------------------------------
       BOOKMARKS & STORAGE
       -------------------------------------------------------------------------- */
    loadBookmarks() {
      try {
        if (window.aetheraDB && window.aetheraDB.currentUser && window.aetheraDB.currentUser.data && window.aetheraDB.currentUser.data.newsBookmarks) {
          this.bookmarks = new Set(window.aetheraDB.currentUser.data.newsBookmarks);
        } else {
          const raw = localStorage.getItem('aethera_news_bookmarks');
          if (raw) {
            this.bookmarks = new Set(JSON.parse(raw));
          }
        }
      } catch (e) {
        this.bookmarks = new Set();
      }
      this.updateBookmarkBadge();
    }

    async saveBookmarks() {
      const arr = Array.from(this.bookmarks);
      try {
        localStorage.setItem('aethera_news_bookmarks', JSON.stringify(arr));
        if (window.aetheraDB && window.aetheraDB.currentUser) {
          const userData = window.aetheraDB.getUserData() || {};
          userData.newsBookmarks = arr;
          await window.aetheraDB.saveUserData(userData);
        }
      } catch (e) {}
      this.updateBookmarkBadge();
    }

    toggleBookmark(id) {
      if (this.bookmarks.has(id)) {
        this.bookmarks.delete(id);
      } else {
        this.bookmarks.add(id);
      }
      this.saveBookmarks();
      this.updateCardBookmarkIcons();
      if (this.currentCategory === 'Bookmarks') {
        this.applyFiltersAndRender();
      }
    }

    updateBookmarkBadge() {
      const badge = document.getElementById('bookmarks-count-badge');
      if (badge) {
        badge.textContent = this.bookmarks.size;
      }
    }

    updateCardBookmarkIcons() {
      document.querySelectorAll('.btn-bookmark-action').forEach(btn => {
        const id = btn.getAttribute('data-id');
        if (this.bookmarks.has(id)) {
          btn.classList.add('active');
          btn.setAttribute('title', 'Remove from saved');
        } else {
          btn.classList.remove('active');
          btn.setAttribute('title', 'Save to bookmarks');
        }
      });
    }

    /* --------------------------------------------------------------------------
       EVENT LISTENERS
       -------------------------------------------------------------------------- */
    bindEvents() {
      // Category Filter Pills
      document.querySelectorAll('.cat-pill').forEach(btn => {
        btn.addEventListener('click', (e) => {
          document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
          btn.classList.add('active');
          this.currentCategory = btn.getAttribute('data-category') || 'All';
          this.applyFiltersAndRender();
        });
      });

      // Search Input
      const searchInput = document.getElementById('news-search-input');
      const searchClear = document.getElementById('news-search-clear');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          this.searchQuery = e.target.value.trim().toLowerCase();
          if (searchClear) {
            searchClear.classList.toggle('visible', this.searchQuery.length > 0);
          }
          this.applyFiltersAndRender();
        });
      }

      if (searchClear) {
        searchClear.addEventListener('click', () => {
          if (searchInput) {
            searchInput.value = '';
            this.searchQuery = '';
            searchClear.classList.remove('visible');
            this.applyFiltersAndRender();
          }
        });
      }

      // Sort Select
      const sortSelect = document.getElementById('news-sort-select');
      if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
          this.sortMode = e.target.value;
          this.applyFiltersAndRender();
        });
      }

      // Refresh Button
      const refreshBtn = document.getElementById('news-refresh-btn');
      if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
          this.fetchNews(true);
        });
      }

      // Modal Close
      const modalOverlay = document.getElementById('news-ai-modal');
      const modalClose = document.getElementById('news-modal-close');
      const modalDone = document.getElementById('news-modal-done');
      if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
          if (e.target === modalOverlay) this.closeAiModal();
        });
      }
      if (modalClose) modalClose.addEventListener('click', () => this.closeAiModal());
      if (modalDone) modalDone.addEventListener('click', () => this.closeAiModal());

      // Audio Bar Controls
      const audioPauseBtn = document.getElementById('audio-pause-btn');
      const audioStopBtn = document.getElementById('audio-stop-btn');
      if (audioPauseBtn) {
        audioPauseBtn.addEventListener('click', () => this.toggleAudioPause());
      }
      if (audioStopBtn) {
        audioStopBtn.addEventListener('click', () => this.stopAudio());
      }
    }

    initThemeToggle() {
      const themeBtn = document.getElementById('news-theme-toggle');
      if (!themeBtn) return;

      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      this.updateThemeIcon(currentTheme);

      themeBtn.addEventListener('click', () => {
        if (typeof window.triggerAetheraThemeTransition === 'function') {
          window.triggerAetheraThemeTransition(800);
        } else {
          document.documentElement.classList.add('theme-transitioning');
          setTimeout(() => document.documentElement.classList.remove('theme-transitioning'), 800);
        }
        const active = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = active === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('aethera_theme', next);
        localStorage.setItem('aethera-theme', next);
        this.updateThemeIcon(next);
      });
    }

    updateThemeIcon(theme) {
      const icon = document.getElementById('news-theme-icon');
      if (!icon) return;
      if (theme === 'light') {
        icon.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
      } else {
        icon.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
      }
    }

    /* --------------------------------------------------------------------------
       DATA FETCHING & SYNC
       -------------------------------------------------------------------------- */
    async fetchNews(forceRefresh = false) {
      if (this.isRefreshing) return;
      this.isRefreshing = true;

      const refreshBtn = document.getElementById('news-refresh-btn');
      if (refreshBtn) refreshBtn.classList.add('loading');

      const grid = document.getElementById('news-cards-grid');
      if (this.allNews.length === 0 && grid) {
        this.renderSkeletons(grid, 6);
      }

      try {
        const url = `/api/news${forceRefresh ? '?refresh=true' : ''}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data && data.success && Array.isArray(data.news)) {
          this.allNews = data.news;
          this.lastUpdated = data.lastUpdated ? new Date(data.lastUpdated) : new Date();
          this.updateCategoryCounts();
          this.renderTicker(this.allNews);
          this.applyFiltersAndRender();
        }
      } catch (err) {
        console.error('[News Fetch Error]', err);
      } finally {
        this.isRefreshing = false;
        if (refreshBtn) refreshBtn.classList.remove('loading');
        this.updateTimeAgoLabel();
      }
    }

    startAutoRefresh() {
      // Periodic background refresh every 5 minutes
      if (this.autoRefreshTimer) clearInterval(this.autoRefreshTimer);
      this.autoRefreshTimer = setInterval(() => {
        this.fetchNews(true);
      }, 5 * 60 * 1000);
    }

    startTimeAgoUpdater() {
      if (this.timeAgoTimer) clearInterval(this.timeAgoTimer);
      this.timeAgoTimer = setInterval(() => {
        this.updateTimeAgoLabel();
        this.updateCardTimeLabels();
      }, 60 * 1000);
    }

    updateTimeAgoLabel() {
      const label = document.getElementById('news-last-updated-text');
      if (!label || !this.lastUpdated) return;
      const isId = this.isId();
      label.textContent = `${isId ? 'Diperbarui' : 'Updated'} ${this.formatTimeAgo(this.lastUpdated)}`;
    }

    updateCardTimeLabels() {
      document.querySelectorAll('.time-pill[data-pubdate]').forEach(el => {
        const raw = el.getAttribute('data-pubdate');
        if (raw) el.textContent = this.formatTimeAgo(new Date(raw));
      });
    }

    updateCategoryCounts() {
      const counts = {
        all: this.allNews.length,
        business: 0,
        ai: 0,
        silicon: 0,
        security: 0,
        innovation: 0
      };

      for (const item of this.allNews) {
        const cat = (item.category || '').toLowerCase();
        if (cat.includes('business') || cat.includes('vc')) counts.business++;
        else if (cat.includes('ai') || cat.includes('machine')) counts.ai++;
        else if (cat.includes('silicon') || cat.includes('deep tech')) counts.silicon++;
        else if (cat.includes('security') || cat.includes('policy')) counts.security++;
        else if (cat.includes('innovation')) counts.innovation++;
      }

      this.setCountText('cat-count-all', counts.all);
      this.setCountText('cat-count-business', counts.business);
      this.setCountText('cat-count-ai', counts.ai);
      this.setCountText('cat-count-silicon', counts.silicon);
      this.setCountText('cat-count-security', counts.security);
      this.setCountText('cat-count-innovation', counts.innovation);
    }

    setCountText(id, count) {
      const el = document.getElementById(id);
      if (el) el.textContent = count;
    }

    /* --------------------------------------------------------------------------
       FILTERING & RENDERING
       -------------------------------------------------------------------------- */
    applyFiltersAndRender() {
      let items = [...this.allNews];

      // 1. Category Filter
      if (this.currentCategory === 'Bookmarks') {
        items = items.filter(it => this.bookmarks.has(it.id));
      } else if (this.currentCategory !== 'All') {
        const target = this.currentCategory.toLowerCase();
        items = items.filter(it => {
          const cat = (it.category || '').toLowerCase();
          if (target.includes('business')) return cat.includes('business') || cat.includes('vc');
          if (target.includes('ai')) return cat.includes('ai') || cat.includes('machine');
          if (target.includes('silicon')) return cat.includes('silicon') || cat.includes('deep tech');
          if (target.includes('security')) return cat.includes('security') || cat.includes('policy');
          if (target.includes('innovation')) return cat.includes('innovation') || cat.includes('dev');
          return cat.includes(target);
        });
      }

      // 2. Search Filter
      if (this.searchQuery) {
        const q = this.searchQuery;
        items = items.filter(it =>
          (it.title || '').toLowerCase().includes(q) ||
          (it.summary || '').toLowerCase().includes(q) ||
          (it.source || '').toLowerCase().includes(q) ||
          (it.author || '').toLowerCase().includes(q) ||
          (it.category || '').toLowerCase().includes(q)
        );
      }

      // 3. Sort Order
      if (this.sortMode === 'readtime') {
        items.sort((a, b) => {
          const aMin = parseInt(a.readTime || '3', 10);
          const bMin = parseInt(b.readTime || '3', 10);
          return aMin - bMin;
        });
      } else {
        items.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
      }

      this.filteredNews = items;

      const featuredWrap = document.getElementById('news-featured-wrap');
      const grid = document.getElementById('news-cards-grid');
      const emptyState = document.getElementById('news-empty-state');

      if (!grid) return;

      if (items.length === 0) {
        if (featuredWrap) featuredWrap.style.display = 'none';
        grid.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
        return;
      }

      if (emptyState) emptyState.style.display = 'none';
      grid.style.display = 'grid';

      // If viewing "All" with no search, show the top item as Featured Story Hero Card
      if (this.currentCategory === 'All' && !this.searchQuery && items.length > 0) {
        if (featuredWrap) {
          featuredWrap.style.display = 'block';
          this.renderFeaturedStory(items[0]);
        }
        this.renderGrid(items.slice(1));
      } else {
        if (featuredWrap) featuredWrap.style.display = 'none';
        this.renderGrid(items);
      }

      this.updateCardBookmarkIcons();
      this.attachCardEventListeners();
    }

    renderFeaturedStory(item) {
      const container = document.getElementById('news-featured-wrap');
      if (!container) return;

      const isId = this.isId();
      const srcClass = this.getSourceClass(item.source);
      const isBookmarked = this.bookmarks.has(item.id);
      const isSpeaking = this.speakingId === item.id;
      const readTimeText = item.readTime
        ? (isId ? item.readTime.replace('min read', 'menit baca') : item.readTime)
        : (isId ? '3 menit baca' : '3 min read');

      const fallbackImg = this.getThematicFallbackImage(item);
      const effectiveImg = item.imageUrl || fallbackImg;

      container.innerHTML = `
        <article class="news-featured-card">
          <div class="featured-media">
            <img src="${this.escapeHtml(effectiveImg)}" alt="${this.escapeHtml(item.title)}" class="featured-img" loading="eager" onerror="if(this.src!=='${fallbackImg}'){this.src='${fallbackImg}';}">
            <div class="featured-breaking-pill">
              <span class="pulse-dot"></span>
              <span>${isId ? 'Berita Utama' : 'Featured Story'}</span>
            </div>
          </div>

          <div class="featured-content">
            <div>
              <div class="featured-meta">
                <span class="source-badge ${srcClass}">${this.escapeHtml(item.source)}</span>
                <span class="category-tag">${this.escapeHtml(item.category)}</span>
                <span class="time-pill" data-pubdate="${item.pubDate}">• ${this.formatTimeAgo(new Date(item.pubDate))}</span>
                <span class="time-pill">• ${readTimeText}</span>
              </div>
              <h2 class="featured-title">
                <a href="${this.escapeHtml(item.link)}" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: none;">
                  ${this.escapeHtml(item.title)}
                </a>
              </h2>
              <p class="featured-summary">${this.escapeHtml(item.summary)}</p>
            </div>

            <div class="featured-actions">
              <a href="${this.escapeHtml(item.link)}" target="_blank" rel="noopener noreferrer" class="btn-primary-news">
                <span>${isId ? 'Baca Selengkapnya' : 'Read Full Coverage'}</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </a>

              <button type="button" class="btn-action-icon btn-listen-action ${isSpeaking ? 'playing' : ''}" data-id="${item.id}" title="${isId ? 'Dengarkan cerita' : 'Listen to story'}">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
                <span>${isSpeaking ? (isId ? 'Mendengarkan' : 'Listening') : (isId ? 'Dengarkan' : 'Listen')}</span>
              </button>

              <button type="button" class="btn-action-icon btn-ai-action" data-id="${item.id}" title="${isId ? 'Hasilkan Ringkasan AI' : 'Generate AI Summary'}">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                <span>${isId ? 'Ringkasan AI' : 'AI Briefing'}</span>
              </button>

              <button type="button" class="btn-action-icon btn-bookmark-action ${isBookmarked ? 'active' : ''}" data-id="${item.id}" title="${isBookmarked ? (isId ? 'Hapus dari simpanan' : 'Remove bookmark') : (isId ? 'Simpan ke markah' : 'Save bookmark')}">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="${isBookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
              </button>
            </div>
          </div>
        </article>
      `;
    }

    renderGrid(items) {
      const grid = document.getElementById('news-cards-grid');
      if (!grid) return;

      grid.innerHTML = items.map(item => this.createCardHtml(item)).join('');
    }

    createCardHtml(item) {
      const isId = this.isId();
      const srcClass = this.getSourceClass(item.source);
      const isBookmarked = this.bookmarks.has(item.id);
      const isSpeaking = this.speakingId === item.id;
      const readTimeText = item.readTime
        ? (isId ? item.readTime.replace('min read', 'menit baca') : item.readTime)
        : (isId ? '3 menit baca' : '3 min read');

      const fallbackImg = this.getThematicFallbackImage(item);
      const effectiveImg = item.imageUrl || fallbackImg;

      return `
        <article class="news-card" data-id="${item.id}">
          <div class="news-card-media">
            <img src="${this.escapeHtml(effectiveImg)}" alt="${this.escapeHtml(item.title)}" class="news-card-img" loading="lazy" onerror="if(this.src!=='${fallbackImg}'){this.src='${fallbackImg}';}">
          </div>

          <div class="news-card-body">
            <div class="news-card-meta">
              <div class="news-card-meta-left">
                <span class="source-badge ${srcClass}">${this.escapeHtml(item.source)}</span>
                <span class="category-tag">${this.escapeHtml(item.category)}</span>
              </div>
              <span class="time-pill" data-pubdate="${item.pubDate}">${this.formatTimeAgo(new Date(item.pubDate))}</span>
            </div>

            <h3 class="news-card-title">
              <a href="${this.escapeHtml(item.link)}" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: none;">
                ${this.escapeHtml(item.title)}
              </a>
            </h3>

            <p class="news-card-summary">${this.escapeHtml(item.summary)}</p>

            <div class="news-card-footer">
              <span class="time-pill">${readTimeText}</span>

              <div class="news-card-actions">
                <button type="button" class="btn-card-icon btn-listen-action ${isSpeaking ? 'playing' : ''}" data-id="${item.id}" title="${isId ? 'Dengarkan ringkasan' : 'Listen to summary'}">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                </button>

                <button type="button" class="btn-card-icon btn-ai-action" data-id="${item.id}" title="${isId ? 'Poin Utama AI' : 'AI Takeaways'}">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </button>

                <button type="button" class="btn-card-icon btn-bookmark-action ${isBookmarked ? 'active' : ''}" data-id="${item.id}" title="${isBookmarked ? (isId ? 'Hapus markah' : 'Remove bookmark') : (isId ? 'Tandai berita' : 'Bookmark story')}">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="${isBookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                </button>

                <a href="${this.escapeHtml(item.link)}" target="_blank" rel="noopener noreferrer" class="btn-card-read" title="${isId ? 'Buka sumber' : 'Open source'}">
                  <span>${isId ? 'Baca' : 'Read'}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                </a>
              </div>
            </div>
          </div>
        </article>
      `;
    }

    renderTicker(items) {
      const tickerTrack = document.getElementById('news-ticker-content');
      if (!tickerTrack || !items || items.length === 0) return;

      const topStories = items.slice(0, 15);
      const html = topStories.map(it => `
        <a href="${this.escapeHtml(it.link)}" target="_blank" rel="noopener noreferrer" class="ticker-item">
          <span class="ticker-source">${this.escapeHtml(it.source)}</span>
          <span>${this.escapeHtml(it.title)}</span>
        </a>
      `).join('');

      // Duplicate for seamless infinite marquee loop
      tickerTrack.innerHTML = html + html;
    }

    renderSkeletons(container, count = 6) {
      let html = '';
      for (let i = 0; i < count; i++) {
        html += `
          <div class="skeleton-card">
            <div class="skeleton-box" style="height: 180px; width: 100%;"></div>
            <div class="skeleton-box" style="height: 16px; width: 40%;"></div>
            <div class="skeleton-box" style="height: 24px; width: 90%;"></div>
            <div class="skeleton-box" style="height: 24px; width: 75%;"></div>
            <div class="skeleton-box" style="height: 14px; width: 100%;"></div>
            <div class="skeleton-box" style="height: 14px; width: 60%;"></div>
          </div>
        `;
      }
      container.innerHTML = html;
    }

    attachCardEventListeners() {
      // Bookmark Click
      document.querySelectorAll('.btn-bookmark-action').forEach(btn => {
        btn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          const id = btn.getAttribute('data-id');
          if (id) this.toggleBookmark(id);
        };
      });

      // Listen Audio Click
      document.querySelectorAll('.btn-listen-action').forEach(btn => {
        btn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          const id = btn.getAttribute('data-id');
          if (id) this.speakStory(id);
        };
      });

      // AI Summary Click
      document.querySelectorAll('.btn-ai-action').forEach(btn => {
        btn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          const id = btn.getAttribute('data-id');
          if (id) this.openAiTakeaways(id);
        };
      });
    }

    /* --------------------------------------------------------------------------
       TEXT-TO-SPEECH NARRATION (Web Speech API)
       -------------------------------------------------------------------------- */
    speakStory(id) {
      if (!this.speechSynth) {
        alert(this.isId() ? 'Narasi audio text-to-speech tidak didukung di peramban ini.' : 'Text-to-speech audio narration is not supported in this browser.');
        return;
      }

      const item = this.allNews.find(n => n.id === id);
      if (!item) return;

      // If already speaking this story, toggle pause/play
      if (this.speakingId === id) {
        this.toggleAudioPause();
        return;
      }

      this.stopAudio();

      const text = `${item.title}. From ${item.source}. ${item.summary}`;
      this.currentUtterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance.rate = 1.0;
      this.currentUtterance.pitch = 1.0;

      this.currentUtterance.onstart = () => {
        this.speakingId = id;
        this.isAudioPaused = false;
        this.showAudioPlayer(item.title);
        this.updateListeningButtonStates();
      };

      this.currentUtterance.onend = () => {
        this.stopAudio();
      };

      this.currentUtterance.onerror = () => {
        this.stopAudio();
      };

      this.speechSynth.speak(this.currentUtterance);
    }

    toggleAudioPause() {
      if (!this.speechSynth) return;
      const player = document.getElementById('news-audio-player');
      const icon = document.getElementById('audio-pause-icon');

      if (this.speechSynth.paused) {
        this.speechSynth.resume();
        this.isAudioPaused = false;
        if (player) player.classList.remove('paused');
        if (icon) {
          icon.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;
        }
      } else if (this.speechSynth.speaking) {
        this.speechSynth.pause();
        this.isAudioPaused = true;
        if (player) player.classList.add('paused');
        if (icon) {
          icon.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
        }
      }
    }

    stopAudio() {
      if (this.speechSynth) {
        this.speechSynth.cancel();
      }
      this.speakingId = null;
      this.isAudioPaused = false;
      this.currentUtterance = null;
      const player = document.getElementById('news-audio-player');
      if (player) player.classList.remove('visible');
      this.updateListeningButtonStates();
    }

    showAudioPlayer(title) {
      const player = document.getElementById('news-audio-player');
      const titleEl = document.getElementById('audio-title-clip');
      if (titleEl) titleEl.textContent = title;
      if (player) {
        player.classList.remove('paused');
        player.classList.add('visible');
      }
    }

    updateListeningButtonStates() {
      document.querySelectorAll('.btn-listen-action').forEach(btn => {
        const id = btn.getAttribute('data-id');
        if (id === this.speakingId) {
          btn.classList.add('playing');
        } else {
          btn.classList.remove('playing');
        }
      });
    }

    /* --------------------------------------------------------------------------
       AI EXECUTIVE TAKEAWAYS MODAL
       -------------------------------------------------------------------------- */
    async openAiTakeaways(id) {
      const item = this.allNews.find(n => n.id === id);
      if (!item) return;

      const isId = this.isId();
      const modal = document.getElementById('news-ai-modal');
      const titleEl = document.getElementById('modal-story-title');
      const contentEl = document.getElementById('modal-briefing-content');

      if (titleEl) titleEl.textContent = item.title;
      if (contentEl) {
        contentEl.innerHTML = `
          <div style="display: flex; align-items: center; gap: 10px; color: var(--text-muted);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="loading" style="animation: spin 1s linear infinite;"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>
            <span>${isId ? 'Menghasilkan Ringkasan Eksekutif AI Aethera...' : 'Generating Aethera AI Executive Briefing...'}</span>
          </div>
        `;
      }

      if (modal) modal.classList.add('open');

      // Attempt AI summary via /api/ai/generate with Gemini
      let summaryHtml = '';
      try {
        const langDirective = isId ? 'CRITICAL: Provide the entire briefing in Bahasa Indonesia.' : '';
        const prompt = `You are an elite Silicon Valley tech and business analyst. Provide a crisp executive briefing for the following news item in 3 concise bullet points covering:
1. Core Innovation / What happened
2. Market, Enterprise or Startup Impact
3. Developer / Industry Strategic Takeaway

Article Title: "${item.title}"
Source: ${item.source}
Summary: ${item.summary}
${langDirective}

Format strictly as HTML <ul><li>...</li></ul> without wrapping in markdown code blocks.`;

        const res = await fetch('/api/ai/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt })
        });

        if (res.ok) {
          const data = await res.json();
          if (data && data.text) {
            summaryHtml = data.text.replace(/```html|```/g, '').trim();
          }
        }
      } catch (e) {
        console.warn('[AI Takeaways Fallback]', e.message);
      }

      // Offline / Fast Heuristic Fallback
      if (!summaryHtml) {
        if (isId) {
          summaryHtml = `
            <ul>
              <li><strong>Inovasi Utama:</strong> ${this.escapeHtml(item.title)}. Dilaporkan oleh ${this.escapeHtml(item.source)}.</li>
              <li><strong>Dampak Bisnis Strategis:</strong> Menyoroti perkembangan dinamika di sektor ${this.escapeHtml(item.category)}, memengaruhi alokasi modal, adopsi infrastruktur perusahaan, dan keunggulan kompetitif.</li>
              <li><strong>Wawasan Teknis:</strong> Tim rekayasa teknologi perlu memantau perkakas pengembang, kepatuhan standar, dan efisiensi arsitektur yang timbul dari perkembangan ini.</li>
            </ul>
          `;
        } else {
          summaryHtml = `
            <ul>
              <li><strong>Core Innovation:</strong> ${this.escapeHtml(item.title)}. Reported by ${this.escapeHtml(item.source)}.</li>
              <li><strong>Strategic Business Impact:</strong> Highlights evolving demand across ${this.escapeHtml(item.category)}, affecting capital allocation, enterprise infrastructure adoption, and competitive moats.</li>
              <li><strong>Technical Takeaway:</strong> Engineering teams should monitor developer tooling, compliance standards, and architectural efficiencies resulting from this shift.</li>
            </ul>
          `;
        }
      }

      if (contentEl) {
        contentEl.innerHTML = summaryHtml;
      }
    }

    closeAiModal() {
      const modal = document.getElementById('news-ai-modal');
      if (modal) modal.classList.remove('open');
    }

    /* --------------------------------------------------------------------------
       HELPERS
       -------------------------------------------------------------------------- */
    getThematicFallbackImage(item) {
      const THEMATIC_CAT_IMAGES = {
        'AI & Machine Learning': [
          'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1676299081847-824916de030a?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?w=800&auto=format&fit=crop&q=80'
        ],
        'Deep Tech & Silicon': [
          'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80'
        ],
        'Cybersecurity & Policy': [
          'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&auto=format&fit=crop&q=80'
        ],
        'Tech Business & VC': [
          'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80'
        ],
        'Tech Innovation': [
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80'
        ]
      };

      const category = (item && item.category) || 'Tech Innovation';
      const pool = THEMATIC_CAT_IMAGES[category] || THEMATIC_CAT_IMAGES['Tech Innovation'];
      const str = (item && (item.title || item.id)) || 'tech';
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
      }
      return pool[hash % pool.length];
    }

    getSourceClass(source) {
      if (!source) return '';
      const s = source.toLowerCase();
      if (s.includes('techcrunch')) return 'techcrunch';
      if (s.includes('ars technica')) return 'arstechnica';
      if (s.includes('hacker news')) return 'hackernews';
      if (s.includes('the verge')) return 'theverge';
      if (s.includes('bloomberg')) return 'bloomberg';
      if (s.includes('reuters')) return 'reuters';
      if (s.includes('wired')) return 'wired';
      if (s.includes('engadget')) return 'engadget';
      if (s.includes('bbc')) return 'bbc';
      return '';
    }

    formatTimeAgo(date) {
      if (!date || isNaN(date.getTime())) return this.isId() ? 'baru saja' : 'recently';
      const now = new Date();
      const diffSec = Math.floor((now - date) / 1000);
      const isId = this.isId();

      if (diffSec < 60) return isId ? 'baru saja' : 'just now';
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return isId ? `${diffMin} mnt lalu` : `${diffMin}m ago`;
      const diffHr = Math.floor(diffMin / 60);
      if (diffHr < 24) return isId ? `${diffHr} jam lalu` : `${diffHr}h ago`;
      const diffDays = Math.floor(diffHr / 24);
      if (diffDays === 1) return isId ? 'kemarin' : 'yesterday';
      if (diffDays < 7) return isId ? `${diffDays} hari lalu` : `${diffDays}d ago`;
      return date.toLocaleDateString(this.getLocale(), { month: 'short', day: 'numeric' });
    }

    escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }
  }

  // Auto-init on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new AetheraNewsController());
  } else {
    new AetheraNewsController();
  }
})();
