import { setupTracing } from "../../../lib/tracing";
import { NextRequest, NextResponse } from 'next/server';
import pdf from 'pdf-parse';
import { getClient } from '../../../lib/db';
import { embedText } from '../../../lib/embeddings';

setupTracing();
export async function POST(req: NextRequest) {
  const data = await req.formData();
  const file = data.get('file') as File;
  const buffer = Buffer.from(await file.arrayBuffer());
  const text = (await pdf(buffer)).text;

  const client = await getClient();
  const embeddings = await embedText(text);
  await client.query('INSERT INTO documents(content, embedding) VALUES($1, $2)', [text, embeddings]);
  return NextResponse.json({ status: 'ok' });
}
