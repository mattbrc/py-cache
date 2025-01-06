"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { getCacheStatus, type CacheStatus } from "@/lib/api";

export default function CacheStatus() {
  const [cacheInfo, setCacheInfo] = useState<CacheStatus>({
    status: "MISS",
    timestamp: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const status = await getCacheStatus();
      setCacheInfo(status);
      setError(null);
    } catch (err) {
      setError("Failed to fetch cache status");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Current Cache Status</CardTitle>
        <Button
          variant="outline"
          size="icon"
          onClick={fetchStatus}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold">
              Status:{" "}
              <span
                className={
                  cacheInfo.status === "HIT"
                    ? "text-green-600"
                    : "text-yellow-600"
                }
              >
                {cacheInfo.status}
              </span>
            </p>
            <p className="text-sm text-gray-500">
              Last Updated:{" "}
              {cacheInfo.timestamp
                ? new Date(cacheInfo.timestamp).toLocaleString()
                : "Loading..."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
