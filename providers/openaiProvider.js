const { buildErrorResponse } = require('../utils/responseBuilder');
const logger = require('../utils/logger');

const PROVIDER_NAME = 'openai';

const notImplemented = async (operation) => {
  const message = `[${PROVIDER_NAME}] ${operation} is not configured yet.`;
  logger.error(message);
  return buildErrorResponse(PROVIDER_NAME, message);
};

module.exports = {
  name: PROVIDER_NAME,
  analyzePDF: async (payload) => {
    if (!payload) {
      return buildErrorResponse(PROVIDER_NAME, 'Missing payload for analyzePDF.');
    }
    return notImplemented('analyzePDF');
  },
  summarize: async (payload) => {
    if (!payload) {
      return buildErrorResponse(PROVIDER_NAME, 'Missing payload for summarize.');
    }
    return notImplemented('summarize');
  },
  extractSections: async (payload) => {
    if (!payload) {
      return buildErrorResponse(PROVIDER_NAME, 'Missing payload for extractSections.');
    }
    return notImplemented('extractSections');
  },
  get identifier() {
    return PROVIDER_NAME;
  },
};

