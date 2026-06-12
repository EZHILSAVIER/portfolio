/**
 * Tool: getGithubLinks
 * Returns GitHub repository URLs for all projects.
 */

function getGithubLinks() {
  return {
    profile: 'https://github.com/EZHILSAVIER',
    repositories: [
      {
        name: 'PhishGuard',
        url: 'https://github.com/EZHILSAVIER/phishguard',
        description: 'AI-powered email phishing detection',
      },
      {
        name: 'MemoSnap',
        url: 'https://github.com/EZHILSAVIER/memosnap',
        description: 'Cloud-powered photo journal platform',
      },
      {
        name: 'TrustCart',
        url: 'https://github.com/EZHILSAVIER/trustcart',
        description: 'AI-powered e-commerce compliance monitor',
      },
    ],
  };
}

/**
 * Format GitHub links into a readable string.
 */
function formatGithubLinks() {
  const links = getGithubLinks();

  let output = `**GitHub Profile:** ${links.profile}\n\n**Repositories:**\n`;
  for (const repo of links.repositories) {
    output += `- **${repo.name}:** ${repo.url} — ${repo.description}\n`;
  }

  return output;
}

module.exports = { getGithubLinks, formatGithubLinks };
