import React from "react";
import { useParams } from "react-router-dom";
import adminApi from "../api";
import { Product } from "@/types/product";

// Shadcn/ui components
import { Skeleton } from "@/components/ui/skeleton";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Helper function to format price
const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(price);
};

export const AdminDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = React.useState<Product | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                if (!id) return;
                const res = await adminApi.findOneProduct(id);
                setProduct(res);
            } catch (err) {
                console.error("Failed to fetch product detail", err);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Skeleton for Image Carousel */}
                    <div>
                        <Skeleton className="w-full aspect-square bg-neutral-200 rounded-lg" />
                        <div className="flex justify-center gap-2 mt-4">
                            <Skeleton className="w-24 h-24 bg-neutral-200 rounded-md" />
                            <Skeleton className="w-24 h-24 bg-neutral-200 rounded-md" />
                            <Skeleton className="w-24 h-24 bg-neutral-200 rounded-md" />
                        </div>
                    </div>
                    {/* Skeleton for Product Details */}
                    <div className="space-y-6">
                        <Skeleton className="h-10 w-3/4 bg-neutral-200" />
                        <Skeleton className="h-6 w-1/4 bg-neutral-200" />
                        <Skeleton className="h-8 w-1/3 bg-neutral-200" />
                        <div className="space-y-4 pt-4">
                            <Skeleton className="h-6 w-1/5 bg-neutral-200" />
                            <div className="flex gap-2">
                                <Skeleton className="h-10 w-16 bg-neutral-200" />
                                <Skeleton className="h-10 w-16 bg-neutral-200" />
                                <Skeleton className="h-10 w-16 bg-neutral-200" />
                            </div>
                        </div>
                        <Skeleton className="h-12 w-full bg-neutral-200 rounded-lg" />
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return <div className="text-center p-8 text-xl text-neutral-600">Product not found.</div>;
    }

    // Lấy giá của biến thể đầu tiên để hiển thị làm giá chính
    const primaryVariant = product.variants[0];

    return (
        <main className="bg-white min-h-screen font-sans">
            <div className="max-w-6xl mx-auto p-4 sm:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Cột trái: Carousel ảnh sản phẩm */}
                    <Carousel className="w-full" opts={{ loop: true }}>
                        <CarouselContent>
                            {product.images.map((img, index) => (
                                <CarouselItem key={index}>
                                    <Card className="border-none rounded-lg overflow-hidden">
                                        <CardContent className="flex aspect-square items-center justify-center p-0">
                                            <img
                                                src={img.url}
                                                alt={`${product.name} - Image ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </CardContent>
                                    </Card>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-4" />
                        <CarouselNext className="right-4" />
                    </Carousel>

                    {/* Cột phải: Thông tin chi tiết sản phẩm */}
                    <div className="space-y-6">
                        <div>
                            <p className="text-sm uppercase tracking-wider text-neutral-500">{product.category}</p>
                            <h1 className="text-4xl font-light text-zinc-800 mt-1">{product.name}</h1>
                        </div>

                        {/* Giá sản phẩm */}
                        {primaryVariant && (
                            <div className="text-2xl font-medium text-zinc-900">
                                {primaryVariant.salePrice ? (
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-[#E85B25]">{formatPrice(primaryVariant.salePrice)}</span>
                                        <span className="line-through text-lg text-neutral-400">{formatPrice(primaryVariant.price)}</span>
                                    </div>
                                ) : (
                                    <span>{formatPrice(primaryVariant.price)}</span>
                                )}
                            </div>
                        )}

                        {/* Biến thể sản phẩm */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-neutral-700">Variants</h2>
                            {product.variants.map((v, index) => (
                                <div key={index} className="border p-4 rounded-lg bg-neutral-50/50 space-y-2">
                                    <p>
                                        <span className="font-medium text-neutral-600">Color:</span>
                                        <span className="ml-2">{v.color}</span>
                                    </p>
                                    <p>
                                        <span className="font-medium text-neutral-600">Size:</span>
                                        <span className="ml-2">{v.size}</span>
                                    </p>
                                    <p>
                                        <span className="font-medium text-neutral-600">Price:</span>
                                        <span className="ml-2">
                                            {v.salePrice ? (
                                                <>
                                                    <span className="text-[#E85B25] font-semibold">{formatPrice(v.salePrice)}</span>
                                                    <span className="ml-2 line-through text-sm text-neutral-500">{formatPrice(v.price)}</span>
                                                </>
                                            ) : (
                                                <span>{formatPrice(v.price)}</span>
                                            )}
                                        </span>
                                    </p>
                                    <p>
                                        <span className="font-medium text-neutral-600">Stock:</span>
                                        <span className={`ml-2 font-bold ${v.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                                            {v.stock > 0 ? `${v.stock} in stock` : "Out of Stock"}
                                        </span>
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="pt-4">
                            <Button size="lg" className="w-full bg-[#E85B25] hover:bg-[#d15021] text-white text-base">
                                Edit Product
                            </Button>
                        </div>

                        <div className="text-xs text-neutral-400 pt-4 text-right">
                            <p>Product ID: {product._id}</p>
                            <p>Created at: {new Date(product.createdAt).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};