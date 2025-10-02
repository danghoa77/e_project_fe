// src/pages/customer/ProductDetailPage.tsx
import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ChevronLeft, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { customerApi } from "../api";
import type { ResProduct, ColorVariant, SizeOption } from "@/types/product";
import { toast } from "sonner";
import userStore from "@/store/userStore";

const ProductDetailSkeleton = () => (
  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
    <div>
      <Skeleton className="aspect-[4/5] w-full rounded-lg" />
      <div className="flex gap-4 mt-4">
        <Skeleton className="w-24 h-24 rounded-md" />
        <Skeleton className="w-24 h-24 rounded-md" />
        <Skeleton className="w-24 h-24 rounded-md" />
      </div>
    </div>
    <div className="pt-4">
      <Skeleton className="h-10 w-3/4" />
      <Skeleton className="h-4 w-1/4 mt-4" />
      <Skeleton className="h-8 w-1/3 mt-6 mb-6" />
      <Skeleton className="h-24 w-full mb-8" />
      <Skeleton className="h-6 w-1/3 mb-4" />
      <Skeleton className="h-10 w-1/2 mb-8" />
      <Skeleton className="h-6 w-1/3 mb-4" />
      <Skeleton className="h-12 w-3/4 mb-10" />
      <Skeleton className="h-14 w-full rounded-md" />
    </div>
  </div>
);

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { increaseCartItemCount } = userStore();

  const [product, setProduct] = React.useState<ResProduct | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const [selectedColor, setSelectedColor] = React.useState<string | null>(null);
  const [selectedSize, setSelectedSize] = React.useState<string | null>(null);
  const [isAdding, setIsAdding] = React.useState(false);

  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await customerApi.findOneProduct(id);
        setProduct(res);
      } catch (err) {
        console.error("Failed to fetch product", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  React.useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => setCurrent(api.selectedScrollSnap() + 1));
  }, [api]);

  const availableColors = React.useMemo(
    () => (product ? product.variants.map((v) => v.color) : []),
    [product]
  );

  const availableSizes = React.useMemo(() => {
    if (!product || !selectedColor) return [];
    const variant = product.variants.find((v) => v.color === selectedColor);
    return variant ? variant.sizes.map((s) => s.size) : [];
  }, [product, selectedColor]);

  React.useEffect(() => {
    if (availableColors.length === 1) setSelectedColor(availableColors[0]);
  }, [availableColors]);

  React.useEffect(() => {
    if (!product || !selectedColor) {
      setSelectedSize(null);
      return;
    }
    const variant = product.variants.find((v) => v.color === selectedColor);
    if (!variant) {
      setSelectedSize(null);
      return;
    }

    if (variant.sizes.length === 1) {
      setSelectedSize(variant.sizes[0].size);
    } else {
      if (!variant.sizes.some((s) => s.size === selectedSize)) {
        setSelectedSize(null);
      }
    }
  }, [product, selectedColor]);

  const selectedColorVariant: ColorVariant | undefined = React.useMemo(() => {
    if (!product || !selectedColor) return undefined;
    return product.variants.find((v) => v.color === selectedColor);
  }, [product, selectedColor]);

  const selectedSizeOption: SizeOption | undefined = React.useMemo(() => {
    if (!selectedColorVariant || !selectedSize) return undefined;
    return selectedColorVariant.sizes.find((s) => s.size === selectedSize);
  }, [selectedColorVariant, selectedSize]);

  const displayPrice =
    selectedSizeOption?.price ?? product?.variants[0]?.sizes[0]?.price ?? 0;
  const displaySalePrice = selectedSizeOption?.salePrice;

  const isAddToCartDisabled =
    !selectedColorVariant ||
    !selectedSizeOption ||
    selectedSizeOption.stock === 0;

  const handleAddToCart = async () => {
    if (!product || !selectedColorVariant || !selectedSizeOption) return;
    setIsAdding(true);
    try {
      const payload = {
        productId: product._id,
        variantId: selectedColorVariant._id,
        sizeId: selectedSizeOption._id,
        categoryId: product.category._id,
        quantity: 1,
      };
      console.log("Adding to cart with payload:", payload);
      await customerApi.addItemToCart(payload);
      increaseCartItemCount();
      toast.success("Added to cart!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to cart");
    } finally {
      setIsAdding(false);
    }
  };

  if (isLoading) return <ProductDetailSkeleton />;
  if (!product)
    return (
      <div className="text-center py-20 max-w-6xl mx-auto">
        <h2 className="text-2xl font-sans text-stone-700">Product Not Found</h2>
        <p className="text-stone-500 mt-2">
          The product you are looking for does not exist.
        </p>
      </div>
    );

  return (
    <main className="font-sans bg-[#F7F2EC] min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 max-w-6xl mx-auto">
          <Button
            onClick={() => navigate(-1)}
            variant="link"
            className="p-0 text-neutral-600 hover:text-orange-900 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to products
          </Button>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          <div className="md:sticky top-10 h-max">
            <Carousel setApi={setApi} opts={{ loop: true }} className="w-full">
              <CarouselContent>
                {product.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="aspect-[4/5] w-full bg-stone-100 rounded-lg overflow-hidden">
                      <img
                        src={image.url}
                        alt={image.cloudinaryId}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/60 hover:bg-white/90 backdrop-blur-sm" />
              <CarouselNext className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/60 hover:bg-white/90 backdrop-blur-sm" />
            </Carousel>

            <div className="flex gap-4 mt-4 justify-center">
              {product.images.map((image, index) => (
                <button
                  key={`thumb-${index}`}
                  onClick={() => api?.scrollTo(index)}
                  className={cn(
                    "w-20 h-20 lg:w-24 lg:h-24 rounded-md overflow-hidden transition-all duration-200",
                    index === current - 1
                      ? "ring-2 ring-orange-600 ring-offset-2"
                      : "opacity-60 hover:opacity-100"
                  )}
                >
                  <img
                    src={image.url}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col h-full">
            <h1 className="font-sans text-3xl md:text-4xl text-stone-900">
              {product.name}
            </h1>
            <Button
              variant="link"
              onClick={() =>
                navigate(`/products?category=${product.category._id}`)
              }
              className="p-0 h-auto text-sm text-stone-500 hover:text-orange-700 uppercase tracking-widest mt-2 self-start"
            >
              {product.category.name}
            </Button>

            <div className="flex items-baseline gap-3 mt-4">
              {displaySalePrice ? (
                <>
                  <p className="font-sans text-3xl text-red-600">
                    ${displaySalePrice.toFixed(2)}
                  </p>
                  <p className="font-sans text-xl text-neutral-500 line-through">
                    ${displayPrice.toFixed(2)}
                  </p>
                </>
              ) : (
                <p className="font-sans text-3xl text-stone-800">
                  ${displayPrice.toFixed(2)}
                </p>
              )}
            </div>

            <Separator className="my-8 bg-stone-200" />

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-800 mb-3">
                Color:{" "}
                <span className="font-normal text-neutral-600 capitalize">
                  {selectedColor || "Select a color"}
                </span>
              </h3>
              <div className="flex gap-3 flex-wrap">
                {availableColors.map((color) => {
                  const variant = product.variants.find(
                    (v) => v.color === color
                  );
                  return (
                    <button
                      key={color}
                      onClick={() => {
                        setSelectedColor(color);
                        if (variant && variant.sizes.length === 1) {
                          setSelectedSize(variant.sizes[0].size);
                        } else {
                          setSelectedSize(null);
                        }
                      }}
                      className={cn(
                        "h-9 w-9 rounded-full border-2 transition-all duration-200 shadow-sm hover:ring-2 hover:ring-orange-400 hover:ring-offset-1",
                        selectedColor === color
                          ? "border-orange-600 scale-110"
                          : "border-neutral-200"
                      )}
                      style={{ backgroundColor: color.toLowerCase() }}
                    />
                  );
                })}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-800 mb-3">
                Size:{" "}
                <span className="font-normal text-neutral-600">
                  {selectedSize || "Select a size"}
                </span>
              </h3>
              <div className="flex gap-2 flex-wrap">
                {availableSizes.map((size) => {
                  const variant = product.variants.find(
                    (v) => v.color === selectedColor
                  );
                  const sizeObj = variant?.sizes.find((s) => s.size === size);
                  const isAvailable = sizeObj ? sizeObj.stock > 0 : false;

                  return (
                    <Button
                      key={size}
                      variant="outline"
                      onClick={() => setSelectedSize(size)}
                      disabled={!isAvailable}
                      className={cn(
                        "rounded-md w-20 h-12 text-base border-stone-300",
                        selectedSize === size &&
                          "border-2 border-orange-600 bg-orange-50",
                        !isAvailable &&
                          "bg-stone-100 text-stone-400 line-through cursor-not-allowed"
                      )}
                    >
                      {size}
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="mt-10">
              <Button
                size="lg"
                className="w-full bg-orange-600 text-white hover:bg-orange-700 h-14 text-base uppercase tracking-wider rounded-md shadow-lg shadow-orange-200 disabled:bg-stone-300 disabled:shadow-none"
                disabled={isAddToCartDisabled || isAdding}
                onClick={handleAddToCart}
              >
                <ShoppingBag className="h-5 w-5 mr-3" />
                {isAddToCartDisabled
                  ? selectedSizeOption?.stock === 0
                    ? "Out of Stock"
                    : "Select Options"
                  : isAdding
                  ? "Adding..."
                  : "Add to Cart"}
              </Button>
            </div>

            <div className="mt-10">
              <Accordion
                type="single"
                collapsible
                defaultValue="description"
                className="w-full"
              >
                <AccordionItem value="description">
                  <AccordionTrigger>Description</AccordionTrigger>
                  <AccordionContent className="text-base text-neutral-700 leading-relaxed whitespace-pre-line">
                    {product.description || "No description available."}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="shipping">
                  <AccordionTrigger>Shipping & Returns</AccordionTrigger>
                  <AccordionContent className="text-base text-neutral-700 leading-relaxed">
                    Complimentary shipping on all orders. Returns are accepted
                    within 30 days of purchase.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
