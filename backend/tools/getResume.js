/**
 * Tool: getResume
 * Returns full resume/education data.
 */

function getResume() {
  return {
    name: 'Ezhil Savier S',
    title: 'AI & Data Science Engineer',
    tagline: 'Intelligence with Intent',
    contact: {
      email: 'sanjayraina023@gmail.com',
      phone: '+91 8637674227',
      linkedin: 'https://www.linkedin.com/in/ezhil-savier/',
      location: 'Hosur, Tamil Nadu, India',
      relocate: 'Open to Bengaluru',
    },
    availability: 'Available Immediately',
    education: [
      {
        degree: 'B.Tech — Artificial Intelligence & Data Science',
        institution: 'Anna University / AVS Engineering College, Salem',
        duration: '2022 – 2026',
        score: 'CGPA: 8.22 / 10',
      },
      {
        degree: 'HSC (12th Standard)',
        institution: 'Swamy Vivekanandha Matric HSS',
        score: '72%',
      },
      {
        degree: 'SSLC (10th Standard)',
        institution: 'Swamy Vivekanandha Matric HSS',
        score: '83%',
      },
    ],
    summary: 'AI & Data Science engineer who builds intelligent systems that solve real-world problems — from catching phishing emails to reading human emotions in real time. Combines technical depth in ML, NLP, and CV with strong leadership experience. Thinks in systems — whether it\'s a neural network or a team workflow.',
    openTo: ['Full-time roles', 'Internships', 'Freelance projects'],
    domains: ['AI/ML', 'Data Science', 'Full-Stack Development'],
  };
}

/**
 * Format resume into a readable string.
 */
function formatResume() {
  const r = getResume();

  let output = `**${r.name}** — ${r.title}\n`;
  output += `*"${r.tagline}"*\n\n`;
  output += `**Summary:** ${r.summary}\n\n`;
  output += '**Education:**\n';
  for (const edu of r.education) {
    output += `- ${edu.degree} — ${edu.institution} (${edu.duration || ''}) — ${edu.score}\n`;
  }
  output += `\n**Contact:** ${r.contact.email} | ${r.contact.phone}\n`;
  output += `**LinkedIn:** ${r.contact.linkedin}\n`;
  output += `**Location:** ${r.contact.location} (${r.contact.relocate})\n`;
  output += `**Availability:** ${r.availability}\n`;
  output += `**Open to:** ${r.openTo.join(', ')}`;

  return output;
}

module.exports = { getResume, formatResume };
