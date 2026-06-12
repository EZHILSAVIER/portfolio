/**
 * Vector Store Service
 * Local flat-file vector store with cosine similarity search.
 * Stores embeddings as JSON for portability — no external vector DB needed.
 * Sufficient for ~100 chunks of portfolio data.
 */

const fs = require('fs');
const path = require('path');

const VECTORS_PATH = path.join(__dirname, '..', 'data', 'vectors.json');

// In-memory store (loaded from disk on startup)
let vectorStore = {
  chunks: [],     // [{text, source, chunkIndex}]
  embeddings: [], // [number[]] — parallel to chunks
};

/**
 * Compute cosine similarity between two vectors.
 * @param {number[]} a
 * @param {number[]} b
 * @returns {number} similarity score between -1 and 1
 */
function cosineSimilarity(a, b) {
  if (a.length !== b.length) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  return denominator === 0 ? 0 : dotProduct / denominator;
}

/**
 * Load the vector store from disk.
 * Called once on server startup.
 */
function loadStore() {
  try {
    if (fs.existsSync(VECTORS_PATH)) {
      const data = JSON.parse(fs.readFileSync(VECTORS_PATH, 'utf-8'));
      vectorStore = data;
      console.log(`[VectorStore] Loaded ${vectorStore.chunks.length} chunks from disk`);
    } else {
      console.log('[VectorStore] No vectors.json found — run ingest script first');
    }
  } catch (error) {
    console.error('[VectorStore] Failed to load store:', error.message);
  }
}

/**
 * Save the vector store to disk.
 */
function saveStore() {
  try {
    const dir = path.dirname(VECTORS_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(VECTORS_PATH, JSON.stringify(vectorStore, null, 2));
    console.log(`[VectorStore] Saved ${vectorStore.chunks.length} chunks to disk`);
  } catch (error) {
    console.error('[VectorStore] Failed to save store:', error.message);
  }
}

/**
 * Add documents with their embeddings to the store.
 * @param {Array<{text: string, source: string, chunkIndex: number}>} chunks
 * @param {number[][]} embeddings — parallel array of embedding vectors
 */
function addDocuments(chunks, embeddings) {
  if (chunks.length !== embeddings.length) {
    throw new Error('Chunks and embeddings arrays must have equal length');
  }

  vectorStore.chunks = chunks;
  vectorStore.embeddings = embeddings;
  saveStore();
}

/**
 * Search for the most relevant chunks given a query embedding.
 * @param {number[]} queryEmbedding - The query's embedding vector
 * @param {number} topK - Number of results to return
 * @returns {Array<{text: string, source: string, score: number}>}
 */
function search(queryEmbedding, topK = 5) {
  if (vectorStore.chunks.length === 0) {
    console.warn('[VectorStore] Store is empty — no results');
    return [];
  }

  // Compute similarity for every stored chunk
  const scored = vectorStore.chunks.map((chunk, i) => ({
    text: chunk.text,
    source: chunk.source,
    chunkIndex: chunk.chunkIndex,
    score: cosineSimilarity(queryEmbedding, vectorStore.embeddings[i]),
  }));

  // Sort by similarity (descending) and return top-K
  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, topK);
}

/**
 * Get the number of stored chunks.
 */
function getStoreSize() {
  return vectorStore.chunks.length;
}

/**
 * Check if the store has been populated.
 */
function isReady() {
  return vectorStore.chunks.length > 0;
}

// Load store on module import
loadStore();

module.exports = {
  addDocuments,
  search,
  loadStore,
  saveStore,
  getStoreSize,
  isReady,
  cosineSimilarity,
};
