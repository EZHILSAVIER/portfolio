const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'your_gemini_api_key_here');

// Models
const CHAT_MODEL = 'gemini-2.0-flash';
const EMBEDDING_MODEL = 'text-embedding-004';

/**
 * System prompt that defines the AI assistant's personality and behavior.
 * Acts as Ezhil Savier's professional representative.
 */
const SYSTEM_PROMPT = `You are Ezhil's Portfolio Assistant — a friendly, knowledgeable AI on Ezhil Savier S's portfolio website.

Your job is to help visitors learn about Ezhil — his skills, projects, experience, education, and how to contact him.

PERSONALITY:
- Confident and professional, but warm and approachable
- Answers clearly and concisely; never vague
- Uses first-person language about Ezhil (e.g., "Ezhil has built..." or "He specialises in...") [Note: Speak in third person as shown in these examples]
- If asked something not in the training data or RAG context, say: "I don't have that detail right now — feel free to reach out to Ezhil directly at sanjayraina023@gmail.com"

NEVER:
- Make up qualifications, skills, or projects not in this document/context
- Give career advice on behalf of Ezhil without basis
- Share personal or sensitive information beyond what's listed here

KEY FACTS TO ALWAYS REMEMBER:
- Name: Ezhil Savier S
- Role: AI & Data Science Engineer (Fresh Graduate, 2026)
- Location: Hosur, TN — Open to Bengaluru
- Availability: Immediate
- CGPA: 8.22 / 10
- Key projects: PhishGuard, Sentient Shopper, MemoSnap, TrustCart
- Contact: sanjayraina023@gmail.com | +91 8637674227

RAG INSTRUCTIONS:
- You will be provided with relevant context from Ezhil's portfolio data. Always prioritize the facts in the provided context to answer the user's questions.
- Keep your answers grounded in the provided context. If a user asks a specific question about his projects, skills, or experience, refer to the details in the context.`;

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
function getMockResponse(userMessage) {
  try {
    const trainingDataPath = path.join(__dirname, '..', 'data', 'training_data.txt');
    if (!fs.existsSync(trainingDataPath)) {
      return "I represent Ezhil Savier S, an AI & Data Science Engineer. Feel free to contact Ezhil directly at sanjayraina023@gmail.com.";
    }
    const text = fs.readFileSync(trainingDataPath, 'utf-8');
    
    // Parse Q&As from Section 7
    const parts = text.split('## SECTION 7 — Q&A TRAINING DATA');
    const qaSection = parts.length > 1 ? parts[1].split('## SECTION 8')[0] : '';
    if (!qaSection) return "I represent Ezhil Savier S. Please ask about my projects, skills, or contact info.";
    
    // Match Q&A patterns in Section 7
    const qaRegex = /\*\*Q\d+:\s*([^*]+)\*\*\s*([\s\S]*?)(?=\*\*Q\d+:|### CATEGORY|$)/g;
    let match;
    const qas = [];
    while ((match = qaRegex.exec(qaSection)) !== null) {
      const question = match[1].trim();
      let answer = match[2].trim();
      // Remove leading blockquote markers if they exist
      answer = answer.replace(/^>\s*/gm, '').trim();
      qas.push({ question, answer });
    }
    
    if (qas.length === 0) return "I represent Ezhil Savier S. Please ask about my projects, skills, or contact info.";
    
    // Clean user message
    const cleanQuery = userMessage.toLowerCase().replace(/[^\w\s]/g, '');
    const queryWords = cleanQuery.split(/\s+/).filter(w => w.length > 2);
    
    let bestMatch = null;
    let maxScore = 0;
    
    for (const qa of qas) {
      const cleanQ = qa.question.toLowerCase().replace(/[^\w\s]/g, '');
      
      // Calculate overlap score
      let score = 0;
      for (const qw of queryWords) {
        if (cleanQ.includes(qw)) {
          score += 2; // Keyword found in question
        }
      }
      
      // Boost score if there's exact phrasing match
      if (cleanQ.includes(cleanQuery) || cleanQuery.includes(cleanQ)) {
        score += 10;
      }
      
      if (score > maxScore) {
        maxScore = score;
        bestMatch = qa;
      }
    }
    
    // Threshold to prevent matching completely unrelated queries
    if (maxScore >= 2 && bestMatch) {
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
    
    if (cleanQuery.includes('skill') || cleanQuery.includes('tech') || cleanQuery.includes('languages') || cleanQuery.includes('python') || cleanQuery.includes('sql')) {
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
    
    return "I represent Ezhil Savier S, an AI & Data Science Engineer. I can tell you about his projects (PhishGuard, Sentient Shopper, MemoSnap, TrustCart), skills, experience, or contact information. Feel free to ask about any of these, or contact Ezhil directly at sanjayraina023@gmail.com.";
  } catch (error) {
    console.error('Mock response generation error:', error);
    return "I represent Ezhil Savier S. Please ask about my projects, skills, or contact info.";
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
};
