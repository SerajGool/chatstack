import { NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';
import { OpenAI } from 'openai';

export const runtime = 'nodejs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    // Parse the incoming form data
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const question = formData.get('question') as string;

    if (!file || !question) {
      return NextResponse.json({ error: 'Missing file or question.' }, { status: 400 });
    }

    // Read file into buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text from PDF
    const data = await pdfParse(buffer);
    const pdfText = data.text;

    // Call GPT-4o Mini with context from PDF
    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that answers questions about a PDF document.',
        },
        {
          role: 'user',
          content: `The following is the content of the PDF:\n\n${pdfText.slice(0, 8000)}\n\nQuestion: ${question}`,
        },
      ],
    });

    const answer = chatResponse.choices[0].message.content;

    return NextResponse.json({ answer });
  } catch (err) {
    if (err instanceof Error) {
      console.error('❌ API error:', err);
      console.error('Error message:', err.message);
      console.error('Error stack:', err.stack);
    } else {
      console.error('Unknown error:', err);
    }

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
