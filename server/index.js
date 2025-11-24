const path = require('path');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const dotenv = require('dotenv');

const logger = require('../utils/logger');
const textProcessor = require('../utils/textProcessor');
const templates = require('../prompts/templates');
const { validateOutput } = require('../utils/outputValidator');
const { buildErrorResponse } = require('../utils/responseBuilder');
const aiService = require('../services/aiService');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const app = express();
const upload = multer();

app.use(cors());
app.use(express.json({ limit: '20mb' }));

const operationMap = {
  pdfAnalysis: {
    method: aiService.analyzePDF,
    schema: 'analysis',
    prompt: templates.pdfAnalysis,
  },
  summarize: {
    method: aiService.summarize,
    schema: 'summary',
    prompt: templates.documentExplanation,
  },
  extractSections: {
    method: aiService.extractSections,
    schema: 'sections',
    prompt: templates.sectionExtraction,
  },
};

const buildPromptContext = (rawText = '', extras = {}) => {
  const cleaned = textProcessor.removeFormatting(rawText);
  const normalized = textProcessor.normalizeArabic(cleaned);
  const chunks = textProcessor.splitIntoChunks(normalized);
  const language = textProcessor.detectLanguage(normalized);

  return {
    cleaned,
    normalized,
    chunks,
    language,
    context: chunks.join('\n\n'),
    ...extras,
  };
};

app.post('/api/ai', upload.single('file'), async (req, res) => {
  const { operation } = req.body;
  const config = operationMap[operation];

  if (!config) {
    return res.status(400).json(buildErrorResponse('router', `Unsupported operation "${operation}".`));
  }

  try {
    const filePart = req.file
      ? {
          buffer: req.file.buffer,
          mimeType: req.file.mimetype,
          fileName: req.file.originalname,
          size: req.file.size,
        }
      : null;

    const promptContext = buildPromptContext(req.body.text || '', {
      question: req.body.question,
      insights: req.body.insights,
    });
    const prompt = config.prompt(promptContext);

    const payload = {
      ...promptContext,
      prompt,
      file: filePart,
      schemaType: config.schema,
      operation,
      metadata: {
        fileName: filePart?.fileName,
        mimeType: filePart?.mimeType,
        size: filePart?.size,
      },
    };

    const response = await config.method(payload);

    if (!response || !response.success) {
      const errorPayload = response || buildErrorResponse('router', 'Unknown AI error.');
      return res.status(502).json(errorPayload);
    }

    const validated = validateOutput(payload.schemaType, response.data);
    res.json({
      ...response,
      data: validated.data,
    });
  } catch (error) {
    logger.error('AI endpoint failure', error);
    res.status(500).json(buildErrorResponse('router', error));
  }
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  logger.log(`AI backend listening on port ${PORT}`);
});

