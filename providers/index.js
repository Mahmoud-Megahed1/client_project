const geminiProvider = require('./geminiProvider');
const openaiProvider = require('./openaiProvider');
const claudeProvider = require('./claudeProvider');
const logger = require('../utils/logger');

const providers = {
  gemini: geminiProvider,
  openai: openaiProvider,
  claude: claudeProvider,
};

const normalizeName = (name) => (name || '').toString().trim().toLowerCase();

const getProvider = (name) => {
  const envProvider = normalizeName(name || process.env.AI_PROVIDER || 'gemini');
  const provider = providers[envProvider];
  if (!provider) {
    const error = new Error(`Unknown AI provider "${envProvider}".`);
    logger.error(error.message);
    throw error;
  }
  return provider;
};

module.exports = {
  getProvider,
};

