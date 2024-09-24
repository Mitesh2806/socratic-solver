// app/api/gemini/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  const { prompt } = await request.json();

  try {
    const result = await axios.post('https://gemini-api-url.com/generate', {
      prompt,
    });

    return NextResponse.json({ hint: result.data.hint });
  } catch (error : Error | any) {
    return NextResponse.json({ error: 'Failed to fetch hint' }, { status: 500 });
  }
}
