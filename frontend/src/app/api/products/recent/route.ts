import { NextResponse } from 'next/server';

const PROXY_URL = 'http://localhost:8001';

export async function GET() {
  try {
    const response = await fetch(`${PROXY_URL}/products`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data, {
      headers: {
        // Forward the cache status from the proxy
        'X-Cache': response.headers.get('X-Cache') || 'MISS',
        'X-Cache-Timestamp': response.headers.get('X-Cache-Timestamp') || '',
      },
    });
  } catch (error) {
    console.error('Error fetching recent products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent products' },
      { status: 500 }
    );
  }
} 