/**
 * Tool Registry & Router
 * Maps detected intents to tool functions and formats results for context injection.
 */

const { formatProjects } = require('./getProjects');
const { formatSkills } = require('./getSkills');
const { formatExperience } = require('./getExperience');
const { formatResume } = require('./getResume');
const { formatGithubLinks } = require('./getGithubLinks');

// Map intents to tool execution functions
const TOOL_MAP = {
  projects: () => formatProjects(),
  skills: () => formatSkills(),
  experience: () => formatExperience(),
  resume: () => formatResume(),
  contact: () => formatResume(), // Contact info is in the resume
  recommendation: () => {
    // For recommendations, combine projects + skills summary
    return `${formatProjects()}\n\n---\n\n${formatSkills()}\n\n---\n\n${formatExperience()}`;
  },
  github: () => formatGithubLinks(),
};

/**
 * Execute tools based on detected intent.
 * @param {string} intent - The detected user intent
 * @returns {string} - Formatted tool results for prompt injection
 */
function executeTools(intent) {
  const toolFn = TOOL_MAP[intent];

  if (!toolFn) {
    return ''; // No specific tool for "general" intent
  }

  try {
    const result = toolFn();
    return result;
  } catch (error) {
    console.error(`[ToolRouter] Error executing tool for intent "${intent}":`, error.message);
    return '';
  }
}

/**
 * Get a list of available tools.
 */
function getAvailableTools() {
  return Object.keys(TOOL_MAP);
}

module.exports = { executeTools, getAvailableTools };
