import { NextResponse } from 'next/server';

const CACHE_SERVER_URL = 'http://localhost:8000';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');
  
  if (!key) {
    return NextResponse.json({ error: 'Key is required' }, { status: 400 });
  }

  const response = await fetch(`${CACHE_SERVER_URL}/cache/${key}`);
  const data = await response.json();
  
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { key, value } = body;
  
  if (!key || value === undefined) {
    return NextResponse.json({ error: 'Key and value are required' }, { status: 400 });
  }

  const response = await fetch(`${CACHE_SERVER_URL}/cache/${key}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ value }),
  });
  
  const data = await response.json();
  return NextResponse.json(data);
} 