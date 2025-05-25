import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import { summarizeContent } from '../../services/summarizer';
import { ExtractedContent } from '../../models/summary';
import { ExternalAPIError } from '../../utils/errors';

// Mock the HfInference class
jest.mock('@huggingface/inference', () => {
  return {
    HfInference: jest.fn().mockImplementation(() => {
      return {
        summarization: jest.fn().mockResolvedValue({
          summary_text: 'This is a test summary of the article content.',
        }),
      };
    }),
  };
});

describe('Summarizer Service', () => {
  let mockContent: ExtractedContent;

  beforeEach(() => {
    jest.clearAllMocks();

    mockContent = {
      title: 'Test Article Title',
      author: 'Test Author',
      date: '2023-01-01',
      text: 'This is a long article content that needs to be summarized. '.repeat(100),
      description: 'A test article description',
      publisher: 'Test Publisher',
      url: 'https://example.com/article',
    };
  });

  it('should summarize content successfully', async () => {
    const result = await summarizeContent(mockContent);

    expect(result).toEqual({
      originalUrl: mockContent.url,
      title: mockContent.title,
      author: mockContent.author,
      date: mockContent.date,
      publisher: mockContent.publisher,
      summary: 'This is a test summary of the article content.',
      originalLength: mockContent.text!.length,
      summaryLength: 'This is a test summary of the article content.'.length,
    });
  });

  it('should throw error when text content is missing', async () => {
    const contentWithoutText = { ...mockContent, text: null };

    await expect(summarizeContent(contentWithoutText)).rejects.toThrow('No text content to summarize');
  });

  it('should handle API errors gracefully', async () => {
    // Get a reference to the mocked HfInference instance
    const { HfInference } = require('@huggingface/inference');
    const mockInstance = HfInference.mock.results[0].value;

    // Make the summarization method throw an error
    mockInstance.summarization.mockRejectedValue(new Error('API Error'));

    await expect(summarizeContent(mockContent)).rejects.toThrow(ExternalAPIError);
  });
});
