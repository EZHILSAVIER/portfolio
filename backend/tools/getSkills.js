/**
 * Tool: getSkills
 * Returns categorized skills data for the AI assistant.
 */

function getSkills(category = null) {
  const skills = {
    'Languages': ['Python', 'SQL'],
    'AI / ML': ['Machine Learning', 'Deep Learning', 'Neural Networks', 'LLMs'],
    'NLP': ['TF-IDF', 'Tokenization', 'Text Classification'],
    'ML Libraries': ['Scikit-learn', 'Pandas', 'NumPy', 'Matplotlib', 'TensorFlow (Fundamentals)'],
    'Computer Vision': ['OpenCV', 'Deep Learning-based CV'],
    'APIs & Backend': ['REST APIs', 'FastAPI'],
  };

  if (category) {
    const catLower = category.toLowerCase();
    const filtered = {};
    for (const [cat, items] of Object.entries(skills)) {
      if (cat.toLowerCase().includes(catLower)) {
        filtered[cat] = items;
      }
    }
    return Object.keys(filtered).length > 0 ? filtered : skills;
  }

  return skills;
}

/**
 * Format skills into a readable string for the AI prompt.
 */
function formatSkills(category = null) {
  const skills = getSkills(category);
  let output = '### TECHNICAL SKILLS\n\n';
  for (const [cat, items] of Object.entries(skills)) {
    output += `* **${cat}:** ${items.join(', ')}\n`;
  }
  return output;
}

module.exports = { getSkills, formatSkills };
