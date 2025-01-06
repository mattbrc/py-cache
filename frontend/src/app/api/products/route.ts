import { NextResponse } from 'next/server';

const PROXY_URL = 'http://localhost:8000';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  manufacturer: string;
  in_stock: boolean;
}

export async function GET() {
  try {
    // Request through the proxy cache server
    const response = await fetch(`${PROXY_URL}/products`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Sort by ID descending and take first 5
    const sortedData = (data as Product[])
      .sort((a, b) => b.id - a.id)
      .slice(0, 5);
    
    return NextResponse.json(sortedData, {
      headers: {
        'X-Cache': response.headers.get('X-Cache') || 'MISS',
        'X-Cache-Timestamp': response.headers.get('X-Cache-Timestamp') || '',
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Add the new product through the proxy
    const response = await fetch(`${PROXY_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Force a fresh fetch to invalidate cache
    await fetch(`${PROXY_URL}/products`, {
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
} 