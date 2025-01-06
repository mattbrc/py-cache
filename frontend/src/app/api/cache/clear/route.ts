import { NextResponse } from 'next/server';

const PROXY_URL = 'http://localhost:8001';

export async function POST() {
  try {
    // Make a request to clear the cache
    const response = await fetch(`${PROXY_URL}/cache/clear`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return NextResponse.json({ message: 'Cache cleared successfully' });
  } catch (error) {
    console.error('Error clearing cache:', error);
    return NextResponse.json(
      { error: 'Failed to clear cache' },
      { status: 500 }
    );
  }
} 