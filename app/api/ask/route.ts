import { NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';
import { OpenAI } from 'openai';

export const runtime = 'nodejs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: any) {
  try {
    console.log('API called');
    
    const formData = await req.formData();
    const file = formData.get('file');
    const question = formData.get('question');
    
    console.log('File:', file ? 'exists' : 'missing');
    console.log('Question:', question);

    if (!file || !question) {
      return NextResponse.json({ error: 'Missing file or question.' }, { status: 400 });
    }

    console.log('Parsing PDF...');
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const data = await pdfParse(buffer);
    const pdfText = data.text;
    
    console.log('PDF text length:', pdfText.length);

    console.log('Calling OpenAI...');
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
    console.log('OpenAI response received');
    return NextResponse.json({ answer });
  } catch (err) {
    console.error('Detailed error:', err);
    return NextResponse.json({ 
      error: 'Detailed error: ' + (err instanceof Error ? err.message : 'Unknown error')
    }, { status: 500 });
  }
}