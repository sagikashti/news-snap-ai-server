import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import { extractContentFromUrl } from '../../services/contentExtractor';
import { ExternalAPIError, BadRequestError } from '../../utils/errors';

// Mock unfluff module
jest.mock('unfluff', () => {
  return jest.fn().mockImplementation((html: string) => {
    if (html.includes('<empty>')) {
      return {
        title: null,
        author: null,
        date: null,
        text: '',
        description: null,
        publisher: null,
      };
    }

    return {
      title: 'Test Article Title',
      author: 'Test Author',
      date: '2023-01-01',
      text: 'This is the test article content. It contains useful information for testing purposes.',
      description: 'A test article description',
      publisher: 'Test Publisher',
    };
  });
});

describe('Content Extractor Service', () => {
  const mockResponse = {
    ok: true,
    status: 200,
    statusText: 'OK',
    text: jest.fn().mockResolvedValue('<html><body><p>Test content</p></body></html>'),
  };

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock the global fetch function
    global.fetch = jest.fn().mockResolvedValue(mockResponse) as unknown as typeof global.fetch;
  });

  it('should extract content from a URL successfully', async () => {
    const url = 'https://example.com/article';
    const result = await extractContentFromUrl(url);

    expect(global.fetch).toHaveBeenCalledWith(url);
    expect(result).toEqual({
      title: 'Test Article Title',
      author: 'Test Author',
      date: '2023-01-01',
      text: 'This is the test article content. It contains useful information for testing purposes.',
      description: 'A test article description',
      publisher: 'Test Publisher',
      url: url,
    });
  });

  it('should throw ExternalAPIError when fetch fails', async () => {
    const url = 'https://example.com/bad-url';

    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    }) as unknown as typeof global.fetch;

    await expect(extractContentFromUrl(url)).rejects.toThrow(ExternalAPIError);
    expect(global.fetch).toHaveBeenCalledWith(url);
  });

  it('should throw BadRequestError when no meaningful content is extracted', async () => {
    const url = 'https://example.com/empty-article';

    const emptyResponse = {
      ...mockResponse,
      text: jest.fn().mockResolvedValue('<empty>Empty page</empty>'),
    };

    global.fetch = jest.fn().mockResolvedValue(emptyResponse) as unknown as typeof global.fetch;

    await expect(extractContentFromUrl(url)).rejects.toThrow(BadRequestError);
    expect(global.fetch).toHaveBeenCalledWith(url);
  });

  it('should handle network errors properly', async () => {
    const url = 'https://example.com/network-error';

    global.fetch = jest.fn().mockRejectedValue(new Error('Network error')) as unknown as typeof global.fetch;

    await expect(extractContentFromUrl(url)).rejects.toThrow(ExternalAPIError);
    expect(global.fetch).toHaveBeenCalledWith(url);
  });
});
