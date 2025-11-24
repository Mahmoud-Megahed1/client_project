const logger = require('./logger');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetryableError = (error) => {
  if (!error) return false;
  if (error.retryable) return true;
  const message = (error.message || '').toLowerCase();
  return (
    message.includes('network') ||
    message.includes('rate limit') ||
    message.includes('timeout')
  );
};

const withRetry = async (operation, { retries = 3, baseDelay = 500 } = {}) => {
  let attempt = 0;
  while (attempt <= retries) {
    try {
      return await operation();
    } catch (error) {
      attempt += 1;
      if (attempt > retries || !isRetryableError(error)) {
        throw error;
      }
      const delay = baseDelay * Math.pow(2, attempt - 1);
      logger.log(`Retrying operation (attempt ${attempt}/${retries}) in ${delay}ms`);
      await sleep(delay);
    }
  }
};

module.exports = withRetry;

