import { NextResponse } from 'next/server';
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

    // For now, let's use a simple approach that works
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Basic PDF info (we'll add text extraction once this works)
    const pdfText = `PDF file uploaded successfully (${uint8Array.length} bytes). This is a basic response while we work on text extraction.`;
    
    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant. The user uploaded a PDF but text extraction is still being implemented.',
        },
        {
          role: 'user',
          content: `Question about uploaded PDF: ${question}`,
        },
      ],
    });

    return NextResponse.json({ answer: chatResponse.choices[0].message.content });
  } catch (err) {
    return NextResponse.json({ error: 'Processing failed: ' + (err instanceof Error ? err.message : 'Unknown error') }, { status: 500 });
  }
}