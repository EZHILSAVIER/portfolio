const fs = require('fs');
const path = require('path');
const { getMockResponse } = require('../services/geminiService');

const testCases = [
  // Greetings & Opening
  { query: 'hello there!', expect: 'portfolio assistant' },
  { query: 'what is your job here?', expect: 'projects, technical skills' },
  { query: 'who built this web site?', expect: 'designed and built entirely by Ezhil' },
  
  // Identity
  { query: 'tell me about ezhil savier', expect: 'AI & Data Science' },
  { query: 'what is his full name?', expect: 'Ezhil Savier S' },
  { query: 'where does ezhil live currently?', expect: 'Hosur, Tamil Nadu' },
  { query: 'does ezhil live in Bangalore?', expect: 'actively open to relocating to Bengaluru' },
  
  // Contact & Hiring
  { query: 'how can I contact ezhil savier?', expect: 'sanjayraina023@gmail.com' },
  { query: 'is he looking for a job immediately?', expect: 'available immediately and actively looking' },
  { query: 'can I hire ezhil for remote work?', expect: 'reach out directly' },
  { query: 'where is his resume link?', expect: 'https://drive.google.com/file' },
  
  // Education
  { query: 'what did ezhil study in college?', expect: 'B.Tech in Artificial Intelligence' },
  { query: 'which university did he graduate from?', expect: 'Anna University' },

  { query: 'what was his CGPA score?', expect: '8.22' },
  { query: 'where did ezhil do his schooling?', expect: 'Swamy Vivekanandha' },
  
  // Skills
  { query: 'what programming languages does he know?', expect: 'Python (primary' },
  { query: 'does ezhil know machine learning?', expect: 'hands-on ML experience' },
  { query: 'does he have experience with react frontend?', expect: 'React 19' },
  { query: 'does he know tensorflow?', expect: 'foundational TensorFlow knowledge' },
  { query: 'does he know docker?', expect: 'containerisation' },
  
  // Projects
  { query: 'tell me about the phishing detection project', expect: 'PhishGuard' },
  { query: 'how does sentient shopper work?', expect: 'Camera captures customer' },
  { query: 'what does memosnap do?', expect: 'cloud-powered photo journal' },
  { query: 'explain trustcart legal compliance monitor', expect: 'compliance monitor' },
  { query: 'which project is his most complex?', expect: 'TrustCart' },
  
  // Experience & Leadership
  { query: 'does ezhil have work experience?', expect: 'interned at Neura-AI Solutions' },
  { query: 'tell me about the symposium he led', expect: 'Head Coordinator' },
  { query: 'does he have soft skills?', expect: 'He has coordinated 500+' },
  
  // Edge cases and fallbacks
  { query: 'what is ezhil\'s favorite movie?', expect: 'sanjayraina023@gmail.com' }, // fallback
  { query: 'can you write python code for bubble sort?', expect: 'sanjayraina023@gmail.com' }, // fallback
  { query: 'what is the capital of France?', expect: 'sanjayraina023@gmail.com' } // fallback
];

// Re-implement the tokenization logic from geminiService to print debug info
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
  if (w.length > 3 && w.slice(-1) === w.slice(-2, -1) && !['l', 's', 'z'].includes(w.slice(-1))) {
    w = w.slice(0, -1);
  }
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

function debugMatch(query) {
  const trainingDataPath = path.join(__dirname, '..', 'data', 'training_data.txt');
  const text = fs.readFileSync(trainingDataPath, 'utf-8');
  
  const qas = [];
  const newQaRegex = /\*\*Q:\s*([^*]+)\*\*\s*\n*((?:>[^\n]*(?:\n|$))+)/g;
  let match;
  while ((match = newQaRegex.exec(text)) !== null) {
    const question = match[1].trim();
    let answer = match[2].trim().split('\n').map(line => line.replace(/^>\s?/, '')).join('\n');
    qas.push({ question, answer });
  }

  const queryTokens = tokenize(query);
  const cleanQuery = query.toLowerCase().replace(/[^\w\s]/g, '');

  const scoredMatches = [];
  for (const qa of qas) {
    const questionTokens = tokenize(qa.question);
    const cleanQ = qa.question.toLowerCase().replace(/[^\w\s]/g, '');
    let score = jaccardSimilarity(queryTokens, questionTokens);
    let boost = 0;
    
    if (cleanQ.trim() && cleanQuery.trim()) {
      const escapedQ = cleanQ.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const wordRegex = new RegExp(`\\b${escapedQ}\\b`);
      const escapedQuery = cleanQuery.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const queryRegex = new RegExp(`\\b${escapedQuery}\\b`);
      
      if (wordRegex.test(cleanQuery) || queryRegex.test(cleanQ)) {
        const ratio = Math.min(cleanQ.length, cleanQuery.length) / Math.max(cleanQ.length, cleanQuery.length);
        boost = 0.5 * ratio;
        score += boost;
      }
    }
    scoredMatches.push({ qa, score, jaccard: score - boost, boost, questionTokens });
  }

  scoredMatches.sort((a, b) => b.score - a.score);
  return {
    queryTokens: Array.from(queryTokens),
    topMatches: scoredMatches.slice(0, 5)
  };
}

function runTests() {
  console.log('--- STARTING Q&A VERIFICATION TESTS ---');
  console.log(`Testing against training_data.txt ...\n`);

  let passed = 0;
  let failed = 0;
  const startTotal = Date.now();

  for (const tc of testCases) {
    const start = Date.now();
    const response = getMockResponse(tc.query);
    const latency = Date.now() - start;

    const lowercaseResponse = response.toLowerCase();
    const lowercaseExpect = tc.expect.toLowerCase();

    if (lowercaseResponse.includes(lowercaseExpect)) {
      console.log(`\n🟢 PASSED: "${tc.query}" -> matched expected snippet ("${tc.expect}") [${latency}ms]`);
      passed++;
    } else {
      console.log(`\n🔴 FAILED: "${tc.query}"`);
      console.log(`   Expected to contain: "${tc.expect}"`);
      console.log(`   Received: "${response.substring(0, 150)}..."`);
      failed++;
      
      const debug = debugMatch(tc.query);
      console.log(`   Query Tokens: ${JSON.stringify(debug.queryTokens)}`);
      console.log(`   Top Matches:`);
      debug.topMatches.forEach((m, idx) => {
        console.log(`     ${idx + 1}. Q: "${m.qa.question}"`);
        console.log(`        Score: ${m.score.toFixed(3)} (Jaccard: ${m.jaccard.toFixed(3)}, Boost: ${m.boost})`);
        console.log(`        Tokens: ${JSON.stringify(Array.from(m.questionTokens))}`);
      });
    }
  }

  const totalTime = Date.now() - startTotal;
  console.log(`\n--- VERIFICATION SUMMARY ---`);
  console.log(`Passed: ${passed}/${testCases.length}`);
  console.log(`Failed: ${failed}/${testCases.length}`);
  console.log(`Total Latency: ${totalTime}ms (Avg: ${(totalTime / testCases.length).toFixed(2)}ms per query)`);

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log('🎉 All verification tests passed successfully!');
    process.exit(0);
  }
}

runTests();
