import { Request, Response, NextFunction } from 'express';
import { UrlSchema } from '../models/summary';
import { extractContentFromUrl } from '../services/contentExtractor';
import { summarizeContent } from '../services/summarizer';
import logger from '../utils/logger';

/**
 * Controller to handle URL summarization requests
 */
export const summarizeUrl = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Validate the URL input
    const { url } = UrlSchema.parse(req.body);

    logger.info(`Received summarization request for URL: ${url}`);

    // Extract content from the URL
    const extractedContent = await extractContentFromUrl(url);

    // Summarize the content
    const summaryResult = await summarizeContent(extractedContent);

    // Return the summary
    res.status(200).json({
      status: 'success',
      data: summaryResult,
    });
  } catch (error) {
    next(error);
  }
};
