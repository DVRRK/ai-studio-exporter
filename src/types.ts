export enum MessageRole {
  USER = 'user',
  MODEL = 'model',
  SYSTEM = 'system'
}

export interface ChatMessage {
  role: MessageRole;
  content: string;
  thinking?: string; // Content of thinking/reasoning blocks
  timestamp: string;
}

export interface ExtractRequest {
  type: 'EXTRACT_CHAT';
  includeThinking: boolean;
}

export interface ExtractResponse {
  success: boolean;
  data?: ChatMessage[];
  error?: string;
  title?: string;
}

export type ExportFormat = 'MARKDOWN' | 'JSON' | 'PDF' | 'TXT';