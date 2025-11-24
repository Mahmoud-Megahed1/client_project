const REQUIRED_FIELDS = {
  analysis: {
    slides: 'array',
    summary: 'string',
  },
  summary: {
    summary: 'string',
  },
  sections: {
    sections: 'array',
  },
  keywords: {
    keywords: 'array',
  },
  entities: {
    entities: 'array',
  },
};

const isType = (value, type) => {
  if (type === 'array') return Array.isArray(value);
  return typeof value === type;
};

const cleanJson = (payload) => {
  if (typeof payload !== 'string') return payload;
  try {
    return JSON.parse(payload);
  } catch (_) {
    const trimmed = payload.trim();
    const lastBrace = trimmed.lastIndexOf('}');
    if (lastBrace !== -1) {
      const sliced = trimmed.slice(0, lastBrace + 1);
      try {
        return JSON.parse(sliced);
      } catch (err) {
        throw new Error(`Unable to parse AI response: ${err.message}`);
      }
    }
    throw new Error('AI response is not valid JSON.');
  }
};

const validate = (type, data) => {
  const schema = REQUIRED_FIELDS[type];
  if (!schema) {
    throw new Error(`Unknown schema type: ${type}`);
  }
  Object.entries(schema).forEach(([field, expectedType]) => {
    if (!Object.prototype.hasOwnProperty.call(data, field)) {
      throw new Error(`Missing field "${field}" in ${type} response.`);
    }
    if (!isType(data[field], expectedType)) {
      throw new Error(`Invalid type for "${field}", expected ${expectedType}.`);
    }
  });
  return data;
};

const normalize = (type, data) => ({
  type,
  data,
  receivedAt: new Date().toISOString(),
});

const validateOutput = (type, rawPayload) => {
  const cleaned = cleanJson(rawPayload);
  const normalized = validate(type, cleaned);
  return normalize(type, normalized);
};

module.exports = {
  validateOutput,
};

