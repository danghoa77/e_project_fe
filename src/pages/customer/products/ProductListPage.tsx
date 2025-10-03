import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import type { ResProduct } from "@/types/product";
import { SORT_OPTIONS } from "./constants";
import { ProductCard } from "./components/ProductCard";
import { FilterSidebar } from "./components/FilterSidebar";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Loader2, Filter, XCircle, ChevronLeft } from "lucide-react";
import { customerApi } from "../api";
import { useProductStore } from "@/store/productStore";

export const ProductListPage = () => {
  const [products, setProducts] = useState<ResProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 9;

  const { filters, setFilters, category: categories } = useProductStore();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await customerApi.fetchProducts({
          page,
          limit,
          ...filters,
        });
        setProducts(response.products);
        setTotal(response.total);
      } catch (err) {
        setError("Could not load products at this time.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters, page]);

  const handleFilterChange = (
    newFilters: Partial<Omit<typeof filters, "page" | "limit">>
  ) => {
    setPage(1);
    setFilters(newFilters);
  };

  const categoryName = filters.category
    ? categories.find((c) => c._id === filters.category)?.name || "Products"
    : "All Products";

  if (error) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center text-center">
        <XCircle className="h-12 w-12 mb-4 text-red-500" />
        <h3 className="font-serif text-2xl text-neutral-700">
          Failed to load products
        </h3>
        <p className="max-w-xs mt-2 text-neutral-500">
          There was an error fetching products. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#F7F2EC] font-sans">
      <div className="container mx-auto px-8 py-12 md:py-16">
        <div className="mb-8">
          <Button
            asChild
            variant="link"
            className="p-0 text-neutral-600 hover:text-black"
          >
            <Link to="/">
              <ChevronLeft className="h-4 w-4 mr-2" /> Back to Home
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="hidden lg:block lg:col-span-1">
            <FilterSidebar
              onFilterChange={handleFilterChange}
              currentFilters={filters}
              categories={categories}
            />
          </aside>

          <main className="col-span-1 lg:col-span-3">
            <div className="flex justify-between items-center mb-8">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="lg:hidden rounded-full bg-white"
                  >
                    <Filter className="mr-2 h-4 w-4" /> Filters
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-[300px] sm:w-[400px] p-6 overflow-y-auto bg-[#fcf7f1]"
                >
                  <FilterSidebar
                    onFilterChange={handleFilterChange}
                    currentFilters={filters}
                    categories={categories}
                  />
                </SheetContent>
              </Sheet>

              <div className="hidden lg:block">
                <h1 className="font-sans text-4xl capitalize">
                  {categoryName}
                </h1>
                {!loading && (
                  <p className="text-neutral-600 mt-2 text-left">
                    {total} products
                  </p>
                )}
              </div>
              <div className="w-[180px] ">
                <Select
                  value={filters.sortBy}
                  onValueChange={(value) =>
                    handleFilterChange({ sortBy: value })
                  }
                >
                  <SelectTrigger className="rounded-full bg-white">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {SORT_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-neutral-500" />
              </div>
            ) : products.length > 0 ? (
              <div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
                <div className="flex justify-center mt-10 gap-2">
                  {Array.from({ length: Math.ceil(total / limit) }).map(
                    (_, i) => (
                      <Button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        variant={page === i + 1 ? "default" : "outline"}
                        className="rounded-full bg-orange-300"
                      >
                        {i + 1}
                      </Button>
                    )
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-96 text-center text-neutral-500">
                <XCircle className="h-12 w-12 mb-4" />
                <h3 className="font-semibold text-lg">No Products Found</h3>
                <p className="max-w-xs">
                  There are no products that match your current filters.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
