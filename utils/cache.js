const store = new Map();

const set = (key, value, ttlMs) => {
  const expiresAt = ttlMs ? Date.now() + ttlMs : null;
  store.set(key, { value, expiresAt });
};

const get = (key) => {
  const entry = store.get(key);
  if (!entry) return null;
  if (entry.expiresAt && entry.expiresAt <= Date.now()) {
    store.delete(key);
    return null;
  }
  return entry.value;
};

const clear = (key) => {
  if (key) {
    store.delete(key);
    return;
  }
  store.clear();
};

module.exports = {
  set,
  get,
  clear,
};

