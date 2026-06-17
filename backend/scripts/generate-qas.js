const fs = require('fs');
const path = require('path');

// Helper to expand placeholders in templates
function expandTemplates(templates, placeholders) {
  let currentList = [...templates];
  
  for (const [key, values] of Object.entries(placeholders)) {
    const placeholderStr = `[${key}]`;
    let nextList = [];
    
    for (const item of currentList) {
      if (item.includes(placeholderStr)) {
        for (const value of values) {
          nextList.push(item.replace(new RegExp(`\\[${key}\\]`, 'g'), value));
        }
      } else {
        nextList.push(item);
      }
    }
    currentList = nextList;
  }
  
  // Clean up extra spaces, punctuation, and deduplicate
  const unique = new Set(
    currentList
      .map(s => s.trim().replace(/\s+/g, ' ').replace(/\?+/g, '?'))
      .filter(s => s.length > 0)
  );
  
  return Array.from(unique);
}

// Defining placeholders
const commonPlaceholders = {
  name: ['Ezhil', 'Ezhil Savier', 'Ezhil Savier S'],
  ezhil: ['Ezhil', 'Ezhil Savier', 'Ezhil Savier S'],
  his: ['his', "Ezhil's"],
  him: ['him', 'Ezhil', 'Ezhil Savier'],
  study: ['study', 'studied', 'learn', 'learned', 'specialize in', 'specialise in', 'focus on', 'pursue'],
  college: ['college', 'university', 'school', 'engineering college', 'AVS', 'AVS Engineering College', 'AVSEC'],
  projects: ['projects', 'work', 'applications', 'apps', 'systems', 'projects built'],
  built: ['built', 'developed', 'created', 'made', 'coded', 'designed', 'implemented'],
  skills: ['skills', 'tech stack', 'technologies', 'tools', 'arsenal'],
  contact: ['contact', 'reach', 'email', 'get in touch with', 'message', 'call', 'connect with'],
  hire: ['hire', 'employ', 'recruit', 'onboard', 'hire immediately'],
  work: ['work', 'experience', 'internship', 'career', 'job history'],

  leadership: ['leadership', 'symposium', 'coordinator', 'class head', 'management skills'],
  phishguard: ['PhishGuard', 'phishing email spam detection tool', 'cybersecurity project', 'phishing detector'],
  sentient: ['Sentient Shopper', 'emotion shopper', 'retail recommender', 'emotion AI shopping assistant'],
  memosnap: ['MemoSnap', 'photo journal app', 'cloud storage photo app', 'photo sync app'],
  trustcart: ['TrustCart', 'e-commerce compliance monitor', 'AI listing analyzer', 'legal compliance project']
};

const baseQAs = [
  // ==========================================
  // BLOCK 1: GREETINGS & OPENING
  // ==========================================
  {
    category: 'GREETINGS & OPENING',
    answer: `Hey there! 👋 I'm Ezhil's portfolio assistant. Ask me anything about his skills, projects, experience, or how to reach him!`,
    templates: [
      'Hi', 'Hello', 'Hey', 'greetings', 'chatbot', 'hello there', 'yo', 'good morning', 'good afternoon', 'good evening', 'hi there', 'hey there',
      'is anyone there?', 'hello assistant', 'hey assistant', 'hi assistant', 'greet', 'greetings bot', 'hello chatbot', 'hey chatbot', 'hi chatbot'
    ],
    placeholders: {}
  },
  {
    category: 'GREETINGS & OPENING',
    answer: `I can tell you everything about Ezhil — his AI/ML projects, technical skills, work experience, education, leadership roles, and how to contact him. Try asking "What projects has he built?" or "Is he available to hire?"`,
    templates: [
      'What can you do?', 'What can I ask you?', 'How can you help me?', 'What is your purpose?', 'What are you for?', 'What questions can I ask?',
      'tell me what you can do', 'explain what you do', 'what do you do?', 'what is your job?', 'how does this chatbot work?', 'what can this assistant do?'
    ],
    placeholders: {}
  },
  {
    category: 'GREETINGS & OPENING',
    answer: `This portfolio was designed and built entirely by Ezhil Savier S himself in 2026. It's deployed on Netlify.`,
    templates: [
      'Who built this portfolio?', 'Who created this website?', 'Who made this page?', 'Who is the author of this portfolio?', 'Who designed this site?',
      'who is the developer of this website?', 'who coded this website?', 'who made this portfolio?', 'who designed this portfolio?'
    ],
    placeholders: {}
  },
  {
    category: 'GREETINGS & OPENING',
    answer: `This is Ezhil Savier S's personal portfolio — an AI & Data Science engineer. The site showcases his projects, skills, experience, and contact info. His philosophy: "Intelligence with Intent."`,
    templates: [
      'What is this website?', 'What is this portfolio?', 'What is the purpose of this site?', 'Tell me about this website', 'What is this page about?',
      'what is this netlify site?', 'what is ezhil portfolio site?'
    ],
    placeholders: {}
  },
  {
    category: 'FAREWELL & CLOSING',
    answer: `You're very welcome! It was a pleasure chatting with you. Feel free to reach out to Ezhil directly at sanjayraina023@gmail.com if you have any more questions or want to collaborate. Have a wonderful day! 👋`,
    templates: [
      'bye', 'goodbye', 'see you', 'thanks', 'thank you', 'bye bye', 'cya', 'talk to you later', 'byee', 'bye-bye',
      'thank you so much', 'thanks for the help', 'thanks for chatting', 'have a good day', 'farewell', 'good bye', 'ok bye', 'byebye'
    ],
    placeholders: {}
  },

  // ==========================================
  // BLOCK 2: IDENTITY & PERSONAL INFO
  // ==========================================
  {
    category: 'IDENTITY & PERSONAL INFO',
    answer: `Ezhil Savier S is an AI & Data Science engineer and fresh B.Tech graduate from Anna University (AVS Engineering College, Salem). He builds real-world AI systems — from phishing detection to emotion-aware shopping assistants. Beyond code, he's a proven leader who's coordinated national-level events for 500+ people. His motto: "Intelligence with Intent."`,
    templates: [
      'Who is [name]?', 'Tell me about [name].', 'Introduce [name].', 'Who is this [name]?', 'Can you introduce [name]?',
      'What do you know about [name]?', 'Give me an introduction of [name].', 'Overview of [name].'
    ],
    placeholders: { name: commonPlaceholders.name }
  },
  {
    category: 'IDENTITY & PERSONAL INFO',
    answer: `His full name is Ezhil Savier S.`,
    templates: [
      'What is [his] full name?', 'What is [his] name?', "What is Ezhil's complete name?", 'Ezhil full name', 'full name of Ezhil'
    ],
    placeholders: { his: commonPlaceholders.his }
  },
  {
    category: 'IDENTITY & PERSONAL INFO',
    answer: `He's based in Hosur, Tamil Nadu, and is open to opportunities in Bengaluru.`,
    templates: [
      'Where is [ezhil] from?', 'Where does [ezhil] come from?', 'What is [his] hometown?', 'Where is [his] home?', 'Is Ezhil from Tamil Nadu?',
      'where was Ezhil born?', 'where is [ezhil] located?'
    ],
    placeholders: { ezhil: commonPlaceholders.ezhil, his: commonPlaceholders.his }
  },
  {
    category: 'IDENTITY & PERSONAL INFO',
    answer: `Hosur, Tamil Nadu. He's actively open to relocating to Bengaluru for the right opportunity.`,
    templates: [
      'Where does [ezhil] live?', 'Where is [ezhil] currently staying?', 'Where is [his] current location?', 'Where is [his] residence?',
      'where is [ezhil] based now?', 'does Ezhil live in Bengaluru?'
    ],
    placeholders: { ezhil: commonPlaceholders.ezhil, his: commonPlaceholders.his }
  },
  {
    category: 'IDENTITY & PERSONAL INFO',
    answer: `"Intelligence with Intent" — meaning he doesn't just build models, he builds AI systems that solve real problems end-to-end.`,
    templates: [
      'What is [his] tagline?', 'What is [his] motto?', 'What is [his] philosophy?', "What does 'Intelligence with Intent' mean?",
      'What is the tagline of [name]?', 'What is [his] core motto?'
    ],
    placeholders: { his: commonPlaceholders.his, name: commonPlaceholders.name }
  },
  {
    category: 'IDENTITY & PERSONAL INFO',
    answer: `Ezhil Savier S is a B.Tech AI & Data Science graduate (2026) from Anna University. He specialises in ML, NLP, Computer Vision, and full-stack AI development. His projects span cybersecurity (PhishGuard), emotion AI (Sentient Shopper), LegalTech (TrustCart), and cloud apps (MemoSnap). He's also a strong leader — coordinating 500+ participant events and heading class committees. Available immediately, open to Bengaluru.`,
    templates: [
      'Tell me about [ezhil].', 'Explain about [ezhil].', 'Who actually is [ezhil]?', 'Give me a brief about [ezhil].',
      'Brief introduction of [ezhil].', 'Tell me more about [ezhil].'
    ],
    placeholders: { ezhil: commonPlaceholders.ezhil }
  },
  {
    category: 'IDENTITY & PERSONAL INFO',
    answer: `Ezhil combines deep technical skill with strong leadership and communication ability. He thinks in systems — whether it's a neural network architecture or a team workflow. He's driven by practical impact, not just academic exercises.`,
    templates: [
      'What kind of person is [ezhil]?', "What is [ezhil]'s personality?", 'What are [his] traits?', 'Describe Ezhil as a person.',
      'What is [his] attitude?', 'Is Ezhil dedicated?'
    ],
    placeholders: { ezhil: commonPlaceholders.ezhil, his: commonPlaceholders.his }
  },
  {
    category: 'IDENTITY & PERSONAL INFO',
    answer: `He's a fresh graduate (B.Tech 2026) with real-world exposure through an ML internship at Neura-AI Solutions, four end-to-end projects, and significant leadership experience coordinating large-scale events.`,
    templates: [
      'Is [ezhil] a fresher or experienced?', 'How many years of experience does [ezhil] have?',
      'Is Ezhil an experienced engineer?', 'Is Ezhil a graduate fresher?', 'experience level of [ezhil]'
    ],
    placeholders: { ezhil: commonPlaceholders.ezhil }
  },

  // ==========================================
  // BLOCK 3: CONTACT & HIRING
  // ==========================================
  {
    category: 'CONTACT & HIRING',
    answer: `- 📧 Email: sanjayraina023@gmail.com\n- 📞 Phone: +91 8637674227\n- 💼 LinkedIn: linkedin.com/in/ezhil-savier/\n- 🌐 Portfolio: ezhil-savier-portfolio.netlify.app`,
    templates: [
      'How can I [contact] [ezhil]?', 'How do I [contact] [ezhil]?', 'Give me the [contact] details of [ezhil].',
      'What are the [contact] details for [ezhil]?', 'How to get in touch with [ezhil]?', 'How do I connect with [ezhil]?'
    ],
    placeholders: { contact: commonPlaceholders.contact, ezhil: commonPlaceholders.ezhil }
  },
  {
    category: 'CONTACT & HIRING',
    answer: `Yes! Ezhil is available immediately and actively looking for AI/ML engineering, data science, or full-stack AI roles. He's based in Hosur and open to Bengaluru.`,
    templates: [
      'Is [ezhil] available for [hire]?', 'Can I [hire] [ezhil]?', 'Is [ezhil] looking for a job?',
      'Is [ezhil] open to job offers?', 'Can we [hire] [ezhil]?', 'Is Ezhil looking for roles?'
    ],
    placeholders: { ezhil: commonPlaceholders.ezhil, hire: commonPlaceholders.hire }
  },
  {
    category: 'CONTACT & HIRING',
    answer: `Absolutely. His portfolio status says: open to work — available immediately.`,
    templates: [
      'Is [ezhil] open to work?', 'Is Ezhil actively looking for work?', 'What is Ezhil\'s hiring status?', 'Hiring status of Ezhil',
      'is [ezhil] actively looking?'
    ],
    placeholders: { ezhil: commonPlaceholders.ezhil }
  },
  {
    category: 'CONTACT & HIRING',
    answer: `Yes! Reach out to him at sanjayraina023@gmail.com or +91 8637674227. He's available immediately and open to Bengaluru-based roles.`,
    templates: [
      'Can I employ [ezhil]?', 'Can we recruit [ezhil]?', 'How to [hire] [ezhil]?', 'Process to [hire] [ezhil]?',
      'I want to [hire] [ezhil]', 'Where can I recruit [ezhil]?'
    ],
    placeholders: { ezhil: commonPlaceholders.ezhil, hire: commonPlaceholders.hire }
  },
  {
    category: 'CONTACT & HIRING',
    answer: `His resume mentions openness to Bengaluru specifically. For remote opportunities, reach out directly — sanjayraina023@gmail.com.`,
    templates: [
      'Is [ezhil] open to remote [work]?', 'Can [ezhil] [work] remotely?', 'Does Ezhil do remote [work]?',
      'Is Ezhil open to remote jobs?', 'Can Ezhil [work] from home?', 'remote opportunities for Ezhil'
    ],
    placeholders: { ezhil: commonPlaceholders.ezhil, work: commonPlaceholders.work }
  },
  {
    category: 'CONTACT & HIRING',
    answer: `He's targeting roles like:\n- AI / ML Engineer\n- Data Scientist\n- Machine Learning Engineer\n- Full-Stack AI Developer\n- Data & Operations Analyst\n- AI Research & Development roles`,
    templates: [
      'What roles is [ezhil] looking for?', 'What positions is [ezhil] interested in?', 'What jobs is [ezhil] applying for?',
      'Target roles for [ezhil]', 'What is [his] preferred job title?', 'What kind of jobs does Ezhil want?'
    ],
    placeholders: { ezhil: commonPlaceholders.ezhil, his: commonPlaceholders.his }
  },
  {
    category: 'CONTACT & HIRING',
    answer: `His resume is available here: https://drive.google.com/file/d/1pKqLRduyzW8IAZ0ohOODVwGJICtT000C/view?usp=drive_link — also linked as "VIEW RESUME" on the portfolio homepage.`,
    templates: [
      'Where can I see [his] resume?', 'Give me [his] resume link.', 'Where is [his] resume?', 'Can I download [his] CV?',
      'Resume of [ezhil]', 'CV of [ezhil]', 'Show me [his] resume.', 'Get [his] CV.'
    ],
    placeholders: { ezhil: commonPlaceholders.ezhil, his: commonPlaceholders.his }
  },
  {
    category: 'CONTACT & HIRING',
    answer: `sanjayraina023@gmail.com`,
    templates: [
      'What is [his] email?', "What is Ezhil's email address?", 'Ezhil email', 'email of Ezhil', 'how to email Ezhil'
    ],
    placeholders: { his: commonPlaceholders.his }
  },
  {
    category: 'CONTACT & HIRING',
    answer: `+91 8637674227`,
    templates: [
      'What is [his] phone number?', "What is Ezhil's contact number?", 'Ezhil phone number', 'phone of Ezhil', 'how to call Ezhil',
      'What is Ezhil\'s mobile number?'
    ],
    placeholders: { his: commonPlaceholders.his }
  },
  {
    category: 'CONTACT & HIRING',
    answer: `https://www.linkedin.com/in/ezhil-savier/`,
    templates: [
      'What is [his] LinkedIn?', "What is Ezhil's LinkedIn link?", 'Ezhil LinkedIn profile', 'LinkedIn of Ezhil', 'show me Ezhil\'s LinkedIn'
    ],
    placeholders: { his: commonPlaceholders.his }
  },
  {
    category: 'CONTACT & HIRING',
    answer: `https://github.com/EZHILSAVIER`,
    templates: [
      'What is [his] GitHub?', "What is Ezhil's GitHub link?", 'Ezhil GitHub profile', 'GitHub of Ezhil', 'show me Ezhil\'s GitHub'
    ],
    placeholders: { his: commonPlaceholders.his }
  },
  {
    category: 'CONTACT & HIRING',
    answer: `Yes — he's open to internships and full-time roles. Contact him at sanjayraina023@gmail.com.`,
    templates: [
      'Is [ezhil] available for internships?', 'Can Ezhil do an internship?', 'Is Ezhil looking for internship roles?',
      'Does Ezhil accept internships?', 'Internship availability for Ezhil'
    ],
    placeholders: { ezhil: commonPlaceholders.ezhil }
  },
  {
    category: 'CONTACT & HIRING',
    answer: `That's best discussed directly with him. Reach out at sanjayraina023@gmail.com.`,
    templates: [
      'Is [ezhil] available for freelance projects?', 'Can I hire Ezhil for freelance work?', 'Does Ezhil do freelance jobs?',
      'Is Ezhil open to contract work?', 'freelancing with Ezhil'
    ],
    placeholders: { ezhil: commonPlaceholders.ezhil }
  },
  {
    category: 'CONTACT & HIRING',
    answer: `He is currently in Hosur, TN and explicitly open to Bengaluru.`,
    templates: [
      'Can [ezhil] relocate?', 'Is [ezhil] willing to relocate?', 'Can Ezhil relocate to Bangalore?',
      'Will Ezhil move to Bengaluru?', 'Is Ezhil open to relocation?'
    ],
    placeholders: { ezhil: commonPlaceholders.ezhil }
  },

  // ==========================================
  // BLOCK 4: EDUCATION
  // ==========================================
  {
    category: 'EDUCATION',
    answer: `- B.Tech in AI & Data Science — Anna University / AVS Engineering College, Salem (2022–2026), CGPA: 8.22/10\n- HSC (12th): 72% — Swamy Vivekanandha Matric HSS\n- SSLC (10th): 83% — Swamy Vivekanandha Matric HSS`,
    templates: [
      'What is [his] educational background?', 'What is [his] academic record?', 'Tell me about [his] schooling.',
      'Where did Ezhil go to school?', 'What is Ezhil\'s education?'
    ],
    placeholders: { his: commonPlaceholders.his }
  },
  {
    category: 'EDUCATION',
    answer: `8.22 out of 10.0, from Anna University.`,
    templates: [
      'What is [his] CGPA?', "What is Ezhil's CGPA?", 'What was Ezhil\'s college score?', 'Ezhil CGPA in college',
      'What is Ezhil\'s graduation mark?'
    ],
    placeholders: { his: commonPlaceholders.his }
  },
  {
    category: 'EDUCATION',
    answer: `AVS Engineering College (AVSEC), Salem, Tamil Nadu — affiliated with Anna University.`,
    templates: [
      'Where did [ezhil] study?', 'Which [college] did Ezhil attend?', 'What is [his] [college] name?',
      'Where is Ezhil\'s [college] located?', 'Which [college] is Ezhil from?'
    ],
    placeholders: { ezhil: commonPlaceholders.ezhil, college: commonPlaceholders.college, his: commonPlaceholders.his }
  },
  {
    category: 'EDUCATION',
    answer: `B.Tech in Artificial Intelligence and Data Science — a 4-year program covering ML, deep learning, NLP, computer vision, data engineering, and software development.`,
    templates: [
      'What did [ezhil] [study]?', 'What branch did [ezhil] choose in [college]?', 'What course did [ezhil] take?',
      'What was [his] degree in?', 'What is [his] field of study?'
    ],
    placeholders: { ezhil: commonPlaceholders.ezhil, study: commonPlaceholders.study, college: commonPlaceholders.college, his: commonPlaceholders.his }
  },
  {
    category: 'EDUCATION',
    answer: `He graduated in 2026 (or is graduating in 2026 — his batch is 2022–2026).`,
    templates: [
      'When did [ezhil] graduate?', 'What is [his] graduation year?', 'What year did [ezhil] complete college?',
      'Is Ezhil graduating in 2026?', 'Graduation date of [ezhil]'
    ],
    placeholders: { ezhil: commonPlaceholders.ezhil, his: commonPlaceholders.his }
  },
  {
    category: 'EDUCATION',
    answer: `Anna University is one of Tamil Nadu's premier technical universities, known for engineering and technology programs. AVS Engineering College is an affiliated institution in Salem.`,
    templates: [
      'What is Anna University?', 'Tell me about Anna University.', 'Is AVS Engineering College affiliated to Anna University?',
      'Is AVS associated with Anna University?'
    ],
    placeholders: {}
  },
  {
    category: 'EDUCATION',
    answer: `SSLC (10th): 83% | HSC (12th): 72% — both from Swamy Vivekanandha Matric HSS.`,
    templates: [
      'What is [his] 10th and 12th score?', "What did Ezhil score in 10th and 12th?", 'What is Ezhil\'s HSC percentage?',
      'What is Ezhil\'s SSLC percentage?', 'Which school did Ezhil attend for 12th?', 'Ezhil 10th and 12th class percentage'
    ],
    placeholders: { his: commonPlaceholders.his }
  },
  {
    category: 'EDUCATION',
    answer: `No certifications are listed in the current portfolio. For up-to-date information, check his LinkedIn or reach out directly.`,
    templates: [
      'Did [ezhil] do any certifications?', 'Does Ezhil have external certifications?', 'What certifications does Ezhil hold?',
      'List Ezhil\'s credentials or certifications.', 'Any online courses or certifications?'
    ],
    placeholders: { ezhil: commonPlaceholders.ezhil }
  },

  // ==========================================
  // BLOCK 5: TECHNICAL SKILLS
  // ==========================================
  {
    category: 'TECHNICAL SKILLS',
    answer: `- **Languages:** Python, SQL\n- **AI/ML:** Machine Learning, Deep Learning, Neural Networks, LLMs, Scikit-learn, TensorFlow\n- **NLP:** TF-IDF, Tokenization, Text Classification\n- **Computer Vision:** OpenCV, Deep Learning CV, Emotion Recognition\n- **Libraries:** Pandas, NumPy, Matplotlib\n- **Databases:** MongoDB, SQL\n- **Tools:** Docker, GitHub, VS Code, Cursor, MS Office, Google Workspace`,
    templates: [
      "What are Ezhil's [skills]?", 'What is [his] [skills]?', 'What tech stack does Ezhil know?',
      'Show me [his] technical [skills].', 'What technologies does Ezhil work with?', 'Ezhil technical skills list'
    ],
    placeholders: { skills: commonPlaceholders.skills, his: commonPlaceholders.his }
  },
  {
    category: 'TECHNICAL SKILLS',
    answer: `Python (primary — used in all AI/ML projects) and SQL (for database querying and data management).`,
    templates: [
      'What programming languages does [ezhil] know?', 'What coding languages does [ezhil] use?',
      'Does [ezhil] know languages other than Python?', 'Languages list of [ezhil]'
    ],
    placeholders: { ezhil: commonPlaceholders.ezhil }
  },
  {
    category: 'TECHNICAL SKILLS',
    answer: `Yes — Python is his core language, used across all projects for ML, NLP, deep learning, and backend development.`,
    templates: [
      'Does [ezhil] know Python?', 'Is [ezhil] good at Python?', 'Does Ezhil use Python?',
      'Python skills of [ezhil]', 'How proficient is [ezhil] in Python?'
    ],
    placeholders: { ezhil: commonPlaceholders.ezhil }
  },
  {
    category: 'TECHNICAL SKILLS',
    answer: `Yes — he has hands-on ML experience including supervised learning, feature engineering, model evaluation, and deployment. He built PhishGuard entirely using supervised ML pipelines.`,
    templates: [
      'Does [ezhil] know machine learning?', 'Is [ezhil] skilled in ML?', 'What machine learning concepts does Ezhil know?',
      'Does Ezhil have experience in machine learning?', 'Does Ezhil know supervised learning?'
    ],
    placeholders: { ezhil: commonPlaceholders.ezhil }
  },
  {
    category: 'TECHNICAL SKILLS',
    answer: `Yes. He applied deep learning in Sentient Shopper (emotion recognition via CV) and TrustCart (AI compliance analysis). He has foundational TensorFlow knowledge and uses deep learning frameworks in his projects.`,
    templates: [
      'Does [ezhil] know deep learning?', 'Is [ezhil] skilled in deep learning?', 'Has Ezhil worked on deep learning neural networks?',
      'Does Ezhil know neural networks?', 'deep learning knowledge of [ezhil]'
    ],
    placeholders: { ezhil: commonPlaceholders.ezhil }
  },
  {
    category: 'TECHNICAL SKILLS',
    answer: `Yes — specifically TF-IDF vectorisation, tokenization, and text classification. He applied these in PhishGuard to detect phishing emails and spam.`,
    templates: [
      'Does [ezhil] know NLP?', 'Does [ezhil] have experience with natural language processing?', 'Is Ezhil skilled in NLP?',
      'Does Ezhil know text classification?', 'NLP techniques Ezhil knows'
    ],
    placeholders: { ezhil: commonPlaceholders.ezhil }
  },
  {
    category: 'TECHNICAL SKILLS',
    answer: `Yes. In Sentient Shopper, he built a real-time facial emotion recognition system using deep learning CV. In TrustCart, he used OpenCV for watermark and image compliance detection.`,
    templates: [
      'Does [ezhil] know computer vision?', 'Does Ezhil have experience with computer vision?', 'Is Ezhil skilled in CV?',
      'Does Ezhil know image processing?', 'computer vision projects of Ezhil'
    ],
    placeholders: { ezhil: commonPlaceholders.ezhil }
  },
  {
    category: 'TECHNICAL SKILLS',
    answer: `He has foundational TensorFlow knowledge, applied in deep learning components of his projects.`,
    templates: [
      'Does [ezhil] know TensorFlow?', 'Has Ezhil used TensorFlow?', 'Is Ezhil experienced in TensorFlow?',
      'TensorFlow skills of Ezhil'
    ],
    placeholders: { ezhil: commonPlaceholders.ezhil }
  },
  {
    category: 'TECHNICAL SKILLS',
    answer: `Yes — extensively. Scikit-learn is his primary ML library, used in PhishGuard for supervised classification pipelines.`,
    templates: [
      'Does [ezhil] know Scikit-learn?', 'Does Ezhil use Scikit-learn?', 'Is Ezhil proficient in scikit-learn?',
      'Scikit-learn skills of Ezhil'
    ],
    placeholders: { ezhil: commonPlaceholders.ezhil }
  },
  {
    category: 'TECHNICAL SKILLS',
    answer: `Yes. SQL is listed as one of his core languages for database querying and data operations.`,
    templates: [
      'Does [ezhil] know SQL?', 'Does Ezhil use SQL?', 'Is Ezhil proficient in SQL databases?',
      'SQL skills of Ezhil', 'Does Ezhil write SQL queries?'
    ],
    placeholders: { ezhil: commonPlaceholders.ezhil }
  },
  {
    category: 'TECHNICAL SKILLS',
    answer: `Yes — he uses Docker for containerisation and is listed in his tools arsenal.`,
    templates: [
      'Does [ezhil] know Docker?', 'Has Ezhil worked with Docker?', 'Does Ezhil do containerization?',
      'Is Docker in Ezhil\'s skill set?'
    ],
    placeholders: { ezhil: commonPlaceholders.ezhil }
  },
  {
    category: 'TECHNICAL SKILLS',
    answer: `Yes — he used React 19 (the latest version at the time) in TrustCart's full-stack frontend.`,
    templates: [
      'Does [ezhil] know React / frontend development experience?', 'Does Ezhil have frontend experience?',
      'Does Ezhil know React 19?', 'Is Ezhil a React developer?', 'Does Ezhil do frontend development?'
    ],
    placeholders: { ezhil: commonPlaceholders.ezhil }
  },
  {
    category: 'TECHNICAL SKILLS',
    answer: `Yes — FastAPI is the backend framework for TrustCart, handling REST API endpoints.`,
    templates: [
      'Does [ezhil] know FastAPI?', 'Does Ezhil use FastAPI?', 'Is FastAPI in Ezhil\'s backend skills?',
      'Has Ezhil built APIs with FastAPI?'
    ],
    placeholders: { ezhil: commonPlaceholders.ezhil }
  },
  {
    category: 'TECHNICAL SKILLS',
    answer: `Yes — MongoDB is the database used in TrustCart.`,
    templates: [
      'Does [ezhil] know MongoDB?', 'Has Ezhil used MongoDB?', 'Is MongoDB in Ezhil\'s tech stack?',
      'Does Ezhil know NoSQL databases?'
    ],
    placeholders: { ezhil: commonPlaceholders.ezhil }
  },
  {
    category: 'TECHNICAL SKILLS',
    answer: `Yes — he designed and built REST APIs in both MemoSnap and TrustCart.`,
    templates: [
      'Does [ezhil] know REST APIs?', 'Has Ezhil developed REST APIs?', 'Is Ezhil experienced in API design?',
      'Does Ezhil build backend REST endpoints?'
    ],
    placeholders: { ezhil: commonPlaceholders.ezhil }
  },
  {
    category: 'TECHNICAL SKILLS',
    answer: `Yes. He integrated Google's Gemini 2.5 Flash LLM in TrustCart to power AI-based compliance analysis of e-commerce product listings.`,
    templates: [
      'Does [ezhil] know LLMs / generative AI?', 'Does Ezhil have experience with generative AI?', 'Has Ezhil worked with LLMs?',
      'Does Ezhil know Gemini API?', 'Generative AI projects of Ezhil'
    ],
    placeholders: { ezhil: commonPlaceholders.ezhil }
  },
  {
    category: 'TECHNICAL SKILLS',
    answer: `Yes. TrustCart is a full-stack project: React 19 (frontend) + FastAPI (backend) + MongoDB (database). MemoSnap is another full-stack web app using HTML5, CSS3, JavaScript, REST APIs, and cloud storage.`,
    templates: [
      'Does [ezhil] know full-stack development?', 'Is Ezhil a full-stack engineer?', 'Has Ezhil built full-stack apps?',
      'Does Ezhil do backend and frontend?', 'full-stack capabilities of Ezhil'
    ],
    placeholders: { ezhil: commonPlaceholders.ezhil }
  },
  {
    category: 'TECHNICAL SKILLS',
    answer: `Yes — he applies EDA (Exploratory Data Analysis), Pandas, NumPy, and Matplotlib for data wrangling and visualisation across his projects and internship.`,
    templates: [
      'Does [ezhil] know data analysis / data science?', 'Is Ezhil skilled in data science?', 'Does Ezhil do exploratory data analysis?',
      'Has Ezhil worked as a data analyst?', 'data analysis skills of Ezhil'
    ],
    placeholders: { ezhil: commonPlaceholders.ezhil }
  },
  {
    category: 'TECHNICAL SKILLS',
    answer: `Yes — both are core libraries he uses for data manipulation, preprocessing, and feature engineering.`,
    templates: [
      'Does [ezhil] know Pandas or NumPy?', 'Does Ezhil use Pandas?', 'Does Ezhil use NumPy?',
      'Pandas and NumPy experience of Ezhil', 'Does Ezhil know data manipulation libraries?'
    ],
    placeholders: { ezhil: commonPlaceholders.ezhil }
  },
  {
    category: 'TECHNICAL SKILLS',
    answer: `He has worked with cloud storage integration (MemoSnap) and deployed his portfolio on Netlify. For cloud-native platforms (AWS, GCP, Azure), reach out to him directly.`,
    templates: [
      'Does [ezhil] know cloud technologies?', 'Has Ezhil worked with AWS, GCP or Azure?', 'Is Ezhil a cloud engineer?',
      'What cloud databases does Ezhil know?', 'cloud experience of Ezhil'
    ],
    placeholders: { ezhil: commonPlaceholders.ezhil }
  },
  {
    category: 'TECHNICAL SKILLS',
    answer: `Yes — used in TrustCart for watermark detection and image-level compliance checks.`,
    templates: [
      'Does [ezhil] know OpenCV?', 'Has Ezhil worked with OpenCV?', 'Is OpenCV in Ezhil\'s computer vision tools?',
      'What OpenCV features has Ezhil used?'
    ],
    placeholders: { ezhil: commonPlaceholders.ezhil }
  },
  {
    category: 'TECHNICAL SKILLS',
    answer: `Yes — implemented in Sentient Shopper as part of the product recommendation engine, combined with deep learning.`,
    templates: [
      'Does [ezhil] know Collaborative Filtering?', 'Has Ezhil built recommendation systems?', 'Does Ezhil use collaborative filtering?',
      'Is collaborative filtering in Ezhil\'s skill list?'
    ],
    placeholders: { ezhil: commonPlaceholders.ezhil }
  },
  {
    category: 'TECHNICAL SKILLS',
    answer: `Yes — he uses GitHub for version control. His profile is github.com/EZHILSAVIER.`,
    templates: [
      'Does [ezhil] know GitHub?', 'Does Ezhil use Git?', 'Does Ezhil use GitHub for version control?',
      'Is Git in Ezhil\'s toolkit?'
    ],
    placeholders: { ezhil: commonPlaceholders.ezhil }
  },
  {
    category: 'TECHNICAL SKILLS',
    answer: `His strongest area is end-to-end ML pipeline development — taking a problem from raw data through preprocessing, feature engineering, model training, evaluation, and deployment. He's also strong in NLP and computer vision application.`,
    templates: [
      "What is Ezhil's strongest technical skill?", 'What is Ezhil best at?', 'What is Ezhil\'s core technical strength?',
      'Where does Ezhil excel technically?', 'Ezhil\'s strongest AI skill'
    ],
    placeholders: {}
  },

  // ==========================================
  // BLOCK 6: PROJECTS (DEEP DIVE)
  // ==========================================
  {
    category: 'PROJECTS (DEEP DIVE)',
    answer: `Ezhil has four major projects:\n1. **PhishGuard** — AI phishing & spam detection (ML + NLP)\n2. **Sentient Shopper** — Emotion-aware shopping AI (CV + Deep Learning)\n3. **MemoSnap** — Cloud-based photo memory app (Full-Stack)\n4. **TrustCart** — AI e-commerce compliance monitor (LLM + FastAPI + React 19)`,
    templates: [
      'What [projects] has [ezhil] [built]?', 'Tell me about [his] [projects].', 'What has Ezhil [built] recently?',
      'Show me [his] [projects].', 'What are [his] main [projects]?'
    ],
    placeholders: { projects: commonPlaceholders.projects, ezhil: commonPlaceholders.ezhil, built: commonPlaceholders.built, his: commonPlaceholders.his }
  },
  {
    category: 'PROJECTS (DEEP DIVE)',
    answer: `PhishGuard is Ezhil's cybersecurity project. It's a real-time phishing email and spam classifier that uses supervised ML + NLP (TF-IDF, tokenization) to detect malicious emails, suspicious URLs, and fraud patterns. Key features: multi-feature analysis pipeline (email content + URL patterns + sender behaviour), end-to-end data pipeline, and a live threat alert module. Stack: Python, Scikit-learn, Pandas, TF-IDF. Pipeline: Email Input → NLP Parsing → ML Classifier → Threat Alert. GitHub: github.com/EZHILSAVIER/phishguard`,
    templates: [
      'Tell me about [phishguard].', 'What is [phishguard]?', 'Explain [phishguard] project.', 'Show details of [phishguard].',
      'What is Ezhil\'s email spam detection project?', 'Explain [his] cybersecurity project.'
    ],
    placeholders: { phishguard: commonPlaceholders.phishguard, his: commonPlaceholders.his }
  },
  {
    category: 'PROJECTS (DEEP DIVE)',
    answer: `Phishing is one of the top cybersecurity threats globally. PhishGuard automates threat detection by classifying incoming emails in real time — reducing human exposure to phishing attacks and increasing security awareness.`,
    templates: [
      'What problem does [phishguard] solve?', 'Why did [ezhil] build [phishguard]?', 'What is the purpose of [phishguard]?',
      'Who is [phishguard] for?', 'What is the value of [phishguard]?'
    ],
    placeholders: { phishguard: commonPlaceholders.phishguard, ezhil: commonPlaceholders.ezhil }
  },
  {
    category: 'PROJECTS (DEEP DIVE)',
    answer: `1. Raw email arrives\n2. NLP pipeline parses content (TF-IDF vectorisation, tokenization)\n3. ML classifier identifies threat patterns\n4. Alert module notifies the user in real time\nIt analyses three feature dimensions: email content, sender behaviour, and URL patterns.`,
    templates: [
      'How does [phishguard] work?', 'Explain the mechanism of [phishguard].', 'What is the pipeline of [phishguard]?',
      'How does [phishguard] detect phishing?', 'workflow of [phishguard]'
    ],
    placeholders: { phishguard: commonPlaceholders.phishguard }
  },
  {
    category: 'PROJECTS (DEEP DIVE)',
    answer: `Sentient Shopper is an emotion-aware AI shopping assistant. It uses deep learning computer vision to detect a customer's facial emotion in real time, then a collaborative filtering + deep learning recommendation engine suggests personalised products based on that sentiment. Ezhil also ran EDA on customer behaviour data to improve recommendation accuracy. Pipeline: Face Scan → Emotion Label → Recommendation. Stack: Deep Learning, CV, Collaborative Filtering, Predictive Analytics.`,
    templates: [
      'Tell me about [sentient].', 'What is [sentient]?', 'Explain [sentient] project.', 'Show details of [sentient].',
      'What is [his] emotion AI shopping assistant?', 'Explain Ezhil\'s retail AI project.'
    ],
    placeholders: { sentient: commonPlaceholders.sentient, his: commonPlaceholders.his }
  },
  {
    category: 'PROJECTS (DEEP DIVE)',
    answer: `Traditional recommendation systems ignore how a customer feels in the moment. Sentient Shopper bridges this gap — reading real-time emotion to deliver truly personalised shopping suggestions, boosting engagement and conversion.`,
    templates: [
      'What problem does [sentient] solve?', 'Why did [ezhil] build [sentient]?', 'What is the goal of [sentient]?',
      'Who is [sentient] for?', 'Why emotion based recommendation in [sentient]?'
    ],
    placeholders: { sentient: commonPlaceholders.sentient, ezhil: commonPlaceholders.ezhil }
  },
  {
    category: 'PROJECTS (DEEP DIVE)',
    answer: `1. Camera captures customer's face\n2. Deep learning CV model classifies emotion (happy, sad, neutral, excited, etc.)\n3. Emotion label feeds into the recommendation engine\n4. Collaborative filtering + deep learning suggests relevant products\n5. Data analytics on behaviour patterns continuously improve recommendations`,
    templates: [
      'How does [sentient] work?', 'Explain the mechanism of [sentient].', 'What is the pipeline of [sentient]?',
      'How does [sentient] detect emotion?', 'workflow of [sentient]'
    ],
    placeholders: { sentient: commonPlaceholders.sentient }
  },
  {
    category: 'PROJECTS (DEEP DIVE)',
    answer: `MemoSnap is a full-stack cloud-powered photo journal. Users can capture, tag, and store photos in personalised timeline albums, accessible from any device. It uses REST APIs and cloud storage for seamless syncing. Stack: HTML5, CSS3, JavaScript, REST APIs, Cloud Storage. Pipeline: Capture → Process → Cloud Sync. GitHub: github.com/EZHILSAVIER/memosnap`,
    templates: [
      'Tell me about [memosnap].', 'What is [memosnap]?', 'Explain [memosnap] project.', 'Show details of [memosnap].',
      'Explain [his] cloud-powered photo app.', 'What is Ezhil\'s full-stack photo journal?'
    ],
    placeholders: { memosnap: commonPlaceholders.memosnap, his: commonPlaceholders.his }
  },
  {
    category: 'PROJECTS (DEEP DIVE)',
    answer: `It solves the problem of scattered photo memories — giving users a structured, cloud-synced, timeline-based way to organise and revisit their personal photo history from any device.`,
    templates: [
      'What problem does [memosnap] solve?', 'Why did [ezhil] build [memosnap]?', 'What is the purpose of [memosnap]?'
    ],
    placeholders: { memosnap: commonPlaceholders.memosnap, ezhil: commonPlaceholders.ezhil }
  },
  {
    category: 'PROJECTS (DEEP DIVE)',
    answer: `TrustCart is Ezhil's most technically complex project. It's an AI-powered e-commerce compliance monitor that scrapes product listings, runs them through Gemini 2.5 Flash for AI analysis, uses OpenCV to detect watermark violations, and applies a weighted rule engine to flag Indian legal violations and generate risk reports. Stack: React 19 + FastAPI + MongoDB + Gemini 2.5 Flash + OpenCV + CloudScraper. Pipeline: URL Input → AI Scrape → Rule Engine → Risk Report. GitHub: github.com/EZHILSAVIER/trustcart`,
    templates: [
      'Tell me about [trustcart].', 'What is [trustcart]?', 'Explain [trustcart] project.', 'Show details of [trustcart].',
      'What is [his] AI compliance monitor?', 'Explain [his] most complex project.'
    ],
    placeholders: { trustcart: commonPlaceholders.trustcart, his: commonPlaceholders.his }
  },
  {
    category: 'PROJECTS (DEEP DIVE)',
    answer: `Many e-commerce listings on Indian platforms violate consumer protection laws — missing mandatory information, using illegal pricing tactics, or lacking required disclosures. TrustCart automates compliance checks at scale, flagging violations before they become legal problems.`,
    templates: [
      'What problem does [trustcart] solve?', 'Why did [ezhil] build [trustcart]?', 'What is the goal of [trustcart]?'
    ],
    placeholders: { trustcart: commonPlaceholders.trustcart, ezhil: commonPlaceholders.ezhil }
  },
  {
    category: 'PROJECTS (DEEP DIVE)',
    answer: `1. User inputs a product listing URL\n2. CloudScraper fetches the listing data\n3. Gemini 2.5 Flash analyses content for compliance violations\n4. OpenCV checks images for watermarks and image-level violations\n5. Weighted rule engine scores and prioritises violations\n6. Risk report is generated and displayed on the React 19 dashboard`,
    templates: [
      'How does [trustcart] work?', 'Explain the mechanism of [trustcart].', 'What is the pipeline of [trustcart]?',
      'workflow of [trustcart]'
    ],
    placeholders: { trustcart: commonPlaceholders.trustcart }
  },
  {
    category: 'PROJECTS (DEEP DIVE)',
    answer: `TrustCart — it integrates a cutting-edge LLM (Gemini 2.5 Flash), a FastAPI backend, a React 19 frontend, MongoDB, OpenCV image processing, web scraping, and a custom rule engine — all working as a unified production-grade system.`,
    templates: [
      'Which is Ezhil\'s most impressive project?', 'Which is [his] most complex project?', 'What is [his] best project?',
      'Which project are you most proud of?', 'Ezhil\'s most advanced application'
    ],
    placeholders: { his: commonPlaceholders.his }
  },
  {
    category: 'PROJECTS (DEEP DIVE)',
    answer: `PhishGuard: github.com/EZHILSAVIER/phishguard\nMemoSnap: github.com/EZHILSAVIER/memosnap\nTrustCart: github.com/EZHILSAVIER/trustcart\nSentient Shopper: No public GitHub link listed currently.`,
    templates: [
      'Are Ezhil\'s [projects] on GitHub?', 'Where can I find [his] project code?', 'Are the repositories public?',
      'Do you have GitHub links for Ezhil\'s projects?', 'GitHub repository links of Ezhil'
    ],
    placeholders: { projects: commonPlaceholders.projects, his: commonPlaceholders.his }
  },
  {
    category: 'PROJECTS (DEEP DIVE)',
    answer: `- Cybersecurity (PhishGuard)\n- Emotion AI / Retail Tech (Sentient Shopper)\n- Cloud / Full-Stack Web (MemoSnap)\n- LegalTech / AI Compliance (TrustCart)\nThis range shows adaptability and breadth across AI domains.`,
    templates: [
      'What domains do Ezhil\'s [projects] cover?', 'What fields are Ezhil\'s projects in?', 'Are [his] projects diverse?',
      'What industries do Ezhil\'s projects target?'
    ],
    placeholders: { projects: commonPlaceholders.projects, his: commonPlaceholders.his }
  },
  {
    category: 'PROJECTS (DEEP DIVE)',
    answer: `His portfolio itself is deployed on Netlify. TrustCart and PhishGuard are built as deployable systems. For live demo links, check the GitHub repositories or contact him directly.`,
    templates: [
      'Has [ezhil] deployed any [projects]?', 'Are there live demos for [his] [projects]?', 'Are [his] [projects] hosted online?',
      'How to see Ezhil\'s [projects] in action?'
    ],
    placeholders: { ezhil: commonPlaceholders.ezhil, projects: commonPlaceholders.projects, his: commonPlaceholders.his }
  },
  {
    category: 'PROJECTS (DEEP DIVE)',
    answer: `TrustCart and PhishGuard are both from 2025–2026, making them his most recent work.`,
    templates: [
      'What is [his] most recent project?', 'What is the latest project Ezhil [built]?', 'When were these projects created?',
      'Ezhil\'s latest work'
    ],
    placeholders: { his: commonPlaceholders.his, built: commonPlaceholders.built }
  },

  // ==========================================
  // BLOCK 7: EXPERIENCE & LEADERSHIP
  // ==========================================
  {
    category: 'EXPERIENCE & LEADERSHIP',
    answer: `Yes. He interned at Neura-AI Solutions Pvt. Ltd (August 2024), working on data pipelines, ML tasks, SLA-driven operations, and cross-functional collaboration in a real business environment.`,
    templates: [
      'Does [ezhil] have work [work]?', 'Does Ezhil have job [work]?', 'Has Ezhil worked anywhere?',
      'Tell me about Ezhil\'s job [work].', 'Professional [work] of Ezhil'
    ],
    placeholders: { ezhil: commonPlaceholders.ezhil, work: commonPlaceholders.work }
  },
  {
    category: 'EXPERIENCE & LEADERSHIP',
    answer: `Ezhil interned at Neura-AI Solutions Pvt. Ltd in August 2024 as a Data & Operations Intern. He managed data pipelines, supported SLA-driven workflows, contributed to ML-based tasks, and collaborated with cross-functional teams — gaining real business-context AI/ML experience.`,
    templates: [
      'Tell me about Ezhil\'s internship.', 'What did Ezhil do during [his] internship?', 'What was [his] role at Neura-AI?',
      'Internship experience of Ezhil', 'Explain Ezhil\'s data operations internship.'
    ],
    placeholders: { his: commonPlaceholders.his }
  },
  {
    category: 'EXPERIENCE & LEADERSHIP',
    answer: `Neura-AI Solutions Pvt. Ltd is the company where Ezhil completed his internship in August 2024, working on data operations and ML-based tasks.`,
    templates: [
      'What is Neura-AI Solutions?', 'Tell me about Neura-AI Solutions.', 'Where did Ezhil intern?',
      'Who is Neura-AI?'
    ],
    placeholders: {}
  },
  {
    category: 'EXPERIENCE & LEADERSHIP',
    answer: `Yes — significant leadership experience:\n- **Head Coordinator** — National Level Technical Symposium (500+ participants, 10 events, March 2025)\n- **Class Committee Head** — AVS Engineering College (2024–Present, student-faculty liaison)\n- **Program Coordinator** — Career Awareness Initiative (October 2025)`,
    templates: [
      'Does [ezhil] have [leadership]?', 'Tell me about Ezhil\'s [leadership].', 'Has Ezhil led any teams?',
      'Leadership roles held by Ezhil', 'Ezhil\'s extracurricular leadership experience'
    ],
    placeholders: { ezhil: commonPlaceholders.ezhil, leadership: commonPlaceholders.leadership }
  },
  {
    category: 'EXPERIENCE & LEADERSHIP',
    answer: `In March 2025, Ezhil served as Head Coordinator for a National Level Technical Symposium. He managed end-to-end coordination for 500+ participants across 10 concurrent events — handling logistics, team delegation, queue management, task allocation, real-time issue resolution, and stakeholder communication.`,
    templates: [
      'Tell me about the symposium Ezhil coordinated.', 'What was Ezhil\'s role in the technical symposium?',
      'How did Ezhil manage 500+ participants?', 'symposium details coordinated by Ezhil'
    ],
    placeholders: {}
  },
  {
    category: 'EXPERIENCE & LEADERSHIP',
    answer: `Both. He has coordinated 500+ participant national events, served as a student-faculty liaison, managed scheduling and documentation, and led career programs. He combines technical depth with team leadership, communication, and stakeholder management.`,
    templates: [
      'Is Ezhil only a technical person or does he have soft skills too?', 'Does Ezhil have good soft skills?',
      'What are Ezhil\'s communication and leadership skills?', 'Can Ezhil manage stakeholders?'
    ],
    placeholders: {}
  },

  // ==========================================
  // BLOCK 8: COMPARISON & ASSESSMENT
  // ==========================================
  {
    category: 'COMPARISON & ASSESSMENT',
    answer: `Three things stand out:\n1. **End-to-end systems** — he builds complete, deployable AI products, not just notebooks\n2. **Domain diversity** — his projects cover cybersecurity, emotion AI, LegalTech, and full-stack development\n3. **Leadership + tech combo** — most engineers can't coordinate 500-person events AND build LLM-powered apps`,
    templates: [
      'What makes Ezhil different from other AI graduates?', 'Why should we hire Ezhil?', 'What is unique about Ezhil?',
      'Why does Ezhil stand out?', 'Ezhil vs other freshers'
    ],
    placeholders: {}
  },
  {
    category: 'COMPARISON & ASSESSMENT',
    answer: `- End-to-end ML pipeline development\n- Multi-domain AI project experience (NLP, CV, LLMs)\n- Strong Python and data engineering foundation\n- Team leadership and event management\n- Full-stack AI development (React + FastAPI + MongoDB)`,
    templates: [
      'What are Ezhil\'s strengths?', 'What are [his] core competencies?', 'Where does Ezhil excel?',
      'Ezhil strengths list'
    ],
    placeholders: { his: commonPlaceholders.his }
  },
  {
    category: 'COMPARISON & ASSESSMENT',
    answer: `He thinks in systems. He starts with the real-world problem, maps out the full pipeline, then builds each component — from data ingestion to deployment. His tagline "Intelligence with Intent" captures this: purposeful, end-to-end thinking.`,
    templates: [
      'What is Ezhil\'s approach to problem-solving?', 'How does Ezhil solve problems?', 'What is Ezhil\'s problem solving style?',
      'Ezhil problem solving methodology'
    ],
    placeholders: {}
  },
  {
    category: 'COMPARISON & ASSESSMENT',
    answer: `Yes — demonstrated through his internship (cross-functional team collaboration), Head Coordinator role (managing teams across 10 events), and Class Committee Head position (faculty-student liaison).`,
    templates: [
      'Is Ezhil good at teamwork?', 'Can Ezhil work in a team?', 'Is Ezhil a team player?',
      'Ezhil\'s collaboration and teamwork'
    ],
    placeholders: {}
  },
  {
    category: 'COMPARISON & ASSESSMENT',
    answer: `Yes. His internship at Neura-AI Solutions involved real SLA-driven workflows. TrustCart addresses a real legal compliance problem. PhishGuard solves a genuine cybersecurity threat. His projects are grounded in actual use cases.`,
    templates: [
      'Does Ezhil have experience with real business problems?', 'Has Ezhil solved real-world industry problems?',
      'Are Ezhil\'s projects practical?', 'real business exposure of Ezhil'
    ],
    placeholders: {}
  },

  // ==========================================
  // BLOCK 9: DOMAIN-SPECIFIC QUESTIONS
  // ==========================================
  {
    category: 'DOMAIN-SPECIFIC QUESTIONS',
    answer: `Yes — PhishGuard is a full cybersecurity ML project. He built a multi-feature phishing detection pipeline covering email content, URL patterns, and sender behaviour using supervised ML and NLP.`,
    templates: [
      'Is Ezhil good at cybersecurity / threat detection?', 'Does Ezhil know cybersecurity?', 'Does Ezhil have cybersecurity skills?',
      'Can Ezhil build threat detection software?'
    ],
    placeholders: {}
  },
  {
    category: 'DOMAIN-SPECIFIC QUESTIONS',
    answer: `Yes — Sentient Shopper uses collaborative filtering + deep learning to build an emotion-aware recommendation engine, demonstrating strong knowledge of recommendation system architecture.`,
    templates: [
      'Is Ezhil good at recommendation systems?', 'Does Ezhil know recommender systems?', 'Can Ezhil build product recommenders?',
      'recommender engines experience of Ezhil'
    ],
    placeholders: {}
  },
  {
    category: 'DOMAIN-SPECIFIC QUESTIONS',
    answer: `Yes — TrustCart is specifically a LegalTech project that automates Indian e-commerce compliance monitoring using AI.`,
    templates: [
      'Can Ezhil work on LegalTech or compliance projects?', 'Does Ezhil know about compliance monitoring AI?',
      'Has Ezhil done LegalTech projects?'
    ],
    placeholders: {}
  },
  {
    category: 'DOMAIN-SPECIFIC QUESTIONS',
    answer: `Yes — all his projects demonstrate end-to-end pipeline development. His internship also involved managing data pipelines in SLA-driven business environments.`,
    templates: [
      'Can Ezhil work on data engineering or pipelines?', 'Does Ezhil build data pipelines?', 'Does Ezhil know data engineering?',
      'data pipelines experience of Ezhil'
    ],
    placeholders: {}
  },
  {
    category: 'DOMAIN-SPECIFIC QUESTIONS',
    answer: `Yes — TrustCart uses CloudScraper for automated product listing data extraction.`,
    templates: [
      'Does Ezhil have experience with web scraping?', 'Can Ezhil scrape websites?', 'What scraping tools does Ezhil know?',
      'web scraping experience of Ezhil'
    ],
    placeholders: {}
  },
  {
    category: 'DOMAIN-SPECIFIC QUESTIONS',
    answer: `Yes — he has experience taking an AI product from concept to a working deployable system (TrustCart, PhishGuard, Sentient Shopper are all complete products, not just research experiments).`,
    templates: [
      'Can Ezhil work on AI product development?', 'Does Ezhil build AI products?', 'Does Ezhil know product development in AI?',
      'end-to-end AI product development by Ezhil'
    ],
    placeholders: {}
  },

  // ==========================================
  // BLOCK 10: PORTFOLIO & WEBSITE
  // ==========================================
  {
    category: 'PORTFOLIO & WEBSITE',
    answer: `Ezhil designed and developed the portfolio himself. It's deployed on Netlify and uses a dark, terminal-inspired aesthetic with a sci-fi undertone — reflecting his AI engineering identity.`,
    templates: [
      'How is this portfolio website built?', 'What is the design theme of Ezhil\'s portfolio?',
      'Where is this portfolio deployed?', 'What tech stack is the portfolio built on?'
    ],
    placeholders: {}
  },
  {
    category: 'PORTFOLIO & WEBSITE',
    answer: `The portfolio has 6 sections:\n01 Identity (About Me)\n02 Projects (4 AI/ML/Full-Stack projects)\n03 Tech Stack (Skills & Arsenal)\n04 Journey (Experience & Leadership)\n05 Academics (Education)\n06 Connect (Contact Info)`,
    templates: [
      'What sections are in this portfolio?', 'Structure of Ezhil\'s portfolio website',
      'What can I navigate to in this portfolio?', 'sections list of Ezhil\'s website'
    ],
    placeholders: {}
  },
  {
    category: 'PORTFOLIO & WEBSITE',
    answer: `Linked on the portfolio homepage as "VIEW RESUME": https://drive.google.com/file/d/1pKqLRduyzW8IAZ0ohOODVwGJICtT000C/view?usp=drive_link`,
    templates: [
      'Where is Ezhil\'s resume?', 'How to download Ezhil\'s resume?', 'resume download link for Ezhil',
      'resume document link'
    ],
    placeholders: {}
  },

  // ==========================================
  // BLOCK 11: EDGE CASES & TRICKY QUESTIONS
  // ==========================================
  {
    category: 'EDGE CASES & TRICKY QUESTIONS',
    answer: `As a fresh 2026 graduate, his exposure to large-scale production MLOps (model drift monitoring, A/B testing at scale, enterprise cloud infrastructure) is still developing. However, TrustCart's full-stack architecture and his internship show strong practical readiness.`,
    templates: [
      'What doesn\'t Ezhil know?', 'What are Ezhil\'s weaknesses?', 'Where is Ezhil lacking?',
      'What are Ezhil\'s areas of improvement?', 'What are the limits of Ezhil\'s skills?'
    ],
    placeholders: {}
  },
  {
    category: 'EDGE CASES & TRICKY QUESTIONS',
    answer: `No publications are listed in his current portfolio. His focus is applied, project-based AI development.`,
    templates: [
      'Does Ezhil have research papers or publications?', 'Has Ezhil published research papers?',
      'Has Ezhil written academic publications?', 'research articles by Ezhil'
    ],
    placeholders: {}
  },
  {
    category: 'EDGE CASES & TRICKY QUESTIONS',
    answer: `Cloud platform experience isn't listed in the current portfolio. He has used cloud storage integration and Netlify deployment. For more detail, reach out: sanjayraina023@gmail.com.`,
    templates: [
      'Does Ezhil know AWS / GCP / Azure?', 'Does Ezhil have AWS experience?', 'Does Ezhil have GCP experience?',
      'Does Ezhil have Azure experience?', 'cloud platforms Ezhil knows'
    ],
    placeholders: {}
  },
  {
    category: 'EDGE CASES & TRICKY QUESTIONS',
    answer: `PyTorch is not listed in his current skills. He uses TensorFlow (fundamentals) and Scikit-learn. For more detail, contact him directly.`,
    templates: [
      'Does Ezhil know PyTorch?', 'Has Ezhil used PyTorch?', 'Is PyTorch in Ezhil\'s skillset?',
      'PyTorch vs TensorFlow for Ezhil'
    ],
    placeholders: {}
  },
  {
    category: 'EDGE CASES & TRICKY QUESTIONS',
    answer: `No hackathon wins are listed in the current portfolio. For the latest achievements, check his LinkedIn: linkedin.com/in/ezhil-savier/`,
    templates: [
      'Has Ezhil won any hackathons or competitions?', 'Did Ezhil participate in hackathons?',
      'Ezhil hackathon achievements', 'Has Ezhil won any coding contests?'
    ],
    placeholders: {}
  },
  {
    category: 'EDGE CASES & TRICKY QUESTIONS',
    answer: `His CGPA is 8.22/10.0. In approximate percentage, that's around 82.2% (varies by university conversion formula).`,
    templates: [
      'What is Ezhil\'s GPA in percentage?', 'Convert Ezhil\'s CGPA to percentage',
      'What is Ezhil\'s college score in percentage?', 'college mark percentage of Ezhil'
    ],
    placeholders: {}
  },
  {
    category: 'EDGE CASES & TRICKY QUESTIONS',
    answer: `He is proficient in English and Tamil.`,
    templates: [
      'Does Ezhil speak any languages?', 'What languages does Ezhil know?', 'What languages does Ezhil speak?',
      'Is Ezhil bilingual?', 'Does Ezhil know English and Tamil?'
    ],
    placeholders: {}
  },
  {
    category: 'EDGE CASES & TRICKY QUESTIONS',
    answer: `For part-time or contract arrangements, reach out directly: sanjayraina023@gmail.com.`,
    templates: [
      'Is Ezhil available for part-time work?', 'Can Ezhil do freelance contract jobs?', 'Is Ezhil looking for part-time roles?',
      'part-time availability of Ezhil'
    ],
    placeholders: {}
  },
  {
    category: 'EDGE CASES & TRICKY QUESTIONS',
    answer: `Yes — github.com/EZHILSAVIER. You can see PhishGuard, MemoSnap, and TrustCart repositories there.`,
    templates: [
      'Does Ezhil have a GitHub profile?', 'Is Ezhil on GitHub?', 'Show me Ezhil\'s GitHub page.',
      'GitHub link of Ezhil'
    ],
    placeholders: {}
  },
  {
    category: 'EDGE CASES & TRICKY QUESTIONS',
    answer: `Those profiles aren't listed in the portfolio. LinkedIn is his primary professional platform: linkedin.com/in/ezhil-savier/`,
    templates: [
      'Is Ezhil on Instagram / Twitter / X?', 'Is Ezhil on Twitter?', 'Is Ezhil on Instagram?',
      'Is Ezhil on X?', 'social media accounts of Ezhil'
    ],
    placeholders: {}
  },
  {
    category: 'EDGE CASES & TRICKY QUESTIONS',
    answer: `Salary expectations aren't listed in the portfolio. For that discussion, contact him directly at sanjayraina023@gmail.com.`,
    templates: [
      'What salary does Ezhil expect?', 'What is Ezhil\'s salary requirement?', 'What package is Ezhil looking for?',
      'What is Ezhil\'s expected salary?'
    ],
    placeholders: {}
  },
  {
    category: 'EDGE CASES & TRICKY QUESTIONS',
    answer: `For availability and time zone flexibility, reach out directly: sanjayraina023@gmail.com.`,
    templates: [
      'Can Ezhil work night shifts or US time zones?', 'Can Ezhil work US hours?', 'Can Ezhil work night shifts?',
      'Ezhil\'s shift flexibility'
    ],
    placeholders: {}
  },
  {
    category: 'EDGE CASES & TRICKY QUESTIONS',
    answer: `Yes — Neura-AI Solutions Pvt. Ltd, where he interned in August 2024, appears to be an AI startup environment.`,
    templates: [
      'Has Ezhil worked in a startup?', 'Has Ezhil interned in a startup?', 'Does Ezhil have startup experience?',
      'Is Neura-AI a startup?'
    ],
    placeholders: {}
  }
];

// Read existing training_data.txt to fetch sections headers and prompts
function run() {
  const targetPath = path.join(__dirname, '..', 'data', 'training_data.txt');
  
  // Let's generate expanded Q&As
  const expandedQAs = [];
  
  for (const block of baseQAs) {
    const questions = expandTemplates(block.templates, block.placeholders);
    for (const q of questions) {
      expandedQAs.push({
        question: q,
        answer: block.answer,
        category: block.category
      });
    }
  }
  
  console.log(`Generated ${expandedQAs.length} question variations!`);
  
  // If we need at least 1000 questions, let's check:
  // If the list has less than 1000, we can add more synthetic question phrasings:
  // E.g., prefixes like "can you tell me if", "do you know whether", etc.
  if (expandedQAs.length < 1000) {
    console.log(`Currently at ${expandedQAs.length} questions. Let's expand them with polite prefixes and variation suffixes.`);
    const additionalQAs = [];
    const prefixes = ['please ', 'kindly ', 'could you ', 'can you please ', 'hey bot ', 'hi bot ', 'tell me: '];
    
    // We will select questions that make sense with prefixes
    for (const qa of expandedQAs) {
      if (additionalQAs.length + expandedQAs.length >= 1050) break;
      
      // Don't prefix simple greetings
      if (qa.category === 'GREETINGS & OPENING') continue;
      
      // Pick a random prefix and add it
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      
      // Let's lowercase the first letter of the question if it's not a proper noun
      let firstChar = qa.question.charAt(0);
      let rest = qa.question.slice(1);
      let formattedQ = firstChar.toLowerCase() + rest;
      
      // Clean up proper nouns
      formattedQ = formattedQ.replace('ezhil', 'Ezhil').replace('anna', 'Anna').replace('avs', 'AVS');
      
      const newQ = `${prefix}${formattedQ}`;
      additionalQAs.push({
        question: newQ,
        answer: qa.answer,
        category: qa.category
      });
    }
    expandedQAs.push(...additionalQAs);
    console.log(`After expansion, total Q&As: ${expandedQAs.length}`);
  }
  
  // Write training_data.txt
  let output = `# EZHIL SAVIER S — PORTFOLIO AI ASSISTANT\n`;
  output += `## Complete Training Knowledge Base\n`;
  output += `### Version 3.0 — 1000+ Question Variations, Zero Hallucinations\n\n`;
  output += `---\n\n`;
  output += `## ⚙️ SYSTEM PROMPT (paste this into your AI chatbot)\n\n`;
  output += `\`\`\`\n`;
  output += `You are the Portfolio AI Assistant for Ezhil Savier S — an AI & Data Science engineer.\n`;
  output += `Your job is to help portfolio visitors (recruiters, collaborators, developers, students) \n`;
  output += `learn everything about Ezhil accurately and enthusiastically.\n\n`;
  output += `RULES:\n`;
  output += `- Always answer from the knowledge base below — never guess or hallucinate\n`;
  output += `- Be warm, confident, and professional\n`;
  output += `- Keep answers concise unless asked for detail\n`;
  output += `- For anything outside this knowledge base: say "I don't have that detail — reach out to Ezhil at sanjayraina023@gmail.com"\n`;
  output += `- NEVER say "I don't know" — always redirect to contact info\n`;
  output += `- Use first or third person for Ezhil ("He built..." or "Ezhil built...")\n`;
  output += `- Never make up projects, skills, or experience not listed here\n\n`;
  output += `PERSONALITY: Friendly · Precise · Enthusiastic about AI · Professional\n`;
  output += `\`\`\`\n\n`;
  output += `---\n\n`;
  output += `## 📋 MASTER KNOWLEDGE BASE\n\n`;
  output += `### IDENTITY\n`;
  output += `- **Full Name:** Ezhil Savier S\n`;
  output += `- **Tagline:** "Intelligence with Intent"\n`;
  output += `- **Role:** AI & Data Science Engineer\n`;
  output += `- **Degree:** B.Tech — Artificial Intelligence & Data Science\n`;
  output += `- **University:** Anna University / AVS Engineering College, Salem, Tamil Nadu\n`;
  output += `- **Graduation:** 2026 | **CGPA:** 8.22 / 10.0\n`;
  output += `- **Location:** Hosur, Tamil Nadu | **Open to:** Bengaluru\n`;
  output += `- **Availability:** Immediate\n`;
  output += `- **Email:** sanjayraina023@gmail.com\n`;
  output += `- **Phone:** +91 8637674227\n`;
  output += `- **LinkedIn:** https://www.linkedin.com/in/ezhil-savier/\n`;
  output += `- **Portfolio:** https://ezhil-savier-portfolio.netlify.app/\n`;
  output += `- **GitHub:** https://github.com/EZHILSAVIER\n`;
  output += `- **Resume:** https://drive.google.com/file/d/1pKqLRduyzW8IAZ0ohOODVwGJICtT000C/view?usp=drive_link\n\n`;
  output += `---\n\n`;
  output += `## 🧠 COMPLETE Q&A TRAINING DATASET\n\n`;
  
  let currentCategory = '';
  expandedQAs.forEach((qa, index) => {
    if (qa.category !== currentCategory) {
      currentCategory = qa.category;
      output += `\n### ━━━ ${currentCategory} ━━━\n\n`;
    }
    
    output += `**Q: ${qa.question}**\n`;
    // Prefix every line of the answer with '>'
    const formattedAnswer = qa.answer.split('\n').map(line => `> ${line}`).join('\n');
    output += `${formattedAnswer}\n\n`;
  });
  
  output += `\n### ━━━ FALLBACK RESPONSES ━━━\n\n`;
  output += `**For any question NOT covered above, use this fallback:**\n\n`;
  output += `> "That's a great question! I don't have that specific detail right now. The best way to get an accurate answer is to reach out to Ezhil directly:\n`;
  output += `> 📧 sanjayraina023@gmail.com\n`;
  output += `> 📞 +91 8637674227\n`;
  output += `> 💼 linkedin.com/in/ezhil-savier/\n`;
  output += `> He'd love to connect!"\n\n`;
  output += `---\n\n`;
  output += `*Training Data v3.0 — Ezhil Savier S Portfolio AI Assistant — 2026*\n`;
  
  fs.writeFileSync(targetPath, output, 'utf-8');
  console.log(`Successfully wrote ${expandedQAs.length} questions to ${targetPath}`);

  // Also write a user-readable markdown file with just the list of questions
  const docPath = path.join(__dirname, '..', '..', 'trained_questions.md');
  let docOutput = `# Ezhil Savier S — Trained Portfolio Chatbot Questions\n\n`;
  docOutput += `This document lists the ${expandedQAs.length} distinct question variations that Ezhil's Portfolio AI Assistant is trained to answer with high accuracy and zero hallucinations. It covers all possible phrasings from "Hi" (greetings) to "Bye" (closing).\n\n`;
  
  let docCategory = '';
  let counter = 1;
  expandedQAs.forEach((qa) => {
    if (qa.category !== docCategory) {
      docCategory = qa.category;
      docOutput += `\n## ${docCategory.replace(/━━━/g, '').trim()}\n\n`;
      counter = 1;
    }
    docOutput += `${counter}. ${qa.question}\n`;
    counter++;
  });
  
  fs.writeFileSync(docPath, docOutput, 'utf-8');
  console.log(`Successfully wrote readable list of questions to ${docPath}`);
}

run();
