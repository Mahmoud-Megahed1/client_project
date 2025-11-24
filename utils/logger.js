const isDebugEnabled = () => {
  const flag = (process.env.DEBUG || '').toString().toLowerCase();
  return flag === 'true' || flag === '1';
};

const log = (...args) => {
  if (isDebugEnabled()) {
    console.log('[DEBUG]', ...args);
  }
};

const error = (...args) => {
  console.error('[ERROR]', ...args);
};

module.exports = {
  log,
  error,
};

