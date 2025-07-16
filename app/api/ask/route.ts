import { NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
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
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();
    
    // Simple text extraction (basic)
    let pdfText = `PDF has ${pages.length} pages. Content extraction in progress...`;
    
    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that answers questions about PDF documents.',
        },
        {
          role: 'user',
          content: `PDF info: ${pdfText}\n\nQuestion: ${question}`,
        },
      ],
    });

    return NextResponse.json({ answer: chatResponse.choices[0].message.content });
  } catch (err) {
    return NextResponse.json({ error: 'Processing failed: ' + (err instanceof Error ? err.message : 'Unknown error') }, { status: 500 });
  }
}