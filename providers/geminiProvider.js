const { GoogleGenerativeAI } = require('@google/generative-ai');
const { buildSuccessResponse, buildErrorResponse } = require('../utils/responseBuilder');
const { validateOutput } = require('../utils/outputValidator');
const logger = require('../utils/logger');

const PROVIDER_NAME = 'gemini';

const getModel = () => {
  const apiKey = process.env.AI_KEY;
  if (!apiKey) {
    throw new Error('AI_KEY is not configured.');
  }
  const modelName = process.env.AI_MODEL || 'gemini-1.5-flash';
  const client = new GoogleGenerativeAI(apiKey);
  return client.getGenerativeModel({ model: modelName });
};

const buildParts = (payload) => {
  const parts = [];
  if (payload?.file?.buffer) {
    parts.push({
      inlineData: {
        data: payload.file.buffer.toString('base64'),
        mimeType: payload.file.mimeType,
      },
    });
  }
  if (payload?.prompt) {
    parts.push({ text: payload.prompt });
  }
  return parts;
};

const runGeminiOperation = async (payload) => {
  try {
    const model = getModel();
    const parts = buildParts(payload);
    if (!parts.length) {
      throw new Error('Gemini payload requires either a prompt or file.');
    }
    const result = await model.generateContent({
      contents: [{ role: 'user', parts }],
    });
    const text = result.response.text();
    const parsed = JSON.parse(text);
    const validated = validateOutput(payload.schemaType || 'analysis', parsed);
    const tokensUsed = result.response.usageMetadata?.totalTokenCount ?? null;
    return buildSuccessResponse(PROVIDER_NAME, validated.data, tokensUsed);
  } catch (error) {
    logger.error(`[${PROVIDER_NAME}] operation failed`, error);
    return buildErrorResponse(PROVIDER_NAME, error);
  }
};

module.exports = {
  name: PROVIDER_NAME,
  identifier: PROVIDER_NAME,
  analyzePDF: runGeminiOperation,
  summarize: runGeminiOperation,
  extractSections: runGeminiOperation,
};

