const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'your_gemini_api_key_here');

// Models
const CHAT_MODEL = 'gemini-2.0-flash';
const EMBEDDING_MODEL = 'text-embedding-004';

// Stop words to ignore during keyword matching to avoid noise in Jaccard calculations
const STOP_WORDS = new Set([
  'what', 'is', 'ezhil', 'ezhils', 'savier', 'does', 'did', 'how', 'can', 'who', 
  'where', 'are', 'you', 'the', 'and', 'for', 'about', 'him', 'his', 'her', 'them', 
  'their', 'tell', 'me', 'has', 'have', 'been', 'with', 'out', 'this', 'that', 'they',
  'a', 'an', 'to', 'in', 'of', 'on', 'at', 'about', 'by', 'do', 'any', 'some', 'he',
  'she', 'it', 'we', 'us', 'there', 'here', 'know', 'knows', 'knew', 'known', 'want', 
  'wants', 'go', 'goes', 'went', 'was', 'were', 'be', 'being', 'am'
]);

/**
 * Clean and stem a word token (lightweight suffix stemmer).
 * Reduces words to their base forms (e.g. mapping "building", "built", "builds" -> "build").
 */
function stem(word) {
  let w = word.trim().toLowerCase();
  if (w.length <= 2) return w;

  // Suffix matching & stripping
  if (w.endsWith('ing')) {
    w = w.slice(0, -3);
  } else if (w.endsWith('ed')) {
    w = w.slice(0, -2);
  } else if (w.endsWith('es')) {
    w = w.slice(0, -2);
  } else if (w.endsWith('s') && !w.endsWith('ss')) {
    w = w.slice(0, -1);
  }

  // Double consonant reduction (e.g. running -> runn -> run)
  if (w.length > 3 && w.slice(-1) === w.slice(-2, -1) && !['l', 's', 'z'].includes(w.slice(-1))) {
    w = w.slice(0, -1);
  }

  // Handle common irregular verbs in Ezhil's resume context
  if (w === 'built') return 'build';
  if (w === 'studied' || w === 'studies') return 'studi';
  if (w === 'graduated' || w === 'graduation' || w === 'graduates') return 'graduat';
  if (w === 'developed' || w === 'development') return 'develop';
  if (w === 'personalized' || w === 'personalize' || w === 'personalisation') return 'personal';
  if (w === 'recognized' || w === 'recognition' || w === 'recognizes') return 'recogn';
  if (w === 'learned' || w === 'learning') return 'learn';
  if (w === 'recommended' || w === 'recommendation' || w === 'recommendations') return 'recommend';
  if (w === 'managed' || w === 'management' || w === 'manager') return 'manag';
  if (w === 'coordinated' || w === 'coordination' || w === 'coordinator') return 'coordinat';

  return w;
}

/**
 * Tokenize, remove stop words, stem, and generate bigrams for a given text string.
 * Returns a Set of token strings.
 */
function tokenize(text) {
  if (!text) return new Set();

  // Clean punctuation and lowercase
  const clean = text.toLowerCase().replace(/[^\w\s-]/g, ' ');
  // Split by whitespace
  const rawTokens = clean.split(/\s+/).filter(t => t.length > 0);

  const unigrams = [];
  const tokenSet = new Set();

  for (const token of rawTokens) {
    if (!STOP_WORDS.has(token) && token.length > 1) {
      const stemmed = stem(token);
      if (stemmed.length > 1) {
        unigrams.push(stemmed);
        tokenSet.add(stemmed);
      }
    }
  }

  // Generate bigrams for phrases (e.g. "data science", "full stack", "remote work")
  for (let i = 0; i < unigrams.length - 1; i++) {
    tokenSet.add(`${unigrams[i]}_${unigrams[i+1]}`);
  }

  return tokenSet;
}

/**
 * Calculate Jaccard similarity score between two Sets of tokens.
 */
function jaccardSimilarity(setA, setB) {
  if (setA.size === 0 || setB.size === 0) return 0;

  let intersectionCount = 0;
  for (const item of setA) {
    if (setB.has(item)) {
      intersectionCount++;
    }
  }

  const unionSize = setA.size + setB.size - intersectionCount;
  return unionSize === 0 ? 0 : intersectionCount / unionSize;
}

/**
 * System prompt that defines the AI assistant's personality and behavior.
 * Acts as Ezhil Savier's professional representative.
 */
const SYSTEM_PROMPT = `You are the Portfolio AI Assistant for Ezhil Savier S — an AI & Data Science engineer.
Your job is to help portfolio visitors (recruiters, collaborators, developers, students) learn everything about Ezhil accurately and enthusiastically.

RULES:
- Always answer from the knowledge base below — never guess or hallucinate
- Be warm, confident, and professional
- Keep answers concise unless asked for detail
- For anything outside this knowledge base: say "I don't have that detail — reach out to Ezhil at sanjayraina023@gmail.com"
- NEVER say "I don't know" — always redirect to contact info
- Use first or third person for Ezhil ("He built..." or "Ezhil built...")
- Never make up projects, skills, or experience not listed here

PERSONALITY: Friendly · Precise · Enthusiastic about AI · Professional`;

/**
 * Generate a streaming response from Gemini.
 * @param {string} userMessage - The user's message
 * @param {string} context - Retrieved RAG context
 * @param {Array} history - Conversation history [{role, content}]
 * @param {string} toolResults - Formatted tool execution results
 * @returns {AsyncGenerator} - Stream of text chunks
 */
async function* generateStreamingResponse(userMessage, context, history = [], toolResults = '') {
  // If API key is not valid, placeholder, or not present, fallback to local mock streaming
  const isPlaceholderKey = !process.env.GEMINI_API_KEY || 
                           process.env.GEMINI_API_KEY === 'your_gemini_api_key_here' || 
                           process.env.GEMINI_API_KEY.trim().length === 0;
  
  if (isPlaceholderKey) {
    console.log('[GeminiService] Placeholder API key detected. Using local mock response.');
    const mockText = getMockResponse(userMessage);
    const chunkSize = 8;
    for (let i = 0; i < mockText.length; i += chunkSize) {
      yield mockText.substring(i, i + chunkSize);
      await new Promise(resolve => setTimeout(resolve, 20));
    }
    return;
  }

  const model = genAI.getGenerativeModel({
    model: CHAT_MODEL,
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      topK: 40,
      maxOutputTokens: 1024,
    },
  });

  // Build the conversation history for Gemini's chat format
  const chatHistory = history.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));

  // Construct the augmented prompt with context injection
  let augmentedPrompt = '';

  if (context) {
    augmentedPrompt += `\n## Relevant Context (from portfolio data):\n${context}\n\n`;
  }

  if (toolResults) {
    augmentedPrompt += `\n## Tool Results:\n${toolResults}\n\n`;
  }

  augmentedPrompt += `## User Question:\n${userMessage}`;
  augmentedPrompt += `\n\nPlease answer based on the context provided above. Be accurate and professional.`;

  try {
    const chat = model.startChat({
      history: chatHistory,
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    });

    const result = await chat.sendMessageStream(augmentedPrompt);

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) {
        yield text;
      }
    }
  } catch (error) {
    console.error('[GeminiService] Streaming error:', error.message);

    // If API call fails (e.g. invalid key or network issue), use local mock response as fallback
    console.log('[GeminiService] Falling back to local mock response due to error');
    const mockText = getMockResponse(userMessage);
    if (mockText) {
      const chunkSize = 8;
      for (let i = 0; i < mockText.length; i += chunkSize) {
        yield mockText.substring(i, i + chunkSize);
        await new Promise(resolve => setTimeout(resolve, 20));
      }
      return;
    }

    // Handle specific error types if mock failed
    if (error.message?.includes('429') || error.message?.includes('RESOURCE_EXHAUSTED')) {
      yield 'I\'m currently experiencing high traffic. Please try again in a moment.';
    } else if (error.message?.includes('API_KEY')) {
      yield 'There\'s a configuration issue with the AI service. Please contact Ezhil directly.';
    } else {
      yield 'I encountered an issue generating a response. Please try again or ask a different question.';
    }
  }
}

/**
 * Local mock response generator based on the training data Q&As and tools.
 * Resolves questions locally when Gemini is unavailable or not configured.
 */
/**
 * Local mock response generator based on the training data Q&As and tools.
 * Resolves questions locally when Gemini is unavailable or not configured.
 */
function getMockResponse(userMessage) {
  try {
    const trainingDataPath = path.join(__dirname, '..', 'data', 'training_data.txt');
    if (!fs.existsSync(trainingDataPath)) {
      return "That's a great question! I don't have that specific detail right now. The best way to get an accurate answer is to reach out to Ezhil directly:\n" +
             "📧 sanjayraina023@gmail.com\n" +
             "📞 +91 8637674227\n" +
             "💼 linkedin.com/in/ezhil-savier/\n" +
             "He'd love to connect!";
    }
    const text = fs.readFileSync(trainingDataPath, 'utf-8');
    
    // Parse Q&As from training_data.txt
    const qas = [];
    
    // Parse the new unnumbered Q&A format (**Q: ...** followed by > ...)
    const newQaRegex = /\*\*Q:\s*([^*]+)\*\*\s*\n*((?:>[^\n]*(?:\n|$))+)/g;
    let match;
    while ((match = newQaRegex.exec(text)) !== null) {
      const question = match[1].trim();
      let answer = match[2].trim();
      // Clean up leading '>' on each line
      answer = answer.split('\n').map(line => line.replace(/^>\s?/, '')).join('\n');
      qas.push({ question, answer });
    }
    
    // Backwards-compatible fallback to legacy Section 7 format if no Q&As matched
    if (qas.length === 0) {
      const parts = text.split('## SECTION 7 — Q&A TRAINING DATA');
      const qaSection = parts.length > 1 ? parts[1].split('## SECTION 8')[0] : '';
      if (qaSection) {
        const legacyQaRegex = /\*\*Q\d+:\s*([^*]+)\*\*\s*([\s\S]*?)(?=\*\*Q\d+:|### CATEGORY|$)/g;
        while ((match = legacyQaRegex.exec(qaSection)) !== null) {
          const question = match[1].trim();
          let answer = match[2].trim();
          answer = answer.replace(/^>\s*/gm, '').trim();
          qas.push({ question, answer });
        }
      }
    }
    
    if (qas.length === 0) {
      return "That's a great question! I don't have that specific detail right now. The best way to get an accurate answer is to reach out to Ezhil directly:\n" +
             "📧 sanjayraina023@gmail.com\n" +
             "📞 +91 8637674227\n" +
             "💼 linkedin.com/in/ezhil-savier/\n" +
             "He'd love to connect!";
    }
    
    // Tokenize query
    const queryTokens = tokenize(userMessage);
    const cleanQuery = userMessage.toLowerCase().replace(/[^\w\s]/g, '');
    
    let bestMatch = null;
    let maxScore = 0;
    
    for (const qa of qas) {
      const questionTokens = tokenize(qa.question);
      const cleanQ = qa.question.toLowerCase().replace(/[^\w\s]/g, '');
      
      // Calculate Jaccard similarity score between token sets
      let score = jaccardSimilarity(queryTokens, questionTokens);
      
      // Boost score if there's exact phrasing match with word boundaries
      if (cleanQ.trim() && cleanQuery.trim()) {
        const escapedQ = cleanQ.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const wordRegex = new RegExp(`\\b${escapedQ}\\b`);
        const escapedQuery = cleanQuery.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const queryRegex = new RegExp(`\\b${escapedQuery}\\b`);
        
        if (wordRegex.test(cleanQuery) || queryRegex.test(cleanQ)) {
          const ratio = Math.min(cleanQ.length, cleanQuery.length) / Math.max(cleanQ.length, cleanQuery.length);
          score += 0.5 * ratio; // Proportional phrasing boost
        }
      }
      
      if (score > maxScore) {
        maxScore = score;
        bestMatch = qa;
      }
    }
    
    // Threshold to prevent matching completely unrelated queries
    // Combining token Jaccard similarity threshold and phrasing boosts
    const SIMILARITY_THRESHOLD = 0.12;
    if (maxScore >= SIMILARITY_THRESHOLD && bestMatch) {
      return bestMatch.answer;
    }
    
    // Fallback based on keywords
    if (cleanQuery.includes('project') || cleanQuery.includes('phishguard') || cleanQuery.includes('sentient') || cleanQuery.includes('memosnap') || cleanQuery.includes('trustcart')) {
      const projectTool = require('../tools/getProjects');
      return "Here are the projects Ezhil has built:\n\n" + projectTool.getProjects().map(p => {
        return `### ${p.name} (${p.category})
${p.description}
* **Tech Stack:** ${p.techStack.join(', ')}
* **Pipeline:** ${p.pipeline}
* **GitHub:** ${p.github ? `[Link](${p.github})` : 'Private'}
* **Highlight:** ${p.highlight}`;
      }).join('\n\n');
    }
    
    if (cleanQuery.includes('skill') || cleanQuery.includes('tech') || cleanQuery.includes('languages') || cleanQuery.includes('arsenal')) {
      const skillsTool = require('../tools/getSkills');
      return skillsTool.formatSkills();
    }
    
    if (cleanQuery.includes('intern') || cleanQuery.includes('internship') || cleanQuery.includes('neura')) {
      const expTool = require('../tools/getExperience');
      return expTool.formatInternship();
    }
    
    if (cleanQuery.includes('experience') || cleanQuery.includes('leadership') || cleanQuery.includes('work') || cleanQuery.includes('coordinator')) {
      const expTool = require('../tools/getExperience');
      return expTool.formatExperience();
    }
    
    return "That's a great question! I don't have that specific detail right now. The best way to get an accurate answer is to reach out to Ezhil directly:\n" +
           "📧 sanjayraina023@gmail.com\n" +
           "📞 +91 8637674227\n" +
           "💼 linkedin.com/in/ezhil-savier/\n" +
           "He'd love to connect!";
  } catch (error) {
    console.error('Mock response generation error:', error);
    return "That's a great question! I don't have that specific detail right now. The best way to get an accurate answer is to reach out to Ezhil directly:\n" +
           "📧 sanjayraina023@gmail.com\n" +
           "📞 +91 8637674227\n" +
           "💼 linkedin.com/in/ezhil-savier/\n" +
           "He'd love to connect!";
  }
}

/**
 * Generate an embedding vector for the given text.
 * Used by the RAG pipeline for document and query embedding.
 * @param {string} text - Text to embed
 * @returns {Promise<number[]>} - Embedding vector
 */
async function generateEmbedding(text) {
  const model = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });

  try {
    const result = await model.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.error('[GeminiService] Embedding error:', error.message);
    throw new Error('Failed to generate embedding');
  }
}

/**
 * Generate embeddings for a batch of texts.
 * Processes sequentially to respect rate limits.
 * @param {string[]} texts - Array of texts to embed
 * @returns {Promise<number[][]>} - Array of embedding vectors
 */
async function generateBatchEmbeddings(texts) {
  const embeddings = [];

  for (let i = 0; i < texts.length; i++) {
    // Small delay between requests to avoid rate limiting
    if (i > 0 && i % 5 === 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const embedding = await generateEmbedding(texts[i]);
    embeddings.push(embedding);

    if ((i + 1) % 10 === 0) {
      console.log(`[GeminiService] Embedded ${i + 1}/${texts.length} chunks`);
    }
  }

  return embeddings;
}

module.exports = {
  generateStreamingResponse,
  generateEmbedding,
  generateBatchEmbeddings,
  SYSTEM_PROMPT,
  getMockResponse, // Exported for verification testing
};

