import { jest, describe, beforeEach, afterAll, it, expect } from '@jest/globals';
import request from 'supertest';
import app from '../../app';
import * as http from 'http';

// Mock the services
jest.mock('../../services/contentExtractor', () => ({
  extractContentFromUrl: jest.fn().mockResolvedValue({
    title: 'Mocked Article Title',
    author: 'Mocked Author',
    date: '2023-01-01',
    text: 'This is the mocked article content.',
    description: 'A mocked article description',
    publisher: 'Mocked Publisher',
    url: 'https://example.com/mocked-article',
  }),
}));

jest.mock('../../services/summarizer', () => ({
  summarizeContent: jest.fn().mockResolvedValue({
    originalUrl: 'https://example.com/mocked-article',
    title: 'Mocked Article Title',
    author: 'Mocked Author',
    date: '2023-01-01',
    publisher: 'Mocked Publisher',
    summary: 'This is a mocked summary of the article.',
    originalLength: 100,
    summaryLength: 50,
  }),
}));

describe('Summary Routes', () => {
  let server: http.Server;

  beforeAll(() => {
    server = http.createServer(app);
    server.listen();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    server.close();
  });

  it('should successfully summarize a URL', async () => {
    const response = await request(app).post('/api/summarize').send({ url: 'https://example.com/article' }).set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'success',
      data: {
        originalUrl: 'https://example.com/mocked-article',
        title: 'Mocked Article Title',
        author: 'Mocked Author',
        date: '2023-01-01',
        publisher: 'Mocked Publisher',
        summary: 'This is a mocked summary of the article.',
        originalLength: 100,
        summaryLength: 50,
      },
    });
  });

  it('should return a 400 error for invalid URLs', async () => {
    const response = await request(app).post('/api/summarize').send({ url: 'not-a-valid-url' }).set('Accept', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body.status).toBe('error');
  });

  it('should return a 400 error for missing URL', async () => {
    const response = await request(app).post('/api/summarize').send({}).set('Accept', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body.status).toBe('error');
  });
});
