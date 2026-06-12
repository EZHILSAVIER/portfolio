/**
 * Tool: getExperience
 * Returns work experience and leadership roles data.
 */

function getExperience() {
  return {
    internship: {
      title: '5.1 Intern — Neura-AI Solutions Pvt. Ltd (August 2024)',
      bulletPoints: [
        'Processed, organised, and documented project data within SLA-driven workflows',
        'Collaborated cross-functionally to ensure data quality, compliance, and operational efficiency',
        'Contributed to ML-based tasks and improved data handling workflows',
        'Hands-on exposure to data preprocessing and quality assurance in a business context'
      ]
    },
    leadership: [
      {
        title: '5.2 Head Coordinator — National Level Technical Symposium (March 2025)',
        bulletPoints: [
          'Managed end-to-end coordination for 500+ participants across 10 concurrent events',
          'Handled queue management, task allocation, and real-time issue resolution',
          'Demonstrated large-scale event and people management skills'
        ]
      },
      {
        title: '5.3 Class Committee Head — AVS Engineering College (2024 – Present)',
        bulletPoints: [
          'Liaised between faculty and students',
          'Managed scheduling, MoM (Minutes of Meeting) documentation, and monitored task completion',
          'Reflects structured workflow and stakeholder management'
        ]
      },
      {
        title: '5.4 Program Coordinator — Career Awareness Initiative (October 2025)',
        bulletPoints: [
          'Organised and led a career awareness program connecting students with industry professionals',
          'Focused on emerging tech career paths'
        ]
      }
    ]
  };
}

function formatInternship() {
  const exp = getExperience();
  let output = '### INTERNSHIP EXPERIENCE\n\n';
  output += `#### ${exp.internship.title}\n`;
  for (const bp of exp.internship.bulletPoints) {
    output += `* ${bp}\n`;
  }
  return output;
}

function formatExperience() {
  const exp = getExperience();
  let output = '### EXPERIENCE & LEADERSHIP\n\n';
  
  output += `#### ${exp.internship.title}\n`;
  for (const bp of exp.internship.bulletPoints) {
    output += `* ${bp}\n`;
  }
  output += '\n';

  for (const lead of exp.leadership) {
    output += `#### ${lead.title}\n`;
    for (const bp of lead.bulletPoints) {
      output += `* ${bp}\n`;
    }
    output += '\n';
  }

  return output.trim();
}

module.exports = { getExperience, formatExperience, formatInternship };
