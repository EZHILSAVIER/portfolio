"use client";

import { motion } from "framer-motion";

/**
 * SuggestedPrompts — Grid of clickable prompt suggestions.
 * Shown on the welcome screen when chat is empty.
 */
const CANONICAL_QUESTIONS = [
  // Identity
  { text: "Who is Ezhil Savier?", icon: "👤", category: "identity" },
  { text: "What makes Ezhil stand out?", icon: "⭐", category: "identity" },
  { text: "What is Ezhil's educational background?", icon: "🎓", category: "education" },
  { text: "What was Ezhil's CGPA score?", icon: "📊", category: "education" },
  { text: "Where did Ezhil study college?", icon: "🏫", category: "education" },
  { text: "Does Ezhil have work experience?", icon: "💼", category: "experience" },
  { text: "Tell me about Ezhil's internship", icon: "📋", category: "experience" },
  
  // Projects
  { text: "Tell me about PhishGuard", icon: "🛡️", category: "projects" },
  { text: "How does PhishGuard work?", icon: "⚙️", category: "projects" },
  { text: "What problem does PhishGuard solve?", icon: "❓", category: "projects" },
  { text: "Tell me about TrustCart", icon: "🛒", category: "projects" },
  { text: "How does TrustCart work?", icon: "⚙️", category: "projects" },
  { text: "What problem does TrustCart solve?", icon: "❓", category: "projects" },
  { text: "Tell me about Sentient Shopper", icon: "🤖", category: "projects" },
  { text: "How does Sentient Shopper work?", icon: "⚙️", category: "projects" },
  { text: "Tell me about MemoSnap", icon: "📸", category: "projects" },
  { text: "What projects has Ezhil built?", icon: "💻", category: "projects" },
  { text: "Are Ezhil's projects on GitHub?", icon: "🐙", category: "projects" },
  
  // Experience / Leadership
  { text: "Does Ezhil have leadership experience?", icon: "👥", category: "leadership" },
  { text: "Tell me about the symposium he led", icon: "📢", category: "leadership" },
  { text: "Is Ezhil only a technical person?", icon: "💬", category: "leadership" },
  
  // Skills / Stack
  { text: "What are Ezhil's technical skills?", icon: "🛠️", category: "skills" },
  { text: "Does Ezhil know Python?", icon: "🐍", category: "skills" },
  { text: "Does Ezhil know React?", icon: "⚛️", category: "skills" },
  { text: "Does Ezhil know machine learning?", icon: "🤖", category: "skills" },
  { text: "Does Ezhil know deep learning?", icon: "🧠", category: "skills" },
  { text: "Does Ezhil know NLP?", icon: "🗣️", category: "skills" },
  { text: "Does Ezhil know computer vision?", icon: "👁️", category: "skills" },
  { text: "Does Ezhil know SQL?", icon: "🗄️", category: "skills" },
  { text: "Does Ezhil know Docker?", icon: "🐳", category: "skills" },
  
  // Hiring / Contact
  { text: "Is Ezhil available to hire?", icon: "💼", category: "hiring" },
  { text: "How can I contact him?", icon: "📧", category: "hiring" },
  { text: "Where can I see his resume?", icon: "📄", category: "hiring" },
  { text: "Is Ezhil open to remote work?", icon: "🏠", category: "hiring" },
  { text: "Can Ezhil relocate?", icon: "✈️", category: "hiring" },
  { text: "What roles is Ezhil looking for?", icon: "🎯", category: "hiring" },
  { text: "What are Ezhil's strengths?", icon: "💪", category: "assessment" }
];

// Stop words list for query parsing
const STOP_WORDS = new Set([
  'what', 'is', 'ezhil', 'ezhils', 'savier', 'does', 'did', 'how', 'can', 'who', 
  'where', 'are', 'you', 'the', 'and', 'for', 'about', 'him', 'his', 'her', 'them', 
  'their', 'tell', 'me', 'has', 'have', 'been', 'with', 'out', 'this', 'that', 'they',
  'a', 'an', 'to', 'in', 'of', 'on', 'at', 'about', 'by', 'do', 'any', 'some', 'he',
  'she', 'it', 'we', 'us', 'there', 'here', 'know', 'knows', 'knew', 'known', 'want', 
  'wants', 'go', 'goes', 'went', 'was', 'were', 'be', 'being', 'am'
]);

function stem(word) {
  let w = word.trim().toLowerCase();
  if (w.length <= 2) return w;
  if (w.endsWith('ing')) {
    w = w.slice(0, -3);
  } else if (w.endsWith('ed')) {
    w = w.slice(0, -2);
  } else if (w.endsWith('es')) {
    w = w.slice(0, -2);
  } else if (w.endsWith('s') && !w.endsWith('ss')) {
    w = w.slice(0, -1);
  }
  if (w === 'built') return 'build';
  if (w === 'studied' || w === 'studies') return 'studi';
  if (w === 'developed' || w === 'development') return 'develop';
  return w;
}

function tokenize(text) {
  if (!text) return new Set();
  const clean = text.toLowerCase().replace(/[^\w\s-]/g, ' ');
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
  for (let i = 0; i < unigrams.length - 1; i++) {
    tokenSet.add(`${unigrams[i]}_${unigrams[i+1]}`);
  }
  return tokenSet;
}

function jaccardSimilarity(setA, setB) {
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersectionCount = 0;
  for (const item of setA) {
    if (setB.has(item)) intersectionCount++;
  }
  const unionSize = setA.size + setB.size - intersectionCount;
  return unionSize === 0 ? 0 : intersectionCount / unionSize;
}

/**
 * KNN-based follow-up question recommender.
 * Calculates Jaccard distance between the user message and all canonical questions,
 * boosting items within the matching category and selecting the closest neighbors.
 */
function getKNNRelevantSuggestions(contextQuery) {
  if (!contextQuery) {
    // Default welcome screen suggestions
    return [
      { text: "Who is Ezhil Savier?", icon: "👤" },
      { text: "What projects has he built?", icon: "💻" },
      { text: "What are his technical skills?", icon: "🛠️" },
      { text: "Is he available to hire?", icon: "💼" },
      { text: "Tell me about PhishGuard", icon: "🛡️" },
      { text: "Tell me about TrustCart", icon: "🛒" },
      { text: "Does Ezhil have work experience?", icon: "📋" },
      { text: "How can I contact him?", icon: "📧" },
    ];
  }

  const queryTokens = tokenize(contextQuery);
  
  // Find the category of the best matching question to use for topic boosting
  let bestCategory = 'identity';
  let bestSim = 0;
  
  for (const q of CANONICAL_QUESTIONS) {
    const qTokens = tokenize(q.text);
    const sim = jaccardSimilarity(queryTokens, qTokens);
    if (sim > bestSim) {
      bestSim = sim;
      bestCategory = q.category;
    }
  }

  // Calculate scores for all candidates
  const scored = CANONICAL_QUESTIONS.map(q => {
    const qTokens = tokenize(q.text);
    const jaccard = jaccardSimilarity(queryTokens, qTokens);
    
    // Proportional phrasing boost
    let boost = 0;
    const cleanQ = q.text.toLowerCase().replace(/[^\w\s]/g, '');
    const cleanQuery = contextQuery.toLowerCase().replace(/[^\w\s]/g, '');
    if (cleanQ.includes(cleanQuery) || cleanQuery.includes(cleanQ)) {
      const ratio = Math.min(cleanQ.length, cleanQuery.length) / Math.max(cleanQ.length, cleanQuery.length);
      boost += 0.3 * ratio;
    }

    // Category proximity boost for related topics
    if (q.category === bestCategory) {
      boost += 0.25;
    }

    const finalScore = jaccard + boost;
    return { ...q, score: finalScore, jaccard };
  });

  // Filter out the exact query variation (similarity > 0.85) to avoid suggesting the same question
  const filtered = scored.filter(q => q.jaccard < 0.85);

  // Sort by score descending and return the top 4 closest neighbors
  filtered.sort((a, b) => b.score - a.score);

  return filtered.slice(0, 4);
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export default function SuggestedPrompts({ onSelect, compact = false, contextQuery = "" }) {
  const list = getKNNRelevantSuggestions(contextQuery);

  // For welcome screen, show the first 8 items
  const displayList = compact ? list : list.slice(0, 8);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={
        compact
          ? "flex flex-wrap gap-2 justify-center w-full px-2"
          : "grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg px-4"
      }
    >
      {displayList.map((suggestion, index) => (
        <motion.button
          key={index}
          variants={itemVariants}
          whileHover={{ scale: compact ? 1.03 : 1.02 }}
          whileTap={{ scale: compact ? 0.97 : 0.98 }}
          onClick={() => onSelect(suggestion.text)}
          className={
            compact
              ? "prompt-chip flex items-center gap-1.5 px-3 py-1.5 rounded-full text-left text-xs"
              : "prompt-chip flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm"
          }
          style={{ fontFamily: "var(--font-body)" }}
        >
          <span className={compact ? "text-sm flex-shrink-0" : "text-lg flex-shrink-0"}>
            {suggestion.icon}
          </span>
          <span>{suggestion.text}</span>
        </motion.button>
      ))}
    </motion.div>
  );
}
