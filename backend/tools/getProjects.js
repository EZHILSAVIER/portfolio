/**
 * Tool: getProjects
 * Returns structured project data for the AI assistant.
 */

function getProjects(filter = null) {
  const projects = [
    {
      name: 'PhishGuard',
      category: 'Cybersecurity · ML · NLP',
      description: 'AI-powered email phishing detection using NLP pipelines and ML classifiers to identify threat patterns in real-time.',
      techStack: ['Scikit-learn', 'TF-IDF', 'Python', 'Tokenization'],
      pipeline: 'Email Input → NLP Parsing → ML Classifier → Threat Alert',
      keyFeatures: [
        'Real-time phishing detection',
        'NLP-based email text analysis',
        'TF-IDF feature extraction',
        'ML classification with high accuracy',
      ],
      github: 'https://github.com/EZHILSAVIER/phishguard',
      highlight: 'Combines NLP and cybersecurity — solves a real-world problem with production-level ML pipeline.',
    },
    {
      name: 'Sentient Shopper',
      category: 'Emotion AI · Computer Vision',
      description: 'Emotion-aware recommendation engine using deep learning CV to detect user sentiment and personalize product suggestions.',
      techStack: ['Deep Learning', 'Computer Vision', 'Collaborative Filtering', 'Predictive Analytics'],
      pipeline: 'Face Scan → Emotion Label → Recommendation',
      keyFeatures: [
        'Real-time facial emotion detection',
        'Deep learning sentiment classification',
        'Emotion-aware product recommendations',
        'Collaborative filtering algorithm',
      ],
      github: null,
      highlight: 'Demonstrates advanced CV + recommendation system integration — cutting-edge Emotion AI.',
    },
    {
      name: 'MemoSnap',
      category: 'Full-Stack · Cloud',
      description: 'Cloud-powered photo journal platform with intuitive capture, tagging, and sharing — blending nostalgia with modern tech.',
      techStack: ['HTML5', 'CSS3', 'JavaScript', 'Cloud Storage', 'REST API'],
      pipeline: 'Capture → Process → Cloud Sync',
      keyFeatures: [
        'Intuitive photo capture interface',
        'Memory tagging and organization',
        'Cloud-powered storage and sync',
        'RESTful API architecture',
      ],
      github: 'https://github.com/EZHILSAVIER/memosnap',
      highlight: 'Full-stack web development with cloud integration — shows end-to-end product building.',
    },
    {
      name: 'TrustCart',
      category: 'LegalTech · AI · Full-Stack',
      description: 'AI-powered e-commerce compliance monitor that scrapes product listings and flags Indian legal violations in real time using Gemini 2.5 Flash, OpenCV watermark detection, and a weighted rule engine.',
      techStack: ['Gemini 2.5 Flash', 'FastAPI', 'React 19', 'OpenCV', 'MongoDB', 'CloudScraper'],
      pipeline: 'URL Input → AI Scrape → Rule Engine → Risk Report',
      keyFeatures: [
        'Real-time e-commerce compliance monitoring',
        'Gemini 2.5 Flash for AI analysis',
        'OpenCV watermark detection',
        'Weighted compliance rule engine',
        'Indian legal framework compliance',
      ],
      github: 'https://github.com/EZHILSAVIER/trustcart',
      highlight: 'Most technically complex project — combines GenAI, CV, web scraping, and legal domain knowledge.',
    },
  ];

  // Apply filter if provided
  if (filter) {
    const filterLower = filter.toLowerCase();
    return projects.filter(p =>
      p.name.toLowerCase().includes(filterLower) ||
      p.category.toLowerCase().includes(filterLower) ||
      p.techStack.some(t => t.toLowerCase().includes(filterLower))
    );
  }

  return projects;
}

/**
 * Format projects into a readable string for the AI prompt.
 */
function formatProjects(filter = null) {
  const projects = getProjects(filter);

  return projects.map(p => {
    return `**${p.name}** (${p.category})
${p.description}
Tech: ${p.techStack.join(', ')}
Pipeline: ${p.pipeline}
Key Features: ${p.keyFeatures.join('; ')}
${p.github ? `GitHub: ${p.github}` : ''}
Why it stands out: ${p.highlight}`;
  }).join('\n\n');
}

module.exports = { getProjects, formatProjects };
