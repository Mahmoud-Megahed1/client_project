const crypto = require('crypto');
const { getProvider } = require('../providers');
const cache = require('../utils/cache');
const logger = require('../utils/logger');
const withRetry = require('../utils/retry');
const { buildErrorResponse } = require('../utils/responseBuilder');
const stableStringify = require('../utils/stableStringify');

const DEFAULT_CACHE_TTL = 1000 * 60 * 5; // 5 minutes

const sanitizePayloadForCache = (payload) => {
  if (!payload || typeof payload !== 'object') {
    return payload;
  }
  const clone = { ...payload };
  if (clone.file) {
    clone.file = {
      fileName: clone.file.fileName,
      mimeType: clone.file.mimeType,
      size: clone.file.size,
    };
  }
  return clone;
};

const buildCacheKey = (operation, payload, providerName) => {
  const serialized = stableStringify(sanitizePayloadForCache(payload) || '');
  const hash = crypto.createHash('sha256').update(serialized).digest('hex');
  return `${providerName}:${operation}:${hash}`;
};

const execute = async (operation, payload, providerOverride) => {
  const provider = getProvider(providerOverride);
  const providerName =
    providerOverride || provider.identifier || provider.name || process.env.AI_PROVIDER || 'unknown';
  const cacheKey = buildCacheKey(operation, payload, providerName);

  const cached = cache.get(cacheKey);
  if (cached) {
    logger.log(`[aiService] Cache hit for ${operation} via ${providerName}`);
    return cached;
  }

  const callProvider = async () => {
    if (typeof provider[operation] !== 'function') {
      const error = new Error(`Provider "${providerName}" does not support "${operation}".`);
      error.retryable = false;
      throw error;
    }
    logger.log(`[aiService] Executing ${operation} with ${providerName}`);
    return provider[operation](payload);
  };

  try {
    const response = await withRetry(callProvider, { retries: 3, baseDelay: 500 });
    if (response && response.success) {
      cache.set(cacheKey, response, DEFAULT_CACHE_TTL);
    }
    return response;
  } catch (error) {
    logger.error(`[aiService] ${operation} failed`, error);
    return buildErrorResponse(providerName, error);
  }
};

module.exports = {
  analyzePDF: (payload, provider) => execute('analyzePDF', payload, provider),
  summarize: (payload, provider) => execute('summarize', payload, provider),
  extractSections: (payload, provider) => execute('extractSections', payload, provider),
};

