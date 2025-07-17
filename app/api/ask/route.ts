import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: any) {
  try {
    console.log('📁 Starting...');
    
    const formData = await req.formData();
    const file = formData.get('file');
    const question = formData.get('question');

    if (!file || !question) {
      return NextResponse.json({ error: 'Missing file or question.' }, { status: 400 });
    }

    console.log('📄 File received, size:', file.size, 'bytes');
    
    // Try to extract text with pdf2json
    try {
      const PDFParser = (await import('pdf2json')).default;
      const pdfParser = new PDFParser();
      
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      console.log('📚 Parsing PDF...');
      
      const pdfData: any = await new Promise((resolve, reject) => {
        pdfParser.on('pdfParser_dataError', reject);
        pdfParser.on('pdfParser_dataReady', resolve);
        pdfParser.parseBuffer(buffer);
      });
      
      // Extract text from parsed data
      let fullText = '';
      if (pdfData && pdfData.Pages && Array.isArray(pdfData.Pages)) {
        for (const page of pdfData.Pages) {
          if (page.Texts && Array.isArray(page.Texts)) {
            for (const text of page.Texts) {
              if (text.R && Array.isArray(text.R)) {
                for (const r of text.R) {
                  if (r.T) {
                    fullText += decodeURIComponent(r.T) + ' ';
                  }
                }
              }
            }
          }
        }
      }
      
      console.log('📝 Text extracted, length:', fullText.length);
      
      if (fullText.trim().length > 0) {
        const chatResponse = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant. Answer questions based on the provided PDF content.',
            },
            {
              role: 'user',
              content: `PDF Content: ${fullText}\n\nQuestion: ${question}`,
            },
          ],
        });
        
        console.log('✅ OpenAI response with PDF content');
        return NextResponse.json({ answer: chatResponse.choices[0].message.content });
      }
    } catch (pdfError) {
      console.log('📄 PDF extraction failed:', pdfError);
    }
    
    // Fallback if PDF extraction fails
    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant. The user uploaded a PDF file, but text extraction failed. Ask them to describe what they need help with from the document.',
        },
        {
          role: 'user',
          content: `I uploaded a PDF file and have this question: ${question}`,
        },
      ],
    });

    console.log('✅ OpenAI fallback response');
    return NextResponse.json({ answer: chatResponse.choices[0].message.content });
  } catch (err) {
    console.log('💥 Error:', err);
    return NextResponse.json({ error: 'Processing failed: ' + (err instanceof Error ? err.message : 'Unknown error') }, { status: 500 });
  }
}