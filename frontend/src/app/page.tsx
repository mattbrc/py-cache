"use client";

import { useState } from "react";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  [key: string]: string | number | boolean | null | undefined;
}

export default function Home() {
  const [endpoint, setEndpoint] = useState("/products/1");
  const [response, setResponse] = useState<Product | null>(null);
  const [cacheStatus, setCacheStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `/api/cache/proxy?url=${encodeURIComponent(endpoint)}`
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setResponse(data);
      setCacheStatus(response.headers.get("X-Cache"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch");
      setResponse(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Caching Proxy Demo
          </h1>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="endpoint"
                className="block text-sm font-medium text-gray-700"
              >
                API Endpoint
              </label>
              <input
                type="text"
                id="endpoint"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black"
                placeholder="/products/1"
              />
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleFetch}
                disabled={loading}
                className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              >
                Fetch Data
              </button>
            </div>

            {loading && (
              <div className="text-center text-gray-500">Loading...</div>
            )}

            {error && <div className="text-red-600 text-sm mt-2">{error}</div>}

            {response && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-700">
                    Response:
                  </h3>
                  {cacheStatus && (
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        cacheStatus === "HIT"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      Cache: {cacheStatus}
                    </span>
                  )}
                </div>
                <div className="mt-1 p-3 bg-gray-100 rounded-md overflow-auto">
                  <pre className="text-sm">
                    {JSON.stringify(response, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
