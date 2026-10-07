/**
 * VERCEL CATCH-ALL SERVERLESS ROUTE
 * Captures all sub-routes under /api/* (e.g. /api/auth/register, /api/user/data, etc.)
 */
const handler = require('./index.js');
module.exports = handler;
