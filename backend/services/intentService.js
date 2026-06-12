/**
 * Intent Service
 * Detects user intent from their message for tool routing.
 * Uses keyword matching and pattern recognition for fast classification.
 */

// Intent definitions with associated keywords and patterns
const INTENT_MAP = {
  projects: {
    keywords: [
      'project', 'projects', 'built', 'build', 'portfolio', 'work',
      'phishguard', 'phish', 'trustcart', 'memosnap', 'sentient',
      'shopper', 'application', 'app', 'system', 'developed', 'created',
    ],
    patterns: [
      /what.*(built|made|created|developed)/i,
      /tell.*about.*(project|work)/i,
      /show.*project/i,
      /best.*project/i,
      /recommend.*project/i,
      /explain.*(phishguard|trustcart|memosnap|sentient)/i,
    ],
  },

  skills: {
    keywords: [
      'skill', 'skills', 'tech', 'technology', 'stack', 'technologies',
      'language', 'languages', 'framework', 'tool', 'tools',
      'python', 'tensorflow', 'scikit', 'numpy', 'pandas',
      'know', 'proficient', 'expertise', 'capable',
    ],
    patterns: [
      /what.*(skill|know|use|tech)/i,
      /tech.*stack/i,
      /programming.*language/i,
      /what.*tools/i,
    ],
  },

  experience: {
    keywords: [
      'experience', 'work', 'internship', 'intern', 'job',
      'leadership', 'coordinator', 'committee', 'neura',
      'symposium', 'event', 'role', 'career',
    ],
    patterns: [
      /work.*experience/i,
      /where.*work/i,
      /internship/i,
      /leadership.*experience/i,
      /professional.*experience/i,
    ],
  },

  resume: {
    keywords: [
      'resume', 'cv', 'education', 'degree', 'cgpa', 'gpa',
      'college', 'university', 'qualification', 'academic',
      'btech', 'b.tech', 'graduate', 'certification',
    ],
    patterns: [
      /educational.*background/i,
      /where.*study/i,
      /where.*studi/i,
      /academic.*record/i,
      /resume/i,
    ],
  },

  contact: {
    keywords: [
      'contact', 'email', 'phone', 'reach', 'connect',
      'linkedin', 'github', 'hire', 'available', 'availability',
      'location', 'relocate', 'bangalore', 'bengaluru',
    ],
    patterns: [
      /how.*(contact|reach|connect)/i,
      /email.*address/i,
      /available/i,
      /hire/i,
      /where.*(located|based)/i,
    ],
  },

  recommendation: {
    keywords: [
      'recommend', 'best', 'impressive', 'top', 'strongest',
      'hire', 'why', 'should', 'candidate', 'fit',
      'strength', 'unique', 'stand out', 'different',
    ],
    patterns: [
      /why.*(hire|choose|pick)/i,
      /what.*makes.*special/i,
      /best.*candidate/i,
      /why.*should/i,
      /recommend/i,
      /what.*best/i,
      /stand.*out/i,
    ],
  },
};

/**
 * Detect the intent of a user message.
 * @param {string} message - The user's message
 * @returns {{intent: string, confidence: number}} - Detected intent and confidence score
 */
function detectIntent(message) {
  const lowerMessage = message.toLowerCase();
  const scores = {};

  for (const [intent, config] of Object.entries(INTENT_MAP)) {
    let score = 0;

    // Score keyword matches (each keyword match adds 1 point)
    for (const keyword of config.keywords) {
      if (lowerMessage.includes(keyword)) {
        score += 1;
      }
    }

    // Score pattern matches (each pattern match adds 3 points — higher signal)
    for (const pattern of config.patterns) {
      if (pattern.test(message)) {
        score += 3;
      }
    }

    scores[intent] = score;
  }

  // Find the intent with the highest score
  let bestIntent = 'general';
  let bestScore = 0;

  for (const [intent, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      bestIntent = intent;
    }
  }

  // Calculate confidence as a normalized score (0-1)
  const maxPossible = 10; // rough normalization factor
  const confidence = Math.min(bestScore / maxPossible, 1);

  // If confidence is very low, classify as "general"
  if (confidence < 0.1) {
    bestIntent = 'general';
  }

  return {
    intent: bestIntent,
    confidence: parseFloat(confidence.toFixed(2)),
  };
}

module.exports = { detectIntent };
