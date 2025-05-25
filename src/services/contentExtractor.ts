import fetch from 'node-fetch';
import unfluff from 'unfluff';
import { ExtractedContent } from '../models/summary';
import { BadRequestError, ExternalAPIError } from '../utils/errors';
import logger from '../utils/logger';

/**
 * Extracts content from a URL using unfluff
 */
export async function extractContentFromUrl(url: string): Promise<ExtractedContent> {
  try {
    logger.info(`Extracting content from URL: ${url}`);

    // Fetch the HTML content
    const response = await fetch(url);

    if (!response.ok) {
      throw new ExternalAPIError(`Failed to fetch URL: ${response.statusText}`, response.status);
    }

    const html = await response.text();

    // Extract content using unfluff
    const extracted = unfluff(html);

    // Check if we have any meaningful content
    if (!extracted.text || extracted.text.trim().length === 0) {
      throw new BadRequestError('Could not extract meaningful content from the URL');
    }

    logger.info(`Successfully extracted content from URL: ${url}`);

    // Return the extracted content
    return {
      title: extracted.title || null,
      author: extracted.author || null,
      date: extracted.date || null,
      text: extracted.text || null,
      description: extracted.description || null,
      publisher: extracted.publisher || null,
      url: url,
    };
  } catch (error) {
    if (error instanceof BadRequestError || error instanceof ExternalAPIError) {
      throw error;
    }

    logger.error(`Error extracting content from URL: ${url}`, { error });
    throw new ExternalAPIError(`Failed to extract content: ${(error as Error).message}`);
  }
}
