/**
 * Memory Service
 * Manages conversation history for session-based chat memory.
 * Uses MongoDB when available, falls back to in-memory store.
 */

let Message; // Mongoose model — loaded lazily to handle missing MongoDB

// In-memory fallback store
const memoryStore = new Map();

// Max messages to keep per session (prevents unbounded growth)
const MAX_HISTORY = 30;

/**
 * Initialize the memory service.
 * Tries to load the Mongoose model; falls back to in-memory if unavailable.
 */
function initialize() {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState === 1) {
      Message = require('../models/Message');
      console.log('[MemoryService] Using MongoDB for chat memory');
    } else {
      console.log('[MemoryService] MongoDB not connected — using in-memory store');
    }
  } catch {
    console.log('[MemoryService] MongoDB not available — using in-memory store');
  }
}

/**
 * Get conversation history for a session.
 * @param {string} sessionId
 * @param {number} limit - Max messages to return
 * @returns {Promise<Array<{role: string, content: string, timestamp: Date}>>}
 */
async function getHistory(sessionId, limit = 20) {
  if (Message) {
    try {
      const messages = await Message
        .find({ sessionId })
        .sort({ timestamp: 1 })
        .limit(limit)
        .lean();

      return messages.map(m => ({
        role: m.role,
        content: m.content,
        timestamp: m.timestamp,
      }));
    } catch (error) {
      console.error('[MemoryService] MongoDB read error:', error.message);
      // Fall through to in-memory
    }
  }

  // In-memory fallback
  const history = memoryStore.get(sessionId) || [];
  return history.slice(-limit);
}

/**
 * Save a message to conversation history.
 * @param {string} sessionId
 * @param {string} role - 'user' or 'assistant'
 * @param {string} content - Message content
 */
async function saveMessage(sessionId, role, content) {
  const message = {
    sessionId,
    role,
    content,
    timestamp: new Date(),
  };

  if (Message) {
    try {
      await Message.create(message);
      return;
    } catch (error) {
      console.error('[MemoryService] MongoDB write error:', error.message);
      // Fall through to in-memory
    }
  }

  // In-memory fallback
  if (!memoryStore.has(sessionId)) {
    memoryStore.set(sessionId, []);
  }

  const history = memoryStore.get(sessionId);
  history.push({ role, content, timestamp: message.timestamp });

  // Trim to max history
  if (history.length > MAX_HISTORY) {
    history.splice(0, history.length - MAX_HISTORY);
  }
}

/**
 * Clear all messages for a session.
 * @param {string} sessionId
 */
async function clearSession(sessionId) {
  if (Message) {
    try {
      await Message.deleteMany({ sessionId });
    } catch (error) {
      console.error('[MemoryService] MongoDB delete error:', error.message);
    }
  }

  memoryStore.delete(sessionId);
}

/**
 * Get the count of active sessions (in-memory only).
 */
function getActiveSessionCount() {
  return memoryStore.size;
}

module.exports = {
  initialize,
  getHistory,
  saveMessage,
  clearSession,
  getActiveSessionCount,
};
