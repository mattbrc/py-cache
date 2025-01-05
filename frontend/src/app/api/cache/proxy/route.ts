import { NextResponse } from 'next/server';

const CACHE_SERVER_URL = 'http://localhost:8000';
const ORIGIN_API = 'http://localhost:8001';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  
  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  // Forward the request to the cache server
  const response = await fetch(`${CACHE_SERVER_URL}/proxy${url}`, {
    headers: {
      'X-Origin-URL': ORIGIN_API,
    },
  });
  
  const data = await response.json();
  
  // Create response with the same cache status
  return NextResponse.json(data, {
    headers: {
      'X-Cache': response.headers.get('X-Cache') || 'MISS',
    },
  });
} 