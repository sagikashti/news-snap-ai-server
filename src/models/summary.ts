import { z } from 'zod';

// Schema for URL validation
export const UrlSchema = z.object({
  url: z.string().url('Invalid URL format'),
});

export type UrlInput = z.infer<typeof UrlSchema>;

// Schema for content extraction result
export interface ExtractedContent {
  title: string | null;
  author: string | null;
  date: string | null;
  text: string | null;
  description: string | null;
  publisher: string | null;
  url: string;
}

// Schema for summarization result
export interface SummaryResult {
  originalUrl: string;
  title: string | null;
  author: string | null;
  date: string | null;
  publisher: string | null;
  summary: string;
  originalLength: number;
  summaryLength: number;
}
