import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import adminApi from "../api";
import type { ResProduct, ColorVariant, SizeOption } from "@/types/product";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

const AdminDetailSkeleton = () => (
  <div className="max-w-7xl mx-auto p-4 sm:p-8">
    <Skeleton className="h-8 w-32 mb-8 bg-neutral-200" />
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
      <div className="lg:col-span-2">
        <Skeleton className="w-full aspect-square bg-neutral-200 rounded-lg" />
      </div>
      <div className="lg:col-span-3 space-y-6">
        <Skeleton className="h-6 w-1/4 bg-neutral-200" />
        <Skeleton className="h-10 w-3/4 bg-neutral-200" />
        <Skeleton className="h-8 w-1/3 bg-neutral-200" />
        <div className="space-y-4 pt-4">
          <Skeleton className="h-6 w-1/5 bg-neutral-200" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24 bg-neutral-200 rounded-full" />
            <Skeleton className="h-10 w-24 bg-neutral-200 rounded-full" />
            <Skeleton className="h-10 w-24 bg-neutral-200 rounded-full" />
          </div>
        </div>
        <Skeleton className="h-20 w-full bg-neutral-200 rounded-lg" />
      </div>
    </div>
  </div>
);

export const AdminDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = React.useState<ResProduct | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [hoveredSizeId, setHoveredSizeId] = React.useState<string | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        if (!id) return;
        const res: ResProduct = await adminApi.findOneProduct(id);
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
    return <AdminDetailSkeleton />;
  }

  if (!product) {
    return (
      <div className="text-center p-8 text-xl text-neutral-600">
        Product not found.
      </div>
    );
  }

  return (
    <main className="bg-stone-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto p-4 sm:p-8">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="mb-6 text-stone-600 hover:text-stone-900"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-2 lg:sticky top-8">
            <Carousel className="w-full" opts={{ loop: true }}>
              <CarouselContent>
                {product.images.map((img, index) => (
                  <CarouselItem key={index}>
                    <div className="aspect-square bg-stone-100 rounded-lg overflow-hidden border">
                      <img
                        src={img.url}
                        alt={`${product.name} - Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-3 bg-white/70 backdrop-blur-sm" />
              <CarouselNext className="right-3 bg-white/70 backdrop-blur-sm" />
            </Carousel>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-orange-600">
                {product.category?.name}
              </p>
              <h1 className="text-4xl font-bold text-stone-800 mt-1">
                {product.name}
              </h1>
            </div>

            <div className="prose prose-stone max-w-none">
              <p>{product.description}</p>
            </div>

            <div className="space-y-4 !mt-8">
              <h2 className="text-lg font-semibold text-stone-700">Variants</h2>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((variant: ColorVariant) =>
                  variant.sizes.map((s: SizeOption) => (
                    <Popover key={s._id} open={hoveredSizeId === s._id}>
                      <PopoverTrigger asChild>
                        <div
                          onMouseEnter={() => setHoveredSizeId(s._id)}
                          onMouseLeave={() => setHoveredSizeId(null)}
                        >
                          <Button
                            variant="outline"
                            className={cn(
                              "rounded-full px-4 py-2 h-auto transition-colors duration-200",
                              hoveredSizeId === s._id
                                ? "bg-orange-600 text-white border-orange-600"
                                : "bg-white"
                            )}
                          >
                            {variant.color} / {s.size}
                          </Button>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-4 space-y-2 bg-white border border-stone-200 rounded-lg shadow-lg z-10"
                        side="top"
                        align="start"
                      >
                        <p className="font-semibold text-sm">Details</p>
                        <div className="text-sm">
                          <span className="font-medium text-neutral-600">
                            Price:
                          </span>
                          <span className="ml-2">
                            {s.salePrice && s.salePrice < s.price ? (
                              <>
                                <span className="text-orange-600 font-bold">
                                  {formatPrice(s.salePrice)}
                                </span>
                                <span className="ml-2 line-through text-xs text-neutral-500">
                                  {formatPrice(s.price)}
                                </span>
                              </>
                            ) : (
                              <span>{formatPrice(s.price)}</span>
                            )}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-neutral-600">
                            Stock:
                          </span>
                          <span
                            className={`ml-2 font-bold ${
                              s.stock > 0 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {s.stock}
                          </span>
                        </div>
                      </PopoverContent>
                    </Popover>
                  ))
                )}
              </div>
            </div>

            <div className="text-xs text-neutral-400 pt-4 text-right border-t mt-8">
              <p>Product ID: {product._id}</p>
              <p>Created at: {new Date(product.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
