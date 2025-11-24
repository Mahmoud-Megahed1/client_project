import { GenerationResult } from '../types';

const unifiedEndpoint = '/api/ai';

type AiOperation = 'pdfAnalysis';

const callAiEndpoint = async (operation: AiOperation, payload: FormData | Record<string, unknown>) => {
  const isForm = payload instanceof FormData;
  const body = isForm ? payload : JSON.stringify(payload);
  const headers = isForm ? undefined : { 'Content-Type': 'application/json' };

  const response = await fetch(unifiedEndpoint, {
    method: 'POST',
    headers,
    body,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'AI service error');
  }

  return response.json();
};

export const generateSlidesAndSummary = async (file: File): Promise<GenerationResult> => {
  const formData = new FormData();
  formData.append('operation', 'pdfAnalysis');
  formData.append('file', file);
  const result = await callAiEndpoint('pdfAnalysis', formData);
  return result as GenerationResult;
};

