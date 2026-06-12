/**
 * Express Server — AI Portfolio Agent Backend
 * Entry point for the API server.
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');

const chatRoutes = require('./routes/chatRoutes');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const memoryService = require('./services/memoryService');

const app = express();
const PORT = process.env.PORT || 5000;

// ======================== MIDDLEWARE ========================

// Security headers
app.use(helmet());

// CORS — allow frontend origin
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['X-Session-Id'],
  credentials: true,
}));

// Request logging
app.use(morgan('dev'));

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false }));

// ======================== ROUTES ========================

// API routes
app.use('/api/chat', chatRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'AI Portfolio Agent API',
    version: '1.0.0',
    author: 'Ezhil Savier S',
    endpoints: {
      chat: 'POST /api/chat',
      health: 'GET /api/chat/health',
      suggestions: 'GET /api/chat/suggestions',
    },
  });
});

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

// ======================== DATABASE ========================

async function connectDB() {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    console.log('[Server] No MONGODB_URI — running without database (in-memory mode)');
    return;
  }

  try {
    await mongoose.connect(mongoURI, {
      // Modern Mongoose defaults handle most options automatically
    });
    console.log('[Server] Connected to MongoDB Atlas');
  } catch (error) {
    console.error('[Server] MongoDB connection failed:', error.message);
    console.log('[Server] Continuing without database (in-memory mode)');
  }
}

// ======================== START ========================

async function start() {
  // Connect to database (optional)
  await connectDB();

  // Initialize memory service (detects MongoDB availability)
  memoryService.initialize();

  // Validate Gemini API key
  if (!process.env.GEMINI_API_KEY) {
    console.warn('[Server] ⚠️  GEMINI_API_KEY not set — AI responses will fail');
  }

  // Start server
  app.listen(PORT, () => {
    console.log(`\n🚀 AI Portfolio Agent API running on http://localhost:${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/api/chat/health`);
    console.log(`💬 Chat endpoint: POST http://localhost:${PORT}/api/chat\n`);
  });
}

start();

module.exports = app;
