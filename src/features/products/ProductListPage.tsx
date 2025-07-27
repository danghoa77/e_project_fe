// src/features/products/ProductListPage.tsx
import * as React from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Loader2, Filter, XCircle, ChevronLeft } from "lucide-react";

const categories = [
    { name: "Women", subcategories: ["Shoes", "Ready-to-Wear", "Bags", "Silk", "Belts"] },
    { name: "Men", subcategories: ["Shoes", "Ready-to-Wear", "Ties", "Hats"] },
    { name: "Home, Outdoor and Equestrian", subcategories: ["Furniture", "Outdoor", "Equestrian"] }
];
const sizes = ["XS", "S", "M", "L", "XL"];
const sortOptions = [
    { value: "-createdAt", label: "Newest" },
    { value: "price", label: "Price: Low to High" },
    { value: "-price", label: "Price: High to Low" },
];

type ProductVariant = {
    color: string;
    price: number;
    salePrice?: number;
    size: string;
    stock: number;
};

type Product = {
    _id: string;
    name: string;
    category: string;
    images: string[];
    variants: ProductVariant[];
    createdAt: string;
};

type FilterState = {
    page: number;
    limit: number;
    category?: string;
    sortBy?: string;
    size?: string;
    price?: {
        min: number;
        max: number;
    };
};

const MAX_PRICE = 2500;

const mockProducts: Product[] = Array.from({ length: 35 }, (_, i) => {
    const categoryData = categories[i % categories.length];
    const subcategory = categoryData.subcategories[i % categoryData.subcategories.length].toLowerCase().replace(/\s+/g, '-');
    const price = Math.floor(Math.random() * (MAX_PRICE / 10)) * 10 + 50;

    return {
        _id: `product_${i + 1}`,
        name: `${categoryData.name} Product ${i + 1}`,
        category: subcategory,
        images: [`https://placehold.co/800x1000/F0EBE5/333?text=Product+${i + 1}`],
        createdAt: new Date(Date.now() - i * 1000 * 60 * 60 * 24).toISOString(),
        variants: [{ color: 'Beige', price: price, salePrice: i % 4 === 0 ? price * 0.8 : undefined, size: sizes[i % sizes.length], stock: Math.floor(Math.random() * 50) }],
    };
});

const fetchMockProducts = async (filters: FilterState): Promise<{ products: Product[]; total: number }> => {
    let filtered = [...mockProducts];
    if (filters.category) filtered = filtered.filter(p => p.category === filters.category);
    if (filters.price) filtered = filtered.filter(p => {
        const price = p.variants[0].salePrice || p.variants[0].price;
        return price >= filters.price!.min && price <= filters.price!.max;
    });
    if (filters.size) filtered = filtered.filter(p => p.variants[0].size === filters.size);
    if (filters.sortBy) {
        const key = filters.sortBy.replace('-', '');
        const order = filters.sortBy.startsWith('-') ? -1 : 1;
        filtered.sort((a, b) => {
            let valA, valB;
            if (key === 'price') {
                valA = a.variants[0].salePrice || a.variants[0].price;
                valB = b.variants[0].salePrice || b.variants[0].price;
            } else {
                valA = new Date(a.createdAt).getTime();
                valB = new Date(b.createdAt).getTime();
            }
            if (valA < valB) return -1 * order;
            if (valA > valB) return 1 * order;
            return 0;
        });
    }
    const total = filtered.length;
    const paginated = filtered.slice((filters.page - 1) * filters.limit, filters.page * filters.limit);
    return new Promise(resolve => setTimeout(() => resolve({ products: paginated, total }), 500));
};

const ProductCard = ({ product }: { product: Product }) => {
    const displayVariant = product.variants[0];
    return (
        <Link to={`/product/${product._id}`} className="group text-left">
            <div className="overflow-hidden bg-gray-100">
                <img src={product.images[0]} alt={product.name} className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300" />
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
                {displayVariant.stock < 10 && displayVariant.stock > 0 && <p className="text-xs text-amber-600 mt-1">Low in stock</p>}
                {displayVariant.stock === 0 && <p className="text-xs text-red-600 mt-1">Out of stock</p>}
            </div>
        </Link>
    );
};

const ProductGrid = ({ products, isLoading, loadMore, hasMore }: { products: Product[], isLoading: boolean, loadMore: () => void, hasMore: boolean }) => {
    if (!isLoading && products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-96 text-center text-neutral-500">
                <XCircle className="h-12 w-12 mb-4" />
                <h3 className="font-semibold text-lg">No Products Found</h3>
                <p className="max-w-xs">There are no products that match your current filters. Try adjusting your selection.</p>
            </div>
        );
    }
    return (
        <div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12">
                {products.map(product => <ProductCard key={product._id} product={product} />)}
            </div>
            {hasMore && (
                <div className="text-center mt-12">
                    <Button onClick={loadMore} disabled={isLoading} variant="outline" className="rounded-full px-8">
                        {isLoading && products.length > 0 ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Load More"}
                    </Button>
                </div>
            )}
        </div>
    );
};

const FilterSidebar = ({ onFilterChange }: { onFilterChange: (filters: Partial<FilterState>) => void }) => {
    const [priceRange, setPriceRange] = React.useState([0, MAX_PRICE]);
    const handleFilter = (key: keyof FilterState, value: any) => onFilterChange({ [key]: value, page: 1 });
    const handleSizeChange = (checked: boolean, size: string) => onFilterChange({ size: checked ? size : undefined, page: 1 });
    return (
        <div className="space-y-8">
            <div>
                <h3 className="font-semibold uppercase tracking-wider mb-4">Categories</h3>
                <Accordion type="multiple" className="w-full">
                    {categories.map(cat => (
                        <AccordionItem value={cat.name} key={cat.name}>
                            <AccordionTrigger>{cat.name}</AccordionTrigger>
                            <AccordionContent>
                                <ul className="space-y-2 pl-2">
                                    {cat.subcategories.map(sub => (
                                        <li key={sub}>
                                            <button
                                                onClick={() => handleFilter('category', sub.toLowerCase().replace(/\s+/g, '-'))}
                                                className="text-sm text-neutral-600 hover:text-neutral-900"
                                            >
                                                {sub}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
            <div>
                <h3 className="font-semibold uppercase tracking-wider mb-4">Price</h3>
                <Slider
                    defaultValue={[0, MAX_PRICE]}
                    max={MAX_PRICE}
                    step={10}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    onValueCommit={(value) => handleFilter('price', { min: value[0], max: value[1] })}
                />
                <div className="flex justify-between text-sm text-neutral-600 mt-2">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                </div>
            </div>
            <div>
                <h3 className="font-semibold uppercase tracking-wider mb-4">Size</h3>
                <div className="space-y-3">
                    {sizes.map(size => (
                        <div key={size} className="flex items-center space-x-2">
                            <Checkbox id={size} onCheckedChange={(checked) => handleSizeChange(Boolean(checked), size)} />
                            <label htmlFor={size} className="text-sm">{size}</label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const ProductListPage = () => {
    const { category: initialCategory } = useParams();
    const [products, setProducts] = React.useState<Product[]>([]);
    const [filters, setFilters] = React.useState<FilterState>({ page: 1, limit: 9, category: initialCategory });
    const [total, setTotal] = React.useState(0);
    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const data = await fetchMockProducts(filters);
                if (filters.page === 1) setProducts(data.products || []);
                else setProducts(prev => [...prev, ...(data.products || [])]);
                setTotal(data.total || 0);
            } catch (error) {
                console.error("Failed to fetch products:", error);
                setProducts([]);
                setTotal(0);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, [filters]);

    const handleFilterChange = (newFilters: Partial<FilterState>) => setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
    const loadMore = () => setFilters(prev => ({ ...prev, page: prev.page + 1 }));

    const hasMore = products.length < total;

    return (
        <div className="bg-[#F7F2EC] font-sans">
            <div className="container mx-auto px-8 py-12 md:py-16">
                <div className="mb-8">
                    <Button asChild variant="link" className="p-0 text-neutral-600 hover:text-black">
                        <Link to="/">
                            <ChevronLeft className="h-4 w-4 mr-2" />
                            Back to Home
                        </Link>
                    </Button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <aside className="hidden lg:block lg:col-span-1">
                        <FilterSidebar onFilterChange={handleFilterChange} />
                    </aside>
                    <main className="col-span-1 lg:col-span-3">
                        <div className="flex justify-between items-center mb-8">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="outline" className="lg:hidden rounded-full">
                                        <Filter className="mr-2 h-4 w-4" /> Filters
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-[300px] sm:w-[400px] p-6 overflow-y-auto bg-[#fcf7f1]">
                                    <FilterSidebar onFilterChange={handleFilterChange} />
                                </SheetContent>
                            </Sheet>
                            <div className="w-[180px] ml-auto">
                                <Select onValueChange={(value) => handleFilterChange({ sortBy: value })}>
                                    <SelectTrigger className="rounded-full"><SelectValue placeholder="Sort by" /></SelectTrigger>
                                    <SelectContent>
                                        {sortOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        {isLoading && products.length === 0 ? (
                            <div className="flex justify-center items-center h-96"><Loader2 className="h-8 w-8 animate-spin" /></div>
                        ) : (
                            <ProductGrid products={products} isLoading={isLoading} loadMore={loadMore} hasMore={hasMore} />
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};
