/**
 * Chat Routes
 * API endpoints for the AI chat assistant.
 */

const express = require('express');
const router = express.Router();
const { chatLimiter } = require('../middleware/rateLimiter');
const {
  handleChat,
  healthCheck,
  getSuggestions,
  clearChat,
} = require('../controllers/chatController');

// POST /api/chat — Main chat endpoint (SSE streaming response)
router.post('/', chatLimiter, handleChat);

// GET /api/chat/health — Health check
router.get('/health', healthCheck);

// GET /api/chat/suggestions — Get suggested prompts
router.get('/suggestions', getSuggestions);

// DELETE /api/chat/:sessionId — Clear a chat session
router.delete('/:sessionId', clearChat);

module.exports = router;
