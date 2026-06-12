/**
 * Data Ingestion Script
 * Reads portfolio data files, chunks them, generates embeddings via Gemini,
 * and stores them in the local vector store.
 *
 * Run once: npm run ingest
 */

require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { chunkDocuments } = require('../utils/chunker');
const { generateBatchEmbeddings } = require('../services/geminiService');
const vectorStore = require('../services/vectorStore');

const DATA_DIR = path.join(__dirname, '..', 'data');

async function ingest() {
  console.log('🔄 Starting data ingestion pipeline...\n');

  // 1. Read data files
  const dataFiles = ['projects.txt', 'resume.txt', 'skills.txt', 'experience.txt', 'training_data.txt'];
  const documents = [];

  for (const file of dataFiles) {
    const filePath = path.join(DATA_DIR, file);

    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  File not found: ${file} — skipping`);
      continue;
    }

    const text = fs.readFileSync(filePath, 'utf-8');
    documents.push({ text, source: file });
    console.log(`📄 Loaded: ${file} (${text.length} chars)`);
  }

  if (documents.length === 0) {
    console.error('❌ No data files found. Make sure data files exist in backend/data/');
    process.exit(1);
  }

  // 2. Chunk documents
  console.log('\n✂️  Chunking documents...');
  const chunks = chunkDocuments(documents);
  console.log(`   Created ${chunks.length} chunks\n`);

  // Preview first few chunks
  chunks.slice(0, 3).forEach((chunk, i) => {
    console.log(`   Chunk ${i}: [${chunk.source}] "${chunk.text.substring(0, 80)}..."`);
  });

  // 3. Generate embeddings via Gemini
  console.log('\n🧠 Generating embeddings via Gemini...');

  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY not set. Add it to backend/.env');
    process.exit(1);
  }

  const texts = chunks.map(c => c.text);
  const embeddings = await generateBatchEmbeddings(texts);

  console.log(`   Generated ${embeddings.length} embeddings (dimension: ${embeddings[0]?.length || 0})\n`);

  // 4. Store in vector store
  console.log('💾 Saving to vector store...');
  vectorStore.addDocuments(chunks, embeddings);

  console.log('\n✅ Ingestion complete!');
  console.log(`   Total chunks: ${chunks.length}`);
  console.log(`   Vector dimension: ${embeddings[0]?.length || 0}`);
  console.log(`   Store location: backend/data/vectors.json`);
}

ingest().catch(error => {
  console.error('❌ Ingestion failed:', error);
  process.exit(1);
});
