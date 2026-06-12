/**
 * Text Chunker Utility
 * Splits documents into overlapping chunks for RAG embedding.
 * Uses section-aware splitting: respects markdown headers as boundaries.
 */

const CHUNK_SIZE = 500;      // target characters per chunk
const CHUNK_OVERLAP = 100;   // overlap between consecutive chunks

/**
 * Split a document into chunks with metadata.
 * @param {string} text - The full document text
 * @param {string} source - Source file identifier (e.g., "projects.txt")
 * @returns {Array<{text: string, source: string, chunkIndex: number}>}
 */
function chunkDocument(text, source) {
  const chunks = [];

  // First, split by markdown headers (##) to respect section boundaries
  const sections = text.split(/(?=^## )/gm).filter(s => s.trim().length > 0);

  for (const section of sections) {
    // If a section is small enough, keep it as a single chunk
    if (section.length <= CHUNK_SIZE) {
      chunks.push({
        text: section.trim(),
        source,
        chunkIndex: chunks.length,
      });
      continue;
    }

    // Otherwise, split into overlapping windows by sentences
    const sentences = section.match(/[^.!?\n]+[.!?\n]+|[^.!?\n]+$/g) || [section];
    let currentChunk = '';

    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i].trim();
      if (!sentence) continue;

      if ((currentChunk + ' ' + sentence).length > CHUNK_SIZE && currentChunk.length > 0) {
        // Save current chunk
        chunks.push({
          text: currentChunk.trim(),
          source,
          chunkIndex: chunks.length,
        });

        // Start new chunk with overlap: take last portion of previous chunk
        const overlapText = currentChunk.slice(-CHUNK_OVERLAP);
        currentChunk = overlapText + ' ' + sentence;
      } else {
        currentChunk = currentChunk ? currentChunk + ' ' + sentence : sentence;
      }
    }

    // Don't forget the last chunk
    if (currentChunk.trim().length > 0) {
      chunks.push({
        text: currentChunk.trim(),
        source,
        chunkIndex: chunks.length,
      });
    }
  }

  return chunks;
}

/**
 * Process multiple documents into a flat list of chunks.
 * @param {Array<{text: string, source: string}>} documents
 * @returns {Array<{text: string, source: string, chunkIndex: number}>}
 */
function chunkDocuments(documents) {
  const allChunks = [];

  for (const doc of documents) {
    const docChunks = chunkDocument(doc.text, doc.source);
    allChunks.push(...docChunks);
  }

  // Re-index globally
  allChunks.forEach((chunk, i) => {
    chunk.chunkIndex = i;
  });

  return allChunks;
}

module.exports = { chunkDocument, chunkDocuments, CHUNK_SIZE, CHUNK_OVERLAP };
