import { NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: any) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const question = formData.get('question');

    if (!file || !question) {
      return NextResponse.json({ error: 'Missing file or question.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const data = await pdfParse(buffer);
    
    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that answers questions about a PDF document.',
        },
        {
          role: 'user',
          content: `PDF content: ${data.text.slice(0, 8000)}\n\nQuestion: ${question}`,
        },
      ],
    });

    return NextResponse.json({ answer: chatResponse.choices[0].message.content });
  } catch (err) {
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
}