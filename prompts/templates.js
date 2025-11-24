const templates = {
  pdfAnalysis: ({ context, language = 'en' }) => `
You are an expert academic assistant. Analyze the provided context and respond in ${language.toUpperCase()}.
Return a strict JSON object with the shape:
{
  "slides": [
    { "title": "string", "content": ["bullet", "..."] }
  ],
  "summary": "string"
}
Do not include any extra keys or prose.
CONTENT:
${context}
`.trim(),
  titleExtraction: ({ context }) => `
Extract a concise document title from the following content and return:
{ "title": "string" }
CONTENT:
${context}
`.trim(),
  sectionExtraction: ({ context }) => `
Identify the main document sections and return:
{ "sections": [{ "title": "string", "description": "string" }] }
CONTENT:
${context}
`.trim(),
  documentExplanation: ({ question, context, language = 'en' }) => `
You answer user questions about the document in ${language.toUpperCase()}.
Respond with:
{ "summary": "string", "answer": "string" }
QUESTION:
${question || 'Provide a concise summary.'}
CONTEXT:
${context}
`.trim(),
  reportGeneration: ({ insights }) => `
Generate a professional academic report using this structured data:
${insights}
Return a JSON object { "summary": "string", "sections": [{ "title": "...", "content": ["..."] }] }.
`.trim(),
};

module.exports = templates;

