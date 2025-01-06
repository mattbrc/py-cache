export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  manufacturer: string;
  in_stock: boolean;
}

export interface CacheStatus {
  status: 'HIT' | 'MISS';
  timestamp: string;
}

export async function getRecentProducts(): Promise<Product[]> {
  const response = await fetch('/api/products');
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  const products = await response.json();
  
  // Sort by ID descending and take first 5
  const sortedProducts = products
    .sort((a: Product, b: Product) => b.id - a.id)
    .slice(0, 5);
  
  console.log('Recent products (sorted by ID):', 
    sortedProducts.map((p: Product) => ({ id: p.id, name: p.name }))
  );
  return sortedProducts;
}

export async function addProduct(product: Omit<Product, 'id'>): Promise<Product> {
  console.log('Making fetch request:', {
    url: '/api/products',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product)
  });

  const response = await fetch('/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });
  if (!response.ok) {
    throw new Error('Failed to add product');
  }
  const data = await response.json();
  console.log('Server response:', data);
  return data;
}

export async function getCacheStatus(): Promise<CacheStatus> {
  const response = await fetch('/api/cache/status');
  if (!response.ok) {
    throw new Error('Failed to fetch cache status');
  }
  return {
    status: response.headers.get('X-Cache') as 'HIT' | 'MISS',
    timestamp: response.headers.get('X-Cache-Timestamp') || new Date().toISOString(),
  };
} 