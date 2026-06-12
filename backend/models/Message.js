/**
 * Message Model (Mongoose)
 * Schema for persisting chat messages in MongoDB.
 */

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    index: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['user', 'assistant'],
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
  metadata: {
    intent: String,
    toolsUsed: [String],
    ragChunksUsed: Number,
  },
});

// TTL index: auto-delete messages older than 7 days to keep the DB clean
messageSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7 * 24 * 60 * 60 });

// Compound index for efficient session queries
messageSchema.index({ sessionId: 1, timestamp: 1 });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
