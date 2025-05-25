import { HfInference } from '@huggingface/inference';
import { ExtractedContent, SummaryResult } from '../models/summary';
import { ExternalAPIError } from '../utils/errors';
import config from '../config';
import logger from '../utils/logger';

const hf = new HfInference(config.huggingface.apiKey);

// קבועים
const MAX_INPUT_CHARS = 1024;
const FALLBACK_PARAGRAPH_LIMIT = 3;

// מודל ברירת מחדל מהיר וקל
const DEFAULT_MODEL = 'sshleifer/distilbart-cnn-12-6';

// ניקוי טקסט
function cleanAndTruncate(text: string, limit: number): string {
  return text
    .replace(/<[^>]*>/g, '') // הסרת HTML
    .replace(/\s+/g, ' ') // רווחים מיותרים
    .trim()
    .slice(0, limit);
}

// קריאה ל-API עם טיפול בשגיאות
async function callSummarizer(model: string, text: string) {
  return await hf.summarization({
    model,
    inputs: text,
    parameters: {
      max_length: 300,
      min_length: 100,
      temperature: 1.0,
    },
  });
}

export async function summarizeContent(content: ExtractedContent): Promise<SummaryResult> {
  try {
    logger.info(`Summarizing content from: ${content.url}`);

    if (!content.text) {
      throw new Error('No text content to summarize');
    }

    const model = config.huggingface.model || DEFAULT_MODEL;
    const cleanedText = cleanAndTruncate(content.text, MAX_INPUT_CHARS);

    try {
      const summary = await callSummarizer(model, cleanedText);
      if (!summary || typeof summary.summary_text !== 'string') {
        throw new Error('Invalid summary response');
      }

      logger.info(`Successfully summarized content from: ${content.url}`);

      return {
        originalUrl: content.url,
        title: content.title,
        author: content.author,
        date: content.date,
        publisher: content.publisher,
        summary: summary.summary_text,
        originalLength: content.text.length,
        summaryLength: summary.summary_text.length,
      };
    } catch (primaryError) {
      logger.warn(`Primary summarization failed, attempting paragraph fallback. Reason: ${(primaryError as Error).message}`);

      // נסה fallback – סכם כל פסקה בנפרד (עד X ראשונות)
      const paragraphs = content.text
        .split(/\n+/)
        .map((p) => p.trim())
        .filter((p) => p.length > 50) // סינון פסקאות קצרות מדי
        .slice(0, FALLBACK_PARAGRAPH_LIMIT);

      const summarizedParagraphs = await Promise.all(
        paragraphs.map(async (p, i) => {
          const pText = cleanAndTruncate(p, MAX_INPUT_CHARS);
          const s = await callSummarizer(model, pText);
          return `• ${s.summary_text}`;
        })
      );

      const combinedSummary = summarizedParagraphs.join('\n');

      logger.info(`Fallback summary used for: ${content.url}`);

      return {
        originalUrl: content.url,
        title: content.title,
        author: content.author,
        date: content.date,
        publisher: content.publisher,
        summary: combinedSummary,
        originalLength: content.text.length,
        summaryLength: combinedSummary.length,
      };
    }
  } catch (error) {
    logger.error(`Error summarizing content: ${(error as Error).message}`);
    throw new ExternalAPIError(`Failed to summarize content: ${(error as Error).message}`);
  }
}
