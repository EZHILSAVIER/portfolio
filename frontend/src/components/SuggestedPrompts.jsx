"use client";

import { motion } from "framer-motion";

/**
 * SuggestedPrompts — Grid of clickable prompt suggestions.
 * Shown on the welcome screen when chat is empty.
 */
const SUGGESTIONS = [
  { text: "Who is Ezhil Savier?", icon: "👤" },
  { text: "What projects has he built?", icon: "💻" },
  { text: "What are his technical skills?", icon: "🛠️" },
  { text: "Is he available to hire?", icon: "💼" },
  { text: "Tell me about PhishGuard", icon: "🛡️" },
  { text: "Tell me about TrustCart", icon: "🛒" },
  { text: "What experience does he have?", icon: "📋" },
  { text: "How can I contact him?", icon: "📧" },
];

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

/**
 * Helper to determine relevant follow-up questions based on the user's query.
 */
function getRelevantSuggestions(contextQuery) {
  if (!contextQuery) {
    return SUGGESTIONS;
  }

  const query = contextQuery.toLowerCase().replace(/[^\w\s]/g, '');
  let category = 'general';

  if (query.includes('phishguard') || query.includes('phish')) {
    category = 'phishguard';
  } else if (query.includes('trustcart') || query.includes('trust')) {
    category = 'trustcart';
  } else if (query.includes('project') || query.includes('built') || query.includes('make') || query.includes('developed') || query.includes('memosnap') || query.includes('sentient')) {
    category = 'projects';
  } else if (query.includes('skill') || query.includes('tech') || query.includes('stack') || query.includes('language') || query.includes('python') || query.includes('sql')) {
    category = 'skills';
  } else if (query.includes('experience') || query.includes('work') || query.includes('intern') || query.includes('neura') || query.includes('leadership') || query.includes('coordinator')) {
    category = 'experience';
  } else if (query.includes('hire') || query.includes('available') || query.includes('contact') || query.includes('reach') || query.includes('email') || query.includes('phone')) {
    category = 'hiring';
  } else if (query.includes('who') || query.includes('ezhil') || query.includes('savier')) {
    category = 'about';
  }

  const followUps = {
    phishguard: [
      "Tell me about TrustCart",
      "What are his technical skills?",
      "Is he available to hire?",
      "How can I contact him?"
    ],
    trustcart: [
      "Tell me about PhishGuard",
      "What are his technical skills?",
      "Is he available to hire?",
      "How can I contact him?"
    ],
    projects: [
      "Tell me about TrustCart",
      "Tell me about PhishGuard",
      "What are his technical skills?",
      "What experience does he have?"
    ],
    skills: [
      "What projects has he built?",
      "Tell me about TrustCart",
      "What experience does he have?",
      "Is he available to hire?"
    ],
    experience: [
      "What projects has he built?",
      "Is he available to hire?",
      "How can I contact him?",
      "What are his technical skills?"
    ],
    hiring: [
      "How can I contact him?",
      "What experience does he have?",
      "What projects has he built?",
      "Who is Ezhil Savier?"
    ],
    about: [
      "What projects has he built?",
      "What are his technical skills?",
      "What experience does he have?",
      "Is he available to hire?"
    ],
    general: [
      "Who is Ezhil Savier?",
      "What projects has he built?",
      "What are his technical skills?",
      "Is he available to hire?"
    ]
  };

  const selectedTexts = followUps[category] || followUps.general;
  return selectedTexts.map(text => SUGGESTIONS.find(s => s.text === text)).filter(Boolean);
}

export default function SuggestedPrompts({ onSelect, compact = false, contextQuery = "" }) {
  const list = compact ? getRelevantSuggestions(contextQuery) : SUGGESTIONS;

  if (compact) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap gap-2 justify-center w-full px-2"
      >
        {list.map((suggestion, index) => (
          <motion.button
            key={index}
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(suggestion.text)}
            className="prompt-chip flex items-center gap-1.5 px-3 py-1.5 rounded-full text-left text-xs"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <span className="text-sm flex-shrink-0">{suggestion.icon}</span>
            <span>{suggestion.text}</span>
          </motion.button>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg px-4"
    >
      {list.map((suggestion, index) => (
        <motion.button
          key={index}
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(suggestion.text)}
          className="prompt-chip flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm"
          style={{ fontFamily: "var(--font-body)" }}
        >
          <span className="text-lg flex-shrink-0">{suggestion.icon}</span>
          <span>{suggestion.text}</span>
        </motion.button>
      ))}
    </motion.div>
  );
}
