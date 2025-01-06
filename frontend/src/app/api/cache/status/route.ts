import { NextResponse } from 'next/server';

const PROXY_URL = 'http://localhost:8001';

export async function GET() {
  try {
    // Make a request to get recent products to check cache status
    const response = await fetch(`${PROXY_URL}/products/recent?limit=1`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return NextResponse.json(
      { message: 'Cache status retrieved' },
      {
        headers: {
          'X-Cache': response.headers.get('X-Cache') || 'MISS',
          'X-Cache-Timestamp': response.headers.get('X-Cache-Timestamp') || new Date().toISOString(),
        },
      }
    );
  } catch (error) {
    console.error('Error fetching cache status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cache status' },
      { status: 500 }
    );
  }
} 