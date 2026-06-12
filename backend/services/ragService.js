/**
 * RAG Service
 * Retrieval-Augmented Generation pipeline.
 * Embeds user queries and retrieves the most relevant portfolio data chunks.
 */

const { generateEmbedding } = require('./geminiService');
const vectorStore = require('./vectorStore');

/**
 * Retrieve relevant context for a user query.
 * Embeds the query, searches the vector store, and formats results.
 * @param {string} query - The user's question
 * @param {number} topK - Number of chunks to retrieve
 * @returns {Promise<string>} - Formatted context string for prompt injection
 */
async function retrieveContext(query, topK = 5) {
  // Check if vector store is populated
  if (!vectorStore.isReady()) {
    console.warn('[RAGService] Vector store not ready — returning empty context');
    return '';
  }

  try {
    // Generate embedding for the user's query
    const queryEmbedding = await generateEmbedding(query);

    // Search for relevant chunks
    const results = vectorStore.search(queryEmbedding, topK);

    if (results.length === 0) {
      return '';
    }

    // Filter out low-relevance results (below threshold)
    const RELEVANCE_THRESHOLD = 0.3;
    const relevant = results.filter(r => r.score >= RELEVANCE_THRESHOLD);

    if (relevant.length === 0) {
      console.log('[RAGService] No chunks above relevance threshold');
      return '';
    }

    // Format the retrieved chunks into a context block
    const contextParts = relevant.map((result, i) => {
      return `[Source: ${result.source} | Relevance: ${(result.score * 100).toFixed(1)}%]\n${result.text}`;
    });

    const context = contextParts.join('\n\n---\n\n');

    console.log(`[RAGService] Retrieved ${relevant.length} chunks (top score: ${(relevant[0].score * 100).toFixed(1)}%)`);

    return context;
  } catch (error) {
    console.error('[RAGService] Retrieval error:', error.message);
    return '';
  }
}

/**
 * Get RAG pipeline status information.
 */
function getStatus() {
  return {
    ready: vectorStore.isReady(),
    totalChunks: vectorStore.getStoreSize(),
  };
}

module.exports = { retrieveContext, getStatus };
