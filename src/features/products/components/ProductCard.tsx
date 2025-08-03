import { Link } from "react-router-dom";
import type { Product } from "@/types";

export const ProductCard = ({ product }: { product: Product }) => {
    const displayVariant = product.variants[0];
    // Lấy ra ảnh đầu tiên trong mảng images
    const firstImage = product.images[0];

    // Trả về null nếu không có ảnh hoặc không có variant để tránh lỗi
    if (!displayVariant || !firstImage) return null;

    return (
        <Link to={`/product/${product._id}`} className="group text-left">
            <div className="overflow-hidden bg-gray-100">
                {/* SỬA LỖI Ở ĐÂY: Dùng firstImage.url thay vì chỉ firstImage */}
                <img
                    src={firstImage.url}
                    alt={product.name}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                />
            </div>
            <div className="mt-4">
                <h3 className="font-semibold text-sm text-neutral-800">{product.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                    {displayVariant.salePrice ? (
                        <>
                            <p className="text-sm text-red-600">${displayVariant.salePrice.toFixed(2)}</p>
                            <p className="text-sm text-neutral-500 line-through">${displayVariant.price.toFixed(2)}</p>
                        </>
                    ) : (
                        <p className="text-sm text-neutral-800">${displayVariant.price.toFixed(2)}</p>
                    )}
                </div>
            </div>
        </Link>
    );
};