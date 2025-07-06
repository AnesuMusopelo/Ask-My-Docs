import { setupTracing } from "../../../lib/tracing";
import { NextRequest } from 'next/server';
import { OpenAI } from 'openai';
import { getClient } from '../../../lib/db';
import { embeddingsQuery } from '../../../lib/embeddings';

export const runtime = 'edge';

setupTracing();
export async function POST(req: NextRequest) {
  const { message } = await req.json();
  const client = await getClient();
  const matches = await client.query('SELECT content FROM documents ORDER BY embedding <-> $1 LIMIT 5', [await embeddingsQuery(message)]);
  const context = matches.rows.map((r: any) => r.content).join('\n');
  const openai = new OpenAI();

  const stream = new ReadableStream({
    async start(controller) {
      const resp = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        stream: true,
        messages: [
          { role: 'system', content: 'Answer questions based on the provided context.' },
          { role: 'user', content: `${context}\n\nQuestion: ${message}` }
        ]
      });
      for await (const chunk of resp) {
        const token = chunk.choices[0]?.delta?.content || '';
        controller.enqueue(token);
      }
      controller.close();
    }
  });
  return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
