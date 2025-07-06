# Ask My Docs

Upload PDFs and chat with them using OpenAI. This demo uses Next.js 14, LangChain and Postgres with pgvector.

## Development

Create a `.env` file from `.env.example` and set your keys. Then run:

```bash
npm install
npm run dev
```

## Docker

Start Postgres with pgvector and the app:

```bash
docker-compose up --build
```

## CI

GitHub Actions runs `npm run build` and `npm test`, then builds a container image.
