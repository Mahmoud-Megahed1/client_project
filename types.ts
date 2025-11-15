
export interface Slide {
  title: string;
  content: string[];
}

export interface GenerationResult {
  slides: Slide[];
  summary: string;
}

export enum AppState {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  // FIX: Renamed enum member from `_SUCCESS` to `SUCCESS` to fix a typo.
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}
