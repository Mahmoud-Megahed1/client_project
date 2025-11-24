/**
 * AI Provider Abstraction Types
 * 
 * Defines interfaces for AI provider implementations and operations.
 */

import { GenerationResult } from '../../types';

/**
 * Supported AI providers
 */
export enum AIProvider {
  GEMINI = 'gemini',
  OPENAI = 'openai',
  CLAUDE = 'claude',
}

/**
 * AI model configuration
 */
export interface AIModelConfig {
  provider: AIProvider;
  model: string;
  apiKey: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
}

/**
 * File input for AI processing
 */
export interface FileInput {
  data: string;           // Base64 encoded
  mimeType: string;       // MIME type (e.g., 'application/pdf')
  fileName?: string;      // Original filename
  size?: number;          // File size in bytes
}

/**
 * Text processing options
 */
export interface ProcessingOptions {
  language?: 'en' | 'fr' | 'ar';
  chunkSize?: number;
  preserveFormatting?: boolean;
}

/**
 * AI operation result with metadata
 */
export interface AIOperationResult<T> {
  data: T;
  provider: AIProvider;
  model: string;
  tokensUsed?: {
    input: number;
    output: number;
    total: number;
  };
  latency?: number;       // Response time in milliseconds
  error?: string;
}

/**
 * Base interface that all AI providers must implement
 */
export interface IAIProvider {
  /**
   * Provider identification
   */
  readonly name: AIProvider;
  readonly isConfigured: boolean;

  /**
   * Core operation: Analyze document and generate slides + summary
   */
  generateSlidesAndSummary(
    file: FileInput,
    options?: ProcessingOptions
  ): Promise<GenerationResult>;

  /**
   * Generate summary only (for future use)
   */
  summarizeText(
    text: string,
    options?: ProcessingOptions
  ): Promise<string>;

  /**
   * Extract keywords (for future use)
   */
  extractKeywords(
    text: string,
    options?: ProcessingOptions
  ): Promise<string[]>;

  /**
   * Health check
   */
  validateConfiguration(): Promise<boolean>;
}

/**
 * Provider factory configuration
 */
export interface ProviderFactoryConfig {
  defaultProvider: AIProvider;
  fallbackProviders?: AIProvider[];
  enableFallback?: boolean;
}

/**
 * Error types for AI operations
 */
export enum AIErrorType {
  INVALID_CONFIG = 'INVALID_CONFIG',
  API_ERROR = 'API_ERROR',
  RATE_LIMIT = 'RATE_LIMIT',
  INVALID_INPUT = 'INVALID_INPUT',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  TIMEOUT = 'TIMEOUT',
  UNSUPPORTED_OPERATION = 'UNSUPPORTED_OPERATION',
}

/**
 * Custom AI error class
 */
export class AIError extends Error {
  constructor(
    public type: AIErrorType,
    message: string,
    public provider?: AIProvider,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'AIError';
  }
}

/**
 * Prompt template context
 */
export interface PromptContext {
  language: 'en' | 'fr' | 'ar';
  taskType: 'slides' | 'summary' | 'keywords' | 'analysis';
  additionalInstructions?: string;
}
