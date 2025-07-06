import { OpenAI } from 'openai';

const openai = new OpenAI();

export async function embedText(text: string) {
  const resp = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: text
  });
  return resp.data[0].embedding;
}

export async function embeddingsQuery(text: string) {
  return (await embedText(text));
}
