"use client";

import { useRef } from "react";
import CacheStatus from "@/components/core/cache-status";
import RecentProducts, {
  type RecentProductsHandle,
} from "@/components/core/recent-products";
import AddProductForm from "@/components/core/add-product-form";

export default function Home() {
  const productsRef = useRef<RecentProductsHandle>(null);

  const handleProductAdded = () => {
    productsRef.current?.refresh();
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Cache Proxy Dashboard
      </h1>
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Cache Status</h2>
          <CacheStatus />
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4">Recent Products</h2>
          <RecentProducts ref={productsRef} />
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4">Add New Product</h2>
          <AddProductForm onSuccess={handleProductAdded} />
        </section>
      </div>
    </div>
  );
}
