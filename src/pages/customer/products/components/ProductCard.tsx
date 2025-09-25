import { Link } from "react-router-dom";
import type { ResProduct } from "@/types/product";

export const ProductCard = ({ product }: { product: ResProduct }) => {
  const displayVariant = product.variants[0];
  const firstSize = displayVariant?.sizes[0];
  const firstImage = product.images[0];

  if (!displayVariant || !firstSize || !firstImage) return null;

  return (
    <Link to={`/product/${product._id}`} className="group text-left">
      <div className="overflow-hidden bg-gray-100">
        <img
          src={firstImage.url}
          alt={product.name}
          className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="mt-4">
        <h3 className="font-semibold text-sm text-neutral-800">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          {firstSize.salePrice ? (
            <>
              <p className="text-sm text-red-600">
                ${firstSize.salePrice.toFixed(2)}
              </p>
              <p className="text-sm text-neutral-500 line-through">
                ${firstSize.price.toFixed(2)}
              </p>
            </>
          ) : (
            <p className="text-sm text-neutral-800">
              ${firstSize.price.toFixed(2)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};
