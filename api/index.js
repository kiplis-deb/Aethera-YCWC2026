/**
 * VERCEL SERVERLESS API ENTRYPOINT
 * Bridges Vercel serverless function invocations to Aethera's Backend HTTP router.
 */

const server = require('../Backend/server.js');

module.exports = async (req, res) => {
  // Set CORS headers early
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  // Restore original request URL if rewritten by Vercel
  const matchedPath = req.headers && (
    req.headers['x-matched-path'] ||
    req.headers['x-invoke-path'] ||
    req.headers['x-original-url'] ||
    req.headers['x-rewrite-url'] ||
    req.headers['x-now-route-matches']
  );

  if (matchedPath && (req.url === '/api/index.js' || req.url === '/api' || req.url.startsWith('/api?'))) {
    const query = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
    req.url = matchedPath.includes('?') ? matchedPath : (matchedPath + query);
  }

  if (typeof server === 'function') {
    return server(req, res);
  }
  return server.emit('request', req, res);
};
