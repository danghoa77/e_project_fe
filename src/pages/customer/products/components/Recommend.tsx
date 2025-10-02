import { useEffect, useState } from "react";
import { customerApi } from "../../api";

import type { ResProduct } from "@/types/product";
import { ProductCard } from "./ProductCard";

export const RecommendCard = () => {
  const [products, setProducts] = useState<ResProduct[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await customerApi.topProducts();
        // res.products = [{ productId, name, image, price, ... }]
        const fullProducts: ResProduct[] = [];

        for (const p of res.products) {
          const detail = await customerApi.findOneProduct(p.productId);
          fullProducts.push(detail);
        }

        setProducts(fullProducts);
      } catch (err) {
        console.error("Failed to fetch recommended products", err);
      }
    };
    fetchData();
  }, []);

  if (products.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold text-stone-800 mb-6">
        Top Products
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {products.slice(0, 5).map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </div>
  );
};
