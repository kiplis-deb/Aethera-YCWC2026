/**
 * AETHERA AI PROXY & APPLICATION SERVER
 * Lightweight, zero-dependency Node.js HTTP server.
 * Proxies Google Gemini API calls using the server-side GEMINI_API_KEY (.env)
 * so the API key remains strictly on the backend and is never exposed to the client.
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');
const os = require('os');
const crypto = require('crypto');
const zlib = require('zlib');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = path.resolve(__dirname, '..');
const FRONTEND_DIR = path.join(ROOT_DIR, 'Frontend');
const DB_FILE = path.join(__dirname, 'db.json');

// Discover active .env location (prefer Backend/.env, fallback to ROOT_DIR/.env)
function getEnvPath() {
  const backendEnv = path.join(__dirname, '.env');
  if (fs.existsSync(backendEnv)) return backendEnv;
  return path.join(ROOT_DIR, '.env');
}

// Discover LAN IPv4 address for multi-device network testing
function getLocalNetworkIp() {
  try {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name]) {
        if (iface.family === 'IPv4' && !iface.internal) {
          return iface.address;
        }
      }
    }
  } catch (e) {}
  return '127.0.0.1';
}

// Load environment variables from .env file if present
function loadEnv() {
  const envPath = getEnvPath();
  if (fs.existsSync(envPath)) {
    try {
      const content = fs.readFileSync(envPath, 'utf8');
      content.split(/\r?\n/).forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const idx = trimmed.indexOf('=');
          const key = trimmed.substring(0, idx).trim();
          let val = trimmed.substring(idx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      });
      console.log(`[Aethera Server] Loaded environment from: ${envPath}`);
    } catch (e) {
      console.warn('[Aethera Server] Failed to read .env file:', e.message);
    }
  }
}
loadEnv();

// Standard MIME types for static assets
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.txt': 'text/plain; charset=utf-8',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav'
};

function sendJSON(res, status, data, req = null) {
  const body = JSON.stringify(data);
  const acceptEncoding = (req && req.headers && req.headers['accept-encoding']) || 
                         (res.req && res.req.headers && res.req.headers['accept-encoding']) || '';
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Private-Network': 'true',
    'Vary': 'Accept-Encoding'
  };

  if (body.length > 1024 && acceptEncoding.includes('gzip')) {
    headers['Content-Encoding'] = 'gzip';
    zlib.gzip(body, (err, compressed) => {
      if (err) {
        delete headers['Content-Encoding'];
        res.writeHead(status, headers);
        return res.end(body);
      }
      res.writeHead(status, headers);
      res.end(compressed);
    });
  } else {
    res.writeHead(status, headers);
    res.end(body);
  }
}

function parseBody(req) {
  // If running in Vercel or middleware where body is already parsed
  if (req.body && typeof req.body === 'object') {
    return Promise.resolve(req.body);
  }
  if (typeof req.body === 'string') {
    try {
      return Promise.resolve(JSON.parse(req.body));
    } catch (_) {
      return Promise.resolve({});
    }
  }

  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 25 * 1024 * 1024) { // 25MB limit for multimodal payloads
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(new Error('Invalid JSON payload'));
      }
    });
    req.on('error', reject);
  });
}

/* --------------------------------------------------------------------------
   SECURE DATABASE & AUTH ENGINE (SUPABASE POSTGRESQL + LOCAL FALLBACK)
   -------------------------------------------------------------------------- */
const dbService = require('./db-service');
const getDB = () => dbService.getLocalDB();
const saveDB = (data) => dbService.saveLocalDB(data);
const hashPassword = dbService.hashPassword;
const verifyPassword = dbService.verifyPassword;


/* --------------------------------------------------------------------------
   GEMINI AI SECURE BACKEND PROXY (HIGH SPEED OPTIMIZED)
   Keeps the API key safely on the server and attaches it to outbound calls.
   Uses persistent HTTPS keep-alive connection pooling, latency-optimized model routing,
   SSE zero-buffering headers, and an in-memory cache for ultra-fast response times.
   -------------------------------------------------------------------------- */
const geminiHttpsAgent = new https.Agent({
  keepAlive: true,
  keepAliveMsecs: 60000,
  maxSockets: 64,
  maxFreeSockets: 16,
  timeout: 35000
});

const GEMINI_MODELS_CHAIN = [
  'gemini-flash-lite-latest',
  'gemini-3.1-flash-lite',
  'gemini-3.5-flash-lite',
  'gemini-3.6-flash',
  'gemini-flash-latest',
  'gemini-3.8-flash',
  'gemini-3.5-flash'
];

// High-performance in-memory cache for repeated prompts (TTL: 10 minutes)
const aiResponseCache = new Map();
const MAX_AI_CACHE_SIZE = 150;
const AI_CACHE_TTL_MS = 10 * 60 * 1000;

function getAiCacheKey(payload, model) {
  if (!payload) return null;
  const rawContents = payload.contents || payload.prompt || payload.text;
  if (!rawContents) return null;
  const str = JSON.stringify(rawContents);
  if (str.length > 5000 || str.includes('inlineData') || str.includes('base64')) {
    return null;
  }
  const sys = JSON.stringify(payload.systemInstruction || payload.system_instruction || '');
  return crypto.createHash('sha256').update(`${model}::${sys}::${str}`).digest('hex');
}

function getCachedAiResponse(key) {
  if (!key) return null;
  const entry = aiResponseCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > AI_CACHE_TTL_MS) {
    aiResponseCache.delete(key);
    return null;
  }
  return entry.data;
}

function setCachedAiResponse(key, data) {
  if (!key || !data) return;
  if (aiResponseCache.size >= MAX_AI_CACHE_SIZE) {
    const oldestKey = aiResponseCache.keys().next().value;
    aiResponseCache.delete(oldestKey);
  }
  aiResponseCache.set(key, { data, timestamp: Date.now() });
}

function resolveGeminiModel(requestedModel) {
  if (!requestedModel || typeof requestedModel !== 'string') {
    return 'gemini-flash-lite-latest';
  }
  const m = requestedModel.toLowerCase().trim();
  if (m === 'gemini-flash-lite-latest' || m === 'gemini-3.1-flash-lite' || m === 'gemini-3.5-flash-lite') {
    return m;
  }
  if (m === 'gemini-3.6-flash' || m.includes('3.6')) {
    return 'gemini-3.6-flash';
  }
  if (m === 'gemini-3.8-flash' || m.includes('3.8')) {
    return 'gemini-3.8-flash';
  }
  if (m === 'gemini-flash-latest') {
    return 'gemini-flash-latest';
  }
  if (m.includes('lite')) {
    return 'gemini-flash-lite-latest';
  }
  // Route legacy/rate-limited aliases (3.5, 2.5, 2.0, 1.5) to ultra-fast flash-lite
  if (m.includes('3.5') || m.includes('2.5') || m.includes('2.0') || m.includes('1.5')) {
    return 'gemini-flash-lite-latest';
  }
  return requestedModel.trim() || 'gemini-flash-lite-latest';
}

function getNextFallbackModel(currentModel, triedModels = []) {
  const tried = Array.isArray(triedModels) ? triedModels : [triedModels];
  for (const m of GEMINI_MODELS_CHAIN) {
    if (m !== currentModel && !tried.includes(m)) {
      return m;
    }
  }
  return null;
}

function normalizePayloadContents(payload) {
  if (payload.contents && Array.isArray(payload.contents) && payload.contents.length > 0) {
    return payload.contents;
  }
  if (payload.prompt || payload.text) {
    return [{ role: 'user', parts: [{ text: payload.prompt || payload.text }] }];
  }
  return [];
}

function proxyGeminiGenerate(req, res, payload, attemptModel = null, triedModels = []) {
  if (req && req.socket) {
    try { req.socket.setNoDelay(true); } catch (_) {}
  }
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';
  if (!apiKey) {
    return sendJSON(res, 503, {
      error: { message: 'No Gemini API key configured on server. Set GEMINI_API_KEY in .env.' }
    });
  }

  const model = attemptModel || resolveGeminiModel(payload.model);
  const currentTried = [...triedModels, model];

  // Check cache for identical requests
  const cacheKey = getAiCacheKey(payload, model);
  if (!attemptModel && cacheKey) {
    const cached = getCachedAiResponse(cacheKey);
    if (cached) {
      return sendJSON(res, 200, { ...cached, _cached: true }, req);
    }
  }

  const normalizedContents = normalizePayloadContents(payload);
  const postData = JSON.stringify({
    contents: normalizedContents,
    systemInstruction: payload.systemInstruction || payload.system_instruction,
    generationConfig: payload.generationConfig || { maxOutputTokens: 2048, temperature: 0.7 },
    safetySettings: payload.safetySettings
  });

  const urlObj = new URL(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`);

  const options = {
    hostname: urlObj.hostname,
    path: urlObj.pathname + urlObj.search,
    method: 'POST',
    agent: geminiHttpsAgent,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const proxyReq = https.request(options, (proxyRes) => {
    let responseData = '';
    proxyRes.on('data', chunk => responseData += chunk);
    proxyRes.on('end', () => {
      // If 429 Rate Limit, 503 High Demand, or 404 Model Not Found, failover to next model
      if (proxyRes.statusCode === 429 || proxyRes.statusCode === 503 || proxyRes.statusCode === 404) {
        const nextModel = getNextFallbackModel(model, currentTried);
        if (nextModel) {
          console.log(`[Proxy] Model ${model} returned ${proxyRes.statusCode}. Failing over to ${nextModel}...`);
          return proxyGeminiGenerate(req, res, payload, nextModel, currentTried);
        }
      }

      try {
        const json = JSON.parse(responseData);
        // Enrich response with direct access fields for simplified consumers
        if (json.candidates && json.candidates[0]?.content?.parts) {
          const directText = json.candidates[0].content.parts.map(p => p.text || '').join('\n');
          json.text = directText;
          json.reply = directText;
        }
        if (proxyRes.statusCode === 200 && cacheKey) {
          setCachedAiResponse(cacheKey, json);
        }
        return sendJSON(res, proxyRes.statusCode, json, req);
      } catch (e) {
        res.writeHead(proxyRes.statusCode, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(responseData);
      }
    });
  });

  proxyReq.on('error', (err) => {
    console.error('[Gemini Proxy Error]', err.message);
    const nextModel = getNextFallbackModel(model, currentTried);
    if (nextModel) {
      console.log(`[Proxy] Connection error on ${model}. Retrying with ${nextModel}...`);
      return proxyGeminiGenerate(req, res, payload, nextModel, currentTried);
    }
    return sendJSON(res, 502, { error: { message: `Backend proxy connection failed: ${err.message}` } });
  });

  proxyReq.write(postData);
  proxyReq.end();
}

function proxyGeminiStream(req, res, payload, attemptModel = null, triedModels = []) {
  if (req && req.socket) {
    try { req.socket.setNoDelay(true); } catch (_) {}
  }
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';
  if (!apiKey) {
    res.writeHead(503, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
      'Access-Control-Allow-Origin': '*'
    });
    res.write('data: {"error": {"message": "No Gemini API key configured on server. Set GEMINI_API_KEY in .env."}}\n\n');
    res.end();
    return;
  }

  const model = attemptModel || resolveGeminiModel(payload.model);
  const currentTried = [...triedModels, model];

  // Check cache for instant SSE replay
  const cacheKey = getAiCacheKey(payload, model);
  if (!attemptModel && cacheKey) {
    const cached = getCachedAiResponse(cacheKey);
    if (cached) {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      });
      if (typeof res.flushHeaders === 'function') res.flushHeaders();
      res.write(`data: ${JSON.stringify(cached)}\n\n`);
      res.end();
      return;
    }
  }

  const normalizedContents = normalizePayloadContents(payload);
  const postData = JSON.stringify({
    contents: normalizedContents,
    systemInstruction: payload.systemInstruction || payload.system_instruction,
    generationConfig: payload.generationConfig || { maxOutputTokens: 2048, temperature: 0.7 },
    safetySettings: payload.safetySettings
  });

  const urlObj = new URL(`https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${encodeURIComponent(apiKey)}`);

  const options = {
    hostname: urlObj.hostname,
    path: urlObj.pathname + urlObj.search,
    method: 'POST',
    agent: geminiHttpsAgent,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const proxyReq = https.request(options, (proxyRes) => {
    // If not 2xx (e.g. 503, 429, 404, 500), fail over to next available model before sending SSE headers
    if (proxyRes.statusCode < 200 || proxyRes.statusCode >= 300) {
      let errBody = '';
      proxyRes.on('data', chunk => errBody += chunk);
      proxyRes.on('end', () => {
        const nextModel = getNextFallbackModel(model, currentTried);
        if (nextModel) {
          console.log(`[Stream Proxy] Model ${model} returned ${proxyRes.statusCode}. Failing over to ${nextModel}...`);
          return proxyGeminiStream(req, res, payload, nextModel, currentTried);
        }
        try {
          const errJson = JSON.parse(errBody);
          return sendJSON(res, proxyRes.statusCode, errJson);
        } catch (_) {
          return sendJSON(res, proxyRes.statusCode, { error: { message: errBody || `Google API error ${proxyRes.statusCode}` } });
        }
      });
      return;
    }

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    if (typeof res.flushHeaders === 'function') {
      res.flushHeaders();
    }

    const streamChunks = [];
    proxyRes.on('data', chunk => {
      res.write(chunk);
      if (cacheKey) streamChunks.push(chunk);
    });

    proxyRes.on('end', () => {
      res.end();
      if (cacheKey && streamChunks.length > 0) {
        try {
          const fullText = Buffer.concat(streamChunks).toString('utf8');
          const lines = fullText.split('\n');
          const combinedParts = [];
          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('data:')) {
              const c = JSON.parse(trimmed.slice(5).trim());
              if (c.candidates?.[0]?.content?.parts) {
                combinedParts.push(...c.candidates[0].content.parts);
              }
            }
          }
          if (combinedParts.length > 0) {
            const fullReply = combinedParts.map(p => p.text || '').join('');
            setCachedAiResponse(cacheKey, {
              candidates: [{ content: { parts: combinedParts, role: 'model' } }],
              text: fullReply,
              reply: fullReply
            });
          }
        } catch (_) {}
      }
    });
  });

  proxyReq.on('error', (err) => {
    console.error('[Gemini Stream Proxy Error]', err.message);
    const nextModel = getNextFallbackModel(model, currentTried);
    if (nextModel && !res.headersSent) {
      console.log(`[Stream Proxy] Connection error on ${model}. Retrying with ${nextModel}...`);
      return proxyGeminiStream(req, res, payload, nextModel, currentTried);
    }
    if (!res.headersSent) {
      sendJSON(res, 502, { error: { message: `Backend stream proxy failed: ${err.message}` } });
    } else {
      res.end();
    }
  });

  proxyReq.write(postData);
  proxyReq.end();
}

/* --------------------------------------------------------------------------
   TECH & TECH BUSINESS NEWS SERVICE
   Aggregates live RSS and APIs: TechCrunch, Ars Technica, Hacker News, Google News.
   Provides in-memory 5-minute caching, entity decoding, and offline fallbacks.
   -------------------------------------------------------------------------- */
const newsCache = {
  lastUpdated: 0,
  items: []
};

function fetchNewsHttp(targetUrl, maxRedirects = 3) {
  return new Promise((resolve, reject) => {
    if (maxRedirects < 0) return reject(new Error('Too many redirects'));
    const isHttps = targetUrl.startsWith('https://');
    const client = isHttps ? https : http;
    const req = client.get(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,application/json,*/*;q=0.8'
      },
      timeout: 8000
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          const parsed = new URL(targetUrl);
          redirectUrl = new URL(redirectUrl, parsed.origin).href;
        }
        return fetchNewsHttp(redirectUrl, maxRedirects - 1).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP status ${res.statusCode}`));
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('timeout', () => { req.destroy(); reject(new Error('Request timeout')); });
    req.on('error', reject);
  });
}

function decodeNewsEntities(str) {
  if (!str) return '';
  return str
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .replace(/&hellip;/g, '…')
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"');
}

function stripNewsHtml(str) {
  if (!str) return '';
  const decoded = decodeNewsEntities(str);
  return decoded.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function extractRssImage(itemBlock) {
  // 1. media:content, media:thumbnail, or enclosure tags
  const mediaMatch = itemBlock.match(/<(?:media:content|media:thumbnail|enclosure)[^>]+url=["']([^"']+)["']/i) ||
                     itemBlock.match(/url=["'](https?:\/\/[^"'\s>]+\.(?:jpg|jpeg|png|webp|avif)[^"'\s>]*)["']/i);
  if (mediaMatch && mediaMatch[1] && !mediaMatch[1].includes('favicon') && !mediaMatch[1].includes('logo-')) {
    return mediaMatch[1].replace(/&amp;/g, '&');
  }

  // 2. <img> tags (standard or html-escaped)
  const imgMatch = itemBlock.match(/<img[^>]+src=["']([^"']+)["']/i) ||
                   itemBlock.match(/&lt;img[^&]+src=["']([^"']+)["']/i) ||
                   itemBlock.match(/&lt;img[^&]+src=&quot;([^&]+)&quot;/i);
  if (imgMatch && imgMatch[1] && !imgMatch[1].includes('favicon') && !imgMatch[1].includes('logo-')) {
    return imgMatch[1].replace(/&amp;/g, '&');
  }

  return '';
}

const THEMATIC_TECH_IMAGES = {
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

function getThematicImageUrl(title, category = 'Tech Innovation') {
  const pool = THEMATIC_TECH_IMAGES[category] || THEMATIC_TECH_IMAGES['Tech Innovation'];
  let hash = 0;
  const s = String(title || '');
  for (let i = 0; i < s.length; i++) {
    hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
  }
  return pool[hash % pool.length];
}

function parseNewsRss(xmlText, defaultSource, defaultCategory) {
  const items = [];
  const itemMatches = xmlText.matchAll(/<item[\s\S]*?<\/item>/gi);
  for (const match of itemMatches) {
    const itemBlock = match[0];
    const titleMatch = itemBlock.match(/<title[\s\S]*?>([\s\S]*?)<\/title>/i);
    const linkMatch = itemBlock.match(/<link[\s\S]*?>([\s\S]*?)<\/link>/i);
    const pubDateMatch = itemBlock.match(/<pubDate[\s\S]*?>([\s\S]*?)<\/pubDate>/i);
    const descMatch = itemBlock.match(/<(description|content:encoded)[\s\S]*?>([\s\S]*?)<\/\1>/i);
    const creatorMatch = itemBlock.match(/<(dc:creator|author)[\s\S]*?>([\s\S]*?)<\/\1>/i);
    const sourceTagMatch = itemBlock.match(/<source[^>]*>([\s\S]*?)<\/source>/i);

    let imageUrl = extractRssImage(itemBlock);

    let title = stripNewsHtml(titleMatch ? titleMatch[1] : '');
    const link = stripNewsHtml(linkMatch ? linkMatch[1] : '');
    const rawPubDate = pubDateMatch ? pubDateMatch[1] : '';
    const summary = stripNewsHtml(descMatch ? descMatch[2] : '').substring(0, 320);
    let author = stripNewsHtml(creatorMatch ? creatorMatch[2] : '');
    let source = defaultSource;

    // If source tag is present (e.g. Google News), use it
    if (sourceTagMatch && sourceTagMatch[1]) {
      source = stripNewsHtml(sourceTagMatch[1]);
    } else if (title.includes(' - ')) {
      // E.g. "Nvidia hits new high - Bloomberg"
      const lastDash = title.lastIndexOf(' - ');
      const possibleSource = title.substring(lastDash + 3).trim();
      if (possibleSource.length > 1 && possibleSource.length < 30) {
        source = possibleSource;
        title = title.substring(0, lastDash).trim();
      }
    }

    if (!author) author = source;
    let pubDate = new Date().toISOString();
    if (rawPubDate) {
      try {
        const parsedDate = new Date(rawPubDate);
        if (!isNaN(parsedDate.getTime())) pubDate = parsedDate.toISOString();
      } catch (e) {}
    }

    // Auto-categorize by content keywords
    let category = defaultCategory || 'Tech Business & VC';
    const combined = (title + ' ' + summary).toLowerCase();
    if (combined.includes('ai') || combined.includes('llm') || combined.includes('gpt') || combined.includes('gemini') || combined.includes('anthropic') || combined.includes('nvidia') || combined.includes('openai') || combined.includes('deep learning')) {
      category = 'AI & Machine Learning';
    } else if (combined.includes('startup') || combined.includes('venture') || combined.includes('funding') || combined.includes('series a') || combined.includes('series b') || combined.includes('ipo') || combined.includes('acquisition') || combined.includes('revenue') || combined.includes('valuation') || combined.includes('earnings')) {
      category = 'Tech Business & VC';
    } else if (combined.includes('chip') || combined.includes('semiconductor') || combined.includes('hardware') || combined.includes('gpu') || combined.includes('cpu') || combined.includes('quantum') || combined.includes('robotics')) {
      category = 'Deep Tech & Silicon';
    } else if (combined.includes('security') || combined.includes('breach') || combined.includes('ransomware') || combined.includes('hacker') || combined.includes('vulnerability') || combined.includes('cve') || combined.includes('privacy') || combined.includes('regulation') || combined.includes('antitrust')) {
      category = 'Cybersecurity & Policy';
    }

    // Assign rich thematic image if no direct RSS image was found
    if (!imageUrl) {
      imageUrl = getThematicImageUrl(title, category);
    }

    // Estimated read time (average 200 words/min, minimum 2 min)
    const wordCount = (title + ' ' + summary).split(/\s+/).length + 300;
    const readTimeMin = Math.max(2, Math.round(wordCount / 180));

    if (title && link) {
      items.push({
        id: crypto.createHash('md5').update(link).digest('hex').substring(0, 16),
        title,
        link,
        source,
        category,
        author,
        pubDate,
        readTime: `${readTimeMin} min read`,
        summary: summary.length > 20 ? summary + (summary.length >= 320 ? '...' : '') : `Read the full in-depth report on ${source}.`,
        imageUrl: imageUrl || getThematicImageUrl(title, category)
      });
    }
  }
  return items;
}

const FALLBACK_TECH_NEWS = [
  {
    id: 'fb_tech_01',
    title: 'OpenAI Unveils Next-Gen Reasoning Models with Advanced Chain-of-Thought Workflows',
    link: 'https://techcrunch.com/category/artificial-intelligence/',
    source: 'TechCrunch',
    category: 'AI & Machine Learning',
    author: 'Kyle Wiggers',
    pubDate: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    readTime: '4 min read',
    summary: 'The new model architecture emphasizes verifiable logical deduction, multi-step problem solving, and reduced hallucination rates for mission-critical enterprise engineering.',
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'fb_tech_02',
    title: 'NVIDIA Expands AI Factory Ecosystem as Enterprise Cloud Compute Demand Surges',
    link: 'https://www.reuters.com/technology/',
    source: 'Reuters',
    category: 'Deep Tech & Silicon',
    author: 'Max Cherney',
    pubDate: new Date(Date.now() - 48 * 60 * 1000).toISOString(),
    readTime: '3 min read',
    summary: 'NVIDIA announces expanded partnerships across global data centers and telecom providers to accelerate Blackwell architecture rollouts, meeting relentless enterprise inference demands.',
    imageUrl: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'fb_tech_03',
    title: 'Silicon Valley Venture Capital Rebounds: AI Infrastructure & Defense Tech Lead Q3 Inflows',
    link: 'https://techcrunch.com/category/startups/',
    source: 'TechCrunch',
    category: 'Tech Business & VC',
    author: 'Alex Wilhelm',
    pubDate: new Date(Date.now() - 72 * 60 * 1000).toISOString(),
    readTime: '5 min read',
    summary: 'Venture funding in Q3 showed substantial momentum, driven by mega-rounds for developer-first foundation models, autonomous agents, and sovereign cloud infrastructure startups.',
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'fb_tech_04',
    title: 'Global Regulators Finalize Unified Cybersecurity Governance Framework for Autonomous Software',
    link: 'https://arstechnica.com/security/',
    source: 'Ars Technica',
    category: 'Cybersecurity & Policy',
    author: 'Dan Goodin',
    pubDate: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
    readTime: '4 min read',
    summary: 'A new joint cyber-defense initiative establishes mandatory memory-safety audits, cryptographic provenance, and automated vulnerability patching for generative and agentic systems.',
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'fb_tech_05',
    title: 'Show HN: Distributed Real-Time Stream Engine Written in Rust with Zero-Copy Serialization',
    link: 'https://news.ycombinator.com',
    source: 'Hacker News',
    category: 'Tech Innovation',
    author: 'algotrader',
    pubDate: new Date(Date.now() - 140 * 60 * 1000).toISOString(),
    readTime: '3 min read',
    summary: '420 points | 115 comments on Hacker News. A lightweight, high-throughput pipeline designed for millisecond financial event telemetry and high-frequency analytical databases.',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80'
  }
];

async function getAggregatedTechNews(forceRefresh = false) {
  const now = Date.now();
  const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

  if (!forceRefresh && newsCache.items.length > 0 && (now - newsCache.lastUpdated < CACHE_TTL_MS)) {
    return {
      cached: true,
      lastUpdated: newsCache.lastUpdated,
      items: newsCache.items
    };
  }

  try {
    const [wiredRes, bbcRes, engadgetRes, tcRes, arsRes, hnRes, googleRes] = await Promise.allSettled([
      fetchNewsHttp('https://www.wired.com/feed/rss'),
      fetchNewsHttp('https://feeds.bbci.co.uk/news/technology/rss.xml'),
      fetchNewsHttp('https://www.engadget.com/rss.xml'),
      fetchNewsHttp('https://techcrunch.com/feed/'),
      fetchNewsHttp('https://feeds.arstechnica.com/arstechnica/index'),
      fetchNewsHttp('https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=30'),
      fetchNewsHttp('https://news.google.com/rss/search?q=technology+business&hl=en-US&gl=US&ceid=US:en')
    ]);

    let collected = [];

    if (wiredRes.status === 'fulfilled') {
      try {
        collected.push(...parseNewsRss(wiredRes.value, 'Wired', 'Deep Tech & Silicon'));
      } catch (e) {
        console.warn('[News] Wired Parse error:', e.message);
      }
    }

    if (bbcRes.status === 'fulfilled') {
      try {
        collected.push(...parseNewsRss(bbcRes.value, 'BBC Tech', 'Tech Innovation'));
      } catch (e) {
        console.warn('[News] BBC Parse error:', e.message);
      }
    }

    if (engadgetRes.status === 'fulfilled') {
      try {
        collected.push(...parseNewsRss(engadgetRes.value, 'Engadget', 'Tech Innovation'));
      } catch (e) {
        console.warn('[News] Engadget Parse error:', e.message);
      }
    }

    if (tcRes.status === 'fulfilled') {
      try {
        collected.push(...parseNewsRss(tcRes.value, 'TechCrunch', 'Tech Business & VC'));
      } catch (e) {
        console.warn('[News] TC Parse error:', e.message);
      }
    }

    if (arsRes.status === 'fulfilled') {
      try {
        collected.push(...parseNewsRss(arsRes.value, 'Ars Technica', 'Deep Tech & Silicon'));
      } catch (e) {
        console.warn('[News] Ars Parse error:', e.message);
      }
    }

    if (hnRes.status === 'fulfilled') {
      try {
        const hnJson = JSON.parse(hnRes.value);
        if (hnJson && Array.isArray(hnJson.hits)) {
          for (const hit of hnJson.hits) {
            const title = stripNewsHtml(hit.title || '');
            const link = hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`;
            let category = 'Tech Innovation';
            const comb = title.toLowerCase();
            if (comb.includes('ai') || comb.includes('llm') || comb.includes('gpt')) category = 'AI & Machine Learning';
            else if (comb.includes('business') || comb.includes('startup') || comb.includes('vc')) category = 'Tech Business & VC';
            else if (comb.includes('security') || comb.includes('breach')) category = 'Cybersecurity & Policy';
            else if (comb.includes('chip') || comb.includes('cpu') || comb.includes('hardware')) category = 'Deep Tech & Silicon';

            if (title && link) {
              collected.push({
                id: 'hn_' + hit.objectID,
                title,
                link,
                source: 'Hacker News',
                category,
                author: hit.author || 'Hacker News',
                pubDate: hit.created_at ? new Date(hit.created_at).toISOString() : new Date().toISOString(),
                readTime: '3 min read',
                summary: `${hit.points || 0} points · ${hit.num_comments || 0} discussion comments by developer community on Hacker News.`,
                imageUrl: getThematicImageUrl(title, category)
              });
            }
          }
        }
      } catch (e) {
        console.warn('[News] HN Parse error:', e.message);
      }
    }

    if (googleRes.status === 'fulfilled') {
      try {
        collected.push(...parseNewsRss(googleRes.value, 'Tech Business', 'Tech Business & VC'));
      } catch (e) {
        console.warn('[News] Google News Parse error:', e.message);
      }
    }

    // Deduplicate by normalized title
    const seen = new Set();
    const deduped = [];
    for (const item of collected) {
      const key = item.title.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 42);
      if (!seen.has(key)) {
        seen.add(key);
        deduped.push(item);
      }
    }

    // Sort newest first
    deduped.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    if (deduped.length > 0) {
      newsCache.items = deduped;
      newsCache.lastUpdated = now;
      return {
        cached: false,
        lastUpdated: now,
        items: deduped
      };
    }
  } catch (err) {
    console.error('[News Aggregator Error]', err.message);
  }

  // Fallback if empty
  if (newsCache.items.length === 0) {
    newsCache.items = FALLBACK_TECH_NEWS;
    newsCache.lastUpdated = now;
  }

  return {
    cached: false,
    lastUpdated: newsCache.lastUpdated,
    items: newsCache.items
  };
}

/* --------------------------------------------------------------------------
   HTTP SERVER & ROUTER
   -------------------------------------------------------------------------- */
async function handleRequest(req, res) {
  const matchedPath = req.headers && (req.headers['x-matched-path'] || req.headers['x-now-route-matches']);
  let rawUrl = req.url || '/';
  if (matchedPath && (rawUrl === '/api/index.js' || rawUrl === '/api' || rawUrl.startsWith('/api?'))) {
    rawUrl = matchedPath;
  }
  const parsedUrl = url.parse(rawUrl, true);
  const pathname = parsedUrl.pathname || '/';

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Private-Network': 'true'
    });
    res.end();
    return;
  }

  /* --- API ROUTES --- */
  if (pathname.startsWith('/api/')) {
    try {
      // 1. Config: Check AI Engine Status (NEVER leaks raw key to client)
      if (pathname === '/api/config/ai-key' && req.method === 'GET') {
        const envKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';
        return sendJSON(res, 200, {
          hasKey: !!envKey,
          serverConfigured: !!envKey,
          model: 'gemini-flash-lite-latest'
        });
      }

      // 2. Config: Save/Update AI API Key in .env and server process
      if (pathname === '/api/config/ai-key' && req.method === 'POST') {
        const body = await parseBody(req);
        let rawKey = body.key || '';
        if (typeof rawKey === 'string') {
          rawKey = rawKey.trim().replace(/^["'`]+|["'`]+$/g, '').trim();
          process.env.GEMINI_API_KEY = rawKey;
          try {
            const envPath = getEnvPath();
            let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
            if (/^GEMINI_API_KEY=.*$/m.test(envContent)) {
              envContent = envContent.replace(/^GEMINI_API_KEY=.*$/m, `GEMINI_API_KEY=${rawKey}`);
            } else {
              envContent += (envContent.endsWith('\n') || !envContent ? '' : '\n') + `GEMINI_API_KEY=${rawKey}\n`;
            }
            fs.writeFileSync(envPath, envContent, 'utf8');
            // Keep root .env in sync if it also exists
            const rootEnv = path.join(ROOT_DIR, '.env');
            if (fs.existsSync(rootEnv) && rootEnv !== envPath) {
              try { fs.writeFileSync(rootEnv, envContent, 'utf8'); } catch (_) {}
            }
            console.log('[Server] Saved GEMINI_API_KEY to', envPath);
          } catch (e) {
            console.warn('[Server] Could not write to .env:', e.message);
          }
          return sendJSON(res, 200, { success: true, saved: true, hasKey: !!rawKey });
        }
        return sendJSON(res, 400, { error: 'Invalid key payload' });
      }

      // 3. AI Proxy: Generate Content (Server-Side Inference)
      if (pathname === '/api/ai/generate' && req.method === 'POST') {
        const body = await parseBody(req);
        return proxyGeminiGenerate(req, res, body);
      }

      // 4. AI Proxy: Stream Generate Content (Server-Side SSE Stream)
      if (pathname === '/api/ai/stream' && req.method === 'POST') {
        const body = await parseBody(req);
        return proxyGeminiStream(req, res, body);
      }

function getDefaultStarterNotes(username) {
  const now = new Date().toISOString();
  return [
    {
      id: 'note_welcome_' + Date.now().toString(36),
      title: 'Welcome to Aethera Notes',
      icon: '✨',
      cover: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      folder: 'Private',
      tags: ['Guide', 'Getting Started'],
      pinned: true,
      favorite: true,
      blocks: [
        { id: 'b1', type: 'callout', icon: '💡', text: 'Welcome to your synced workspace! Everything you write here syncs automatically across all your devices logged into Aethera.' },
        { id: 'b2', type: 'h1', text: 'Quick Start Features' },
        { id: 'b3', type: 'todo', text: 'Type / anywhere in a note to open the Notion slash menu', checked: true },
        { id: 'b4', type: 'todo', text: 'Try creating to-do items, code blocks, or callouts', checked: true },
        { id: 'b5', type: 'todo', text: 'Click "AI Assistant" to generate summaries or brainstorm ideas', checked: false },
        { id: 'b6', type: 'todo', text: 'Check the left sidebar for your synced upcoming calendar events', checked: false },
        { id: 'b7', type: 'h2', text: 'Keyboard Shortcuts' },
        { id: 'b8', type: 'bullet', text: 'Ctrl + K: Quick search across all notes' },
        { id: 'b9', type: 'bullet', text: 'Ctrl + S: Instant force cloud sync' },
        { id: 'b10', type: 'bullet', text: '/ : Open block command palette' }
      ],
      createdAt: now,
      updatedAt: now
    }
  ];
}

      // 5. Auth: Register (No demo accounts, creates real salted scrypt user)
      if (pathname === '/api/auth/register' && req.method === 'POST') {
        const body = await parseBody(req);
        const username = typeof body.username === 'string' ? body.username.trim().toLowerCase() : '';
        const password = typeof body.password === 'string' ? body.password : '';
        if (!/^[a-zA-Z0-9_-]{3,30}$/.test(username)) {
          return sendJSON(res, 400, { error: 'Username must be 3-30 alphanumeric characters.' });
        }
        if (password.length < 6) {
          return sendJSON(res, 400, { error: 'Password must be at least 6 characters long.' });
        }
        const existing = await dbService.findUser(username);
        if (existing) {
          return sendJSON(res, 409, { error: 'Username is already registered.' });
        }
        const { salt, hash } = dbService.hashPassword(password);
        const token = 'tok_' + crypto.randomBytes(24).toString('hex');
        const newUser = {
          id: 'u_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
          username,
          displayName: body.displayName ? String(body.displayName).trim() : username,
          salt,
          hash,
          data: {
            calendar: [],
            chats: [],
            notes: getDefaultStarterNotes(username)
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        await dbService.saveUser(newUser);
        await dbService.saveToken(token, username);
        return sendJSON(res, 201, {
          success: true,
          token,
          user: { id: newUser.id, username: newUser.username, displayName: newUser.displayName }
        });
      }

      // 6. Auth: Login (Verifies salted scrypt hash with timing-safe check)
      if (pathname === '/api/auth/login' && req.method === 'POST') {
        const body = await parseBody(req);
        const username = typeof body.username === 'string' ? body.username.trim().toLowerCase() : '';
        const password = typeof body.password === 'string' ? body.password : '';
        if (!username || !password) {
          return sendJSON(res, 400, { error: 'Username and password required.' });
        }
        const user = await dbService.findUser(username);
        if (!user || !dbService.verifyPassword(password, user.salt, user.hash)) {
          return sendJSON(res, 401, { error: 'Invalid username or password.' });
        }
        const token = 'tok_' + crypto.randomBytes(24).toString('hex');
        await dbService.saveToken(token, username);
        return sendJSON(res, 200, {
          success: true,
          token,
          user: { id: user.id, username: user.username, displayName: user.displayName || user.username }
        });
      }

      // 7. Auth: Get Current Session Profile
      if (pathname === '/api/auth/me' && req.method === 'GET') {
        const auth = await dbService.getAuthUser(req);
        if (!auth) return sendJSON(res, 401, { error: 'Unauthorized.' });
        return sendJSON(res, 200, {
          user: { id: auth.user.id, username: auth.username, displayName: auth.user.displayName || auth.username }
        });
      }

      // 8. Auth: Logout
      if (pathname === '/api/auth/logout' && req.method === 'POST') {
        const header = req.headers['authorization'] || '';
        const token = header.startsWith('Bearer ') ? header.slice(7).trim() : null;
        if (token) {
          await dbService.deleteToken(token);
        }
        return sendJSON(res, 200, { success: true });
      }

      // 9. Cross-Device Sync: Fetch User Data (Calendar, Chats, Notes)
      if (pathname === '/api/user/data' && req.method === 'GET') {
        const auth = await dbService.getAuthUser(req);
        if (!auth) return sendJSON(res, 401, { error: 'Unauthorized. Log in to sync.' });
        if (!auth.user.data) auth.user.data = { calendar: [], chats: [], notes: [] };
        if (!Array.isArray(auth.user.data.notes) || auth.user.data.notes.length === 0) {
          auth.user.data.notes = getDefaultStarterNotes(auth.username);
          await dbService.saveUser(auth.user);
        }
        return sendJSON(res, 200, {
          calendar: auth.user.data?.calendar || [],
          chats: auth.user.data?.chats || [],
          notes: auth.user.data?.notes || [],
          updatedAt: auth.user.updatedAt || auth.user.createdAt
        });
      }

      // 10. Cross-Device Sync: Save / Update User Data
      if (pathname === '/api/user/data' && req.method === 'POST') {
        const auth = await dbService.getAuthUser(req);
        if (!auth) return sendJSON(res, 401, { error: 'Unauthorized. Log in to sync.' });
        const body = await parseBody(req);
        if (!auth.user.data) auth.user.data = { calendar: [], chats: [], notes: [] };
        if (Array.isArray(body.calendar)) auth.user.data.calendar = body.calendar;
        if (Array.isArray(body.chats)) auth.user.data.chats = body.chats;
        if (Array.isArray(body.notes)) auth.user.data.notes = body.notes;
        auth.user.updatedAt = new Date().toISOString();
        await dbService.saveUser(auth.user);
        return sendJSON(res, 200, { success: true, updatedAt: auth.user.updatedAt });
      }

      // 10b. Notes Specific Endpoints (Fast single-item or batch CRUD)
      if (pathname === '/api/notes' && req.method === 'GET') {
        const auth = await dbService.getAuthUser(req);
        if (!auth) return sendJSON(res, 401, { error: 'Unauthorized.' });
        if (!auth.user.data) auth.user.data = { calendar: [], chats: [], notes: [] };
        if (!Array.isArray(auth.user.data.notes) || auth.user.data.notes.length === 0) {
          auth.user.data.notes = getDefaultStarterNotes(auth.username);
          await dbService.saveUser(auth.user);
        }
        return sendJSON(res, 200, { notes: auth.user.data.notes });
      }

      if (pathname === '/api/notes' && req.method === 'POST') {
        const auth = await dbService.getAuthUser(req);
        if (!auth) return sendJSON(res, 401, { error: 'Unauthorized.' });
        const body = await parseBody(req);
        if (!auth.user.data) auth.user.data = { calendar: [], chats: [], notes: [] };
        const targetNote = (body.note && typeof body.note === 'object' && body.note.id)
          ? body.note
          : (body && typeof body === 'object' && body.id ? body : null);

        if (targetNote) {
          const idx = auth.user.data.notes.findIndex(n => n.id === targetNote.id);
          targetNote.updatedAt = new Date().toISOString();
          if (idx >= 0) {
            auth.user.data.notes[idx] = { ...auth.user.data.notes[idx], ...targetNote };
          } else {
            auth.user.data.notes.unshift(targetNote);
          }
        } else if (Array.isArray(body.notes)) {
          auth.user.data.notes = body.notes;
        }

        auth.user.updatedAt = new Date().toISOString();
        await dbService.saveUser(auth.user);
        return sendJSON(res, 200, { success: true, notes: auth.user.data.notes });
      }

      if (pathname.startsWith('/api/notes/') && req.method === 'DELETE') {
        const auth = await dbService.getAuthUser(req);
        if (!auth) return sendJSON(res, 401, { error: 'Unauthorized.' });
        const noteId = pathname.slice('/api/notes/'.length).trim();
        if (auth.user.data && Array.isArray(auth.user.data.notes)) {
          auth.user.data.notes = auth.user.data.notes.filter(n => n.id !== noteId);
          auth.user.updatedAt = new Date().toISOString();
          await dbService.saveUser(auth.user);
        }
        return sendJSON(res, 200, { success: true });
      }

      // 10c. Calendar Specific Endpoints (Fast single-item, batch CRUD & device sync)
      if (pathname === '/api/calendar' && req.method === 'GET') {
        const auth = await dbService.getAuthUser(req);
        if (!auth) return sendJSON(res, 401, { error: 'Unauthorized.' });
        if (!auth.user.data) auth.user.data = { calendar: [], chats: [], notes: [] };
        if (!Array.isArray(auth.user.data.calendar)) auth.user.data.calendar = [];
        return sendJSON(res, 200, {
          calendar: auth.user.data.calendar,
          updatedAt: auth.user.updatedAt || auth.user.createdAt
        });
      }

      if (pathname === '/api/calendar' && req.method === 'POST') {
        const auth = await dbService.getAuthUser(req);
        if (!auth) return sendJSON(res, 401, { error: 'Unauthorized.' });
        const body = await parseBody(req);
        if (!auth.user.data) auth.user.data = { calendar: [], chats: [], notes: [] };
        if (!Array.isArray(auth.user.data.calendar)) auth.user.data.calendar = [];

        const targetEvent = (body.event && typeof body.event === 'object' && body.event.id)
          ? body.event
          : (body && typeof body === 'object' && body.id ? body : null);

        if (targetEvent) {
          const idx = auth.user.data.calendar.findIndex(e => e.id === targetEvent.id);
          targetEvent.updatedAt = new Date().toISOString();
          if (idx >= 0) {
            auth.user.data.calendar[idx] = { ...auth.user.data.calendar[idx], ...targetEvent };
          } else {
            auth.user.data.calendar.push(targetEvent);
          }
        } else if (Array.isArray(body.calendar)) {
          auth.user.data.calendar = body.calendar;
        } else if (Array.isArray(body.batch)) {
          for (const item of body.batch) {
            if (item && item.id) {
              const idx = auth.user.data.calendar.findIndex(e => e.id === item.id);
              item.updatedAt = new Date().toISOString();
              if (idx >= 0) {
                auth.user.data.calendar[idx] = { ...auth.user.data.calendar[idx], ...item };
              } else {
                auth.user.data.calendar.push(item);
              }
            }
          }
        }

        auth.user.updatedAt = new Date().toISOString();
        await dbService.saveUser(auth.user);
        return sendJSON(res, 200, { success: true, calendar: auth.user.data.calendar, updatedAt: auth.user.updatedAt });
      }

      if (pathname.startsWith('/api/calendar/') && req.method === 'DELETE') {
        const auth = await dbService.getAuthUser(req);
        if (!auth) return sendJSON(res, 401, { error: 'Unauthorized.' });
        const eventId = pathname.slice('/api/calendar/'.length).trim();
        if (auth.user.data && Array.isArray(auth.user.data.calendar)) {
          auth.user.data.calendar = auth.user.data.calendar.filter(e => e.id !== eventId);
          auth.user.updatedAt = new Date().toISOString();
          await dbService.saveUser(auth.user);
        }
        return sendJSON(res, 200, { success: true });
      }

      // 11. Live Tech & Tech Business News Feed (Aggregated & Auto-Updating)
      if (pathname === '/api/news' && req.method === 'GET') {
        const forceRefresh = parsedUrl.query && (parsedUrl.query.refresh === 'true' || parsedUrl.query.refresh === '1');
        const category = (parsedUrl.query && parsedUrl.query.category) || 'all';
        const search = (parsedUrl.query && parsedUrl.query.search) || '';
        const limit = parseInt((parsedUrl.query && parsedUrl.query.limit) || '60', 10);

        const result = await getAggregatedTechNews(forceRefresh);
        let items = result.items || [];

        // Category filter
        if (category && category.toLowerCase() !== 'all') {
          const catLower = category.toLowerCase().trim();
          items = items.filter(item => {
            const itemCat = (item.category || '').toLowerCase();
            if (catLower === 'business' || catLower.includes('business') || catLower.includes('vc')) {
              return itemCat.includes('business') || itemCat.includes('vc') || itemCat.includes('startup');
            }
            if (catLower === 'ai' || catLower.includes('ai') || catLower.includes('machine learning')) {
              return itemCat.includes('ai') || itemCat.includes('machine');
            }
            if (catLower === 'silicon' || catLower.includes('silicon') || catLower.includes('deep tech') || catLower.includes('hardware')) {
              return itemCat.includes('silicon') || itemCat.includes('deep tech') || itemCat.includes('hardware');
            }
            if (catLower === 'security' || catLower.includes('cybersecurity') || catLower.includes('policy')) {
              return itemCat.includes('security') || itemCat.includes('policy');
            }
            if (catLower === 'innovation' || catLower.includes('dev')) {
              return itemCat.includes('innovation') || itemCat.includes('dev');
            }
            return itemCat.includes(catLower);
          });
        }

        // Search filter
        if (search.trim()) {
          const q = search.trim().toLowerCase();
          items = items.filter(item =>
            (item.title || '').toLowerCase().includes(q) ||
            (item.summary || '').toLowerCase().includes(q) ||
            (item.source || '').toLowerCase().includes(q) ||
            (item.category || '').toLowerCase().includes(q)
          );
        }

        const sliced = items.slice(0, Math.min(limit, 100));

        return sendJSON(res, 200, {
          success: true,
          total: items.length,
          count: sliced.length,
          lastUpdated: result.lastUpdated,
          cached: result.cached,
          categories: [
            'All Stories',
            'Tech Business & VC',
            'AI & Machine Learning',
            'Deep Tech & Silicon',
            'Cybersecurity & Policy',
            'Tech Innovation'
          ],
          news: sliced
        });
      }

      // Route Not Found
      return sendJSON(res, 404, { error: `Endpoint ${req.method} ${pathname} not found.` });
    } catch (apiErr) {
      console.error('[API Error]', apiErr);
      return sendJSON(res, 500, { error: apiErr.message || 'Internal Server Error' });
    }
  }

  /* --- STATIC FILE SERVER --- */
  let relativePath = pathname === '/' ? '/index.html' : pathname;
  const safePath = path.normalize(relativePath).replace(/^(\.\.[\/\\])+/, '');
  const normalizedLower = safePath.toLowerCase().replace(/\\/g, '/');
  let cleanPath = normalizedLower.replace(/^[\/\\]+/, '');

  // Block sensitive files and server directories
  const isBlocked =
    cleanPath.startsWith('.') ||
    cleanPath.includes('/.') ||
    cleanPath === '.env' ||
    cleanPath.endsWith('.env') ||
    cleanPath.endsWith('db.json') ||
    cleanPath.startsWith('backend/') ||
    cleanPath.startsWith('server/') ||
    cleanPath.startsWith('scratch/');

  if (isBlocked) {
    res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: '403 Forbidden: Access to protected file is restricted.' }));
    return;
  }

  // Strip leading 'frontend/' if present in request URL for clean mapping
  let clientSubPath = cleanPath;
  if (clientSubPath.startsWith('frontend/')) {
    clientSubPath = clientSubPath.substring('frontend/'.length);
  }
  if (!clientSubPath) clientSubPath = 'index.html';

  let filePath = path.join(FRONTEND_DIR, clientSubPath);

  // Clean extensionless URLs (e.g. /ai -> /ai.html, /calendar -> /calendar.html)
  let targetFile = filePath;
  try {
    if (!fs.existsSync(targetFile) || fs.statSync(targetFile).isDirectory()) {
      if (fs.existsSync(filePath + '.html')) {
        targetFile = filePath + '.html';
      } else if (fs.existsSync(path.join(filePath, 'index.html'))) {
        targetFile = path.join(filePath, 'index.html');
      }
    }
  } catch (e) {
    targetFile = filePath;
  }

  fs.stat(targetFile, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(`404 Not Found: ${pathname}`);
      return;
    }

    const ext = path.extname(targetFile).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const isHtml = ext === '.html';

    // HTTP Caching & Conditional GET (ETag + 304 Not Modified)
    const etag = `W/"${stats.size.toString(16)}-${Math.floor(stats.mtimeMs).toString(16)}"`;
    const lastModified = stats.mtime.toUTCString();
    const ifNoneMatch = req.headers['if-none-match'];
    const ifModifiedSince = req.headers['if-modified-since'];

    const cacheControl = isHtml
      ? 'public, max-age=0, must-revalidate'
      : 'public, max-age=86400, stale-while-revalidate=604800';

    if (ifNoneMatch === etag || (ifModifiedSince && new Date(ifModifiedSince) >= stats.mtime)) {
      res.writeHead(304, {
        'ETag': etag,
        'Last-Modified': lastModified,
        'Cache-Control': cacheControl,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Private-Network': 'true',
        'Vary': 'Accept-Encoding'
      });
      return res.end();
    }

    const headers = {
      'Content-Type': contentType,
      'ETag': etag,
      'Last-Modified': lastModified,
      'Cache-Control': cacheControl,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Private-Network': 'true',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'Vary': 'Accept-Encoding'
    };

    const isCompressible = ['.html', '.css', '.js', '.json', '.svg', '.txt'].includes(ext) && stats.size > 512;
    const acceptEncoding = req.headers['accept-encoding'] || '';

    if (isCompressible && acceptEncoding.includes('gzip')) {
      headers['Content-Encoding'] = 'gzip';
      res.writeHead(200, headers);
      fs.createReadStream(targetFile).pipe(zlib.createGzip({ level: 6 })).pipe(res);
    } else if (isCompressible && acceptEncoding.includes('deflate')) {
      headers['Content-Encoding'] = 'deflate';
      res.writeHead(200, headers);
      fs.createReadStream(targetFile).pipe(zlib.createDeflate()).pipe(res);
    } else {
      res.writeHead(200, headers);
      fs.createReadStream(targetFile).pipe(res);
    }
  });
}

const server = http.createServer(handleRequest);

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.warn(`[Aethera Server] Port ${PORT} is already in use.`);
    process.exit(0);
  } else {
    console.error('[Aethera Server Error]', err);
    process.exit(1);
  }
});

// Start listening if running as primary Node process (not serverless import)
if (require.main === module) {
  server.listen(PORT, '0.0.0.0', () => {
    const lanIp = getLocalNetworkIp();
    const hasKey = !!(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);
    const dbMode = dbService.isSupabaseEnabled() ? 'Supabase Cloud PostgreSQL' : 'Local JSON (db.json)';
    console.log('====================================================');
    console.log(`⚡ Aethera AI Server is RUNNING`);
    console.log(`🌐 Local Web:         http://localhost:${PORT}`);
    console.log(`🌐 LAN Multi-Device:  http://${lanIp}:${PORT}`);
    console.log(`📦 Database Engine:   ${dbMode}`);
    console.log(`🔑 AI Key Configured: ${hasKey ? 'YES (Loaded from .env securely)' : 'NO'}`);
    console.log('====================================================');
  });
}

// Export for Vercel Serverless Function & testing
handleRequest.server = server;
handleRequest.emit = (event, ...args) => server.emit(event, ...args);
module.exports = handleRequest;

