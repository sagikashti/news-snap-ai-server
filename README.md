# NewsSnapAI Server

A Node.js server that extracts content from URLs and uses AI to generate concise summaries.

## Features

- Extract article content from URLs using unfluff
- Generate summaries using Hugging Face's BART model
- RESTful API with Express
- TypeScript for type safety
- Comprehensive error handling
- Logging with Winston
- Rate limiting and security headers

## Prerequisites

- Node.js 14+ and npm
- Hugging Face API key (get one at [Hugging Face](https://huggingface.co/settings/tokens))

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Copy the example environment file and update with your values:
   ```
   cp example.env .env
   ```
4. Update the `.env` file with your Hugging Face API key

## Development

Start the development server:

```
npm run dev
```

## Testing

Run the test suite:

```
npm test
```

Run tests with coverage report:

```
npm run test:coverage
```

Run tests in watch mode during development:

```
npm run test:watch
```

## Production

Build the project:

```
npm run build
```

Start the production server:

```
npm start
```

## Docker Deployment

### Using Docker

Build and run the Docker image:

```
docker build -t newssnapai-server .
docker run -p 3000:3000 --env-file .env newssnapai-server
```

### Using Docker Compose

Start the service:

```
docker-compose up -d
```

Stop the service:

```
docker-compose down
```

## API Usage

### Summarize URL Content

**Endpoint:** `POST /api/summarize`

**Request Body:**

```json
{
  "url": "https://example.com/article"
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "originalUrl": "https://example.com/article",
    "title": "Article Title",
    "author": "Author Name",
    "date": "2023-01-01",
    "publisher": "Publisher Name",
    "summary": "Generated summary of the article...",
    "originalLength": 5000,
    "summaryLength": 300
  }
}
```

## Environment Variables

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development, production, test)
- `HUGGINGFACE_API_KEY`: Your Hugging Face API key
- `LOG_LEVEL`: Logging level (error, warn, info, http, verbose, debug, silly)
- `RATE_LIMIT_WINDOW_MS`: Rate limiting window in milliseconds
- `RATE_LIMIT_MAX`: Maximum requests per window

## Project Structure

```
src/
├── config/         # Configuration files and environment variable handling
├── controllers/    # Request handlers
├── middleware/     # Express middleware
├── models/         # Data models and validation schemas
├── routes/         # API routes
├── services/       # Business logic and external API integration
├── types/          # TypeScript type definitions
├── utils/          # Utility functions and helpers
├── app.ts          # Express app setup
└── index.ts        # Entry point
```

## License

ISC
