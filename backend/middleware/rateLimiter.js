/**
 * Rate Limiter Middleware
 * Limits API requests to prevent abuse.
 */

const rateLimit = require('express-rate-limit');

// Chat endpoint rate limiter: 30 requests per minute per IP
const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  message: {
    error: 'Too many requests. Please wait a moment before trying again.',
    retryAfter: 60,
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Use IP address for rate limiting
  keyGenerator: (req) => {
    return req.ip || req.headers['x-forwarded-for'] || 'unknown';
  },
});

// General API rate limiter: 100 requests per minute
const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: {
    error: 'Rate limit exceeded.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { chatLimiter, generalLimiter };
