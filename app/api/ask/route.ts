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

    // For now, just simulate PDF reading
    const simulatedText = "This is a simulated PDF response for testing. Your PDF upload is working, but we're temporarily bypassing the PDF parsing to test the OpenAI integration.";
    
    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant.',
        },
        {
          role: 'user',
          content: `PDF content: ${simulatedText}\n\nQuestion: ${question}`,
        },
      ],
    });

    return NextResponse.json({ answer: chatResponse.choices[0].message.content });
  } catch (err) {
return NextResponse.json({ error: 'Processing failed: ' + (err instanceof Error ? err.message : 'Unknown error') }, { status: 500 });  }
}