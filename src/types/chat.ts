export type AttachmentType = 'image' | 'pdf' | 'text' | 'url' | 'audio';

export interface Attachment {
  id: string;
  type: AttachmentType;
  name: string;
  content: string; // base64 data-URL for images; extracted text for pdf/text; raw URL for url
  mimeType: string;
  size?: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  attachments?: Attachment[];
  timestamp: number;
}

export interface ChatThread {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}
