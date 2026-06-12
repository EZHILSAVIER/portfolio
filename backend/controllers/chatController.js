/**
 * Chat Controller
 * Orchestrates the full AI chat pipeline:
 *   Input → Memory → Intent → RAG → Tools → Gemini → Stream → Save
 */

const { v4: uuidv4 } = require('uuid');
const { detectIntent } = require('../services/intentService');
const { retrieveContext } = require('../services/ragService');
const { generateStreamingResponse } = require('../services/geminiService');
const memoryService = require('../services/memoryService');
const { executeTools } = require('../tools');

/**
 * Main chat endpoint handler.
 * Accepts a user message and sessionId, streams the AI response via SSE.
 */
async function handleChat(req, res) {
  const { message, sessionId: clientSessionId } = req.body;

  // Validate input
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (message.length > 2000) {
    return res.status(400).json({ error: 'Message too long (max 2000 characters)' });
  }

  // Use client's sessionId or generate a new one
  const sessionId = clientSessionId || uuidv4();

  // Set up SSE headers for streaming
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'X-Session-Id': sessionId,
    'Access-Control-Expose-Headers': 'X-Session-Id',
  });

  try {
    // 1. Save user message to memory
    await memoryService.saveMessage(sessionId, 'user', message.trim());

    // 2. Load conversation history
    const history = await memoryService.getHistory(sessionId, 20);

    // 3. Detect intent
    const { intent, confidence } = detectIntent(message);
    console.log(`[Chat] Intent: ${intent} (confidence: ${confidence})`);

    // 4. Retrieve relevant context via RAG
    const ragContext = await retrieveContext(message, 5);

    // 5. Execute matching tools
    const toolResults = executeTools(intent);

    // 6. Send session metadata event
    res.write(`data: ${JSON.stringify({
      type: 'meta',
      sessionId,
      intent,
    })}\n\n`);

    // 7. Stream Gemini response
    let fullResponse = '';
    const stream = generateStreamingResponse(
      message.trim(),
      ragContext,
      history.slice(0, -1), // Exclude the current user message (already in prompt)
      toolResults,
    );

    for await (const chunk of stream) {
      fullResponse += chunk;

      // Send each text chunk as an SSE event
      res.write(`data: ${JSON.stringify({
        type: 'chunk',
        content: chunk,
      })}\n\n`);
    }

    // 8. Save AI response to memory
    await memoryService.saveMessage(sessionId, 'assistant', fullResponse);

    // 9. Send completion event
    res.write(`data: ${JSON.stringify({
      type: 'done',
      sessionId,
    })}\n\n`);

  } catch (error) {
    console.error('[Chat] Pipeline error:', error);

    // Send error event via SSE
    res.write(`data: ${JSON.stringify({
      type: 'error',
      message: 'I encountered an issue. Please try again.',
    })}\n\n`);
  } finally {
    res.end();
  }
}

/**
 * Health check endpoint.
 */
function healthCheck(req, res) {
  const ragService = require('../services/ragService');

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    rag: ragService.getStatus(),
    activeSessions: memoryService.getActiveSessionCount(),
  });
}

/**
 * Returns suggested prompts for the chat UI.
 */
function getSuggestions(req, res) {
  res.json({
    suggestions: [
      { text: 'Who is Ezhil Savier?', icon: '👤' },
      { text: 'What projects has he built?', icon: '💻' },
      { text: 'What are his technical skills?', icon: '🛠️' },
      { text: 'Is he available to hire?', icon: '💼' },
      { text: 'Tell me about PhishGuard', icon: '🛡️' },
      { text: 'Tell me about TrustCart', icon: '🛒' },
      { text: 'What experience does he have?', icon: '📋' },
      { text: 'How can I contact him?', icon: '📧' },
    ],
  });
}

/**
 * Clear a chat session.
 */
async function clearChat(req, res) {
  const { sessionId } = req.params;

  if (!sessionId) {
    return res.status(400).json({ error: 'Session ID is required' });
  }

  await memoryService.clearSession(sessionId);
  res.json({ success: true, message: 'Session cleared' });
}

module.exports = { handleChat, healthCheck, getSuggestions, clearChat };
