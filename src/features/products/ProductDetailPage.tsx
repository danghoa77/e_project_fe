// src/features/products/ProductDetailPage.tsx
import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";


type ProductVariantDetail = {
    price: number;
    salePrice?: number;
    colors: string[];
    sizes: string[];
};

type ProductDetail = {
    _id: string;
    name: string;
    description: string;
    rating: number;
    images: string[];
    variants: ProductVariantDetail[];
};

type Review = {
    id: string;
    author: string;
    rating: number;
    comment: string;
    date: string;
};



const mockProducts: ProductDetail[] = Array.from({ length: 35 }, (_, i) => ({
    _id: `product_${i + 1}`, name: `Elegant Product ${i + 1}`,
    description: "This is a timeless piece, crafted with the finest materials and attention to detail. It embodies both modern elegance and classic style, perfect for any occasion.",
    rating: Math.floor(Math.random() * 20) / 10 + 3,
    images: [`https://placehold.co/800x1000/F0EBE5/333?text=Product+${i + 1}`, `https://placehold.co/800x1000/EAE7E2/333?text=Side+View`, `https://placehold.co/800x1000/F0EBE5/333?text=Detail+Shot`],
    variants: [{ price: Math.floor(Math.random() * 1000) + 100, salePrice: i % 3 === 0 ? Math.floor(Math.random() * 500) + 50 : undefined, colors: ["Beige", "Black", "Ivory"], sizes: ["S", "M", "L", "XL"] }]
}));

const mockReviews: Review[] = Array.from({ length: 20 }, (_, i) => ({
    id: `review_${i}`, author: `Customer ${i + 1}`, rating: Math.floor(Math.random() * 3) + 3,
    comment: "This product exceeded my expectations! The quality is superb and it looks even better in person. Highly recommended.",
    date: new Date(Date.now() - i * 1000 * 60 * 60 * 24 * 5).toLocaleDateString(),
}));




const StarRating = ({ rating, maxStars = 5 }: { rating: number, maxStars?: number }) => (
    <div className="flex items-center gap-1">{Array.from({ length: maxStars }, (_, i) => (<Star key={i} className={`h-4 w-4 ${i < Math.round(rating) ? 'text-black fill-black' : 'text-neutral-300'}`} />))}</div>
);

const InteractiveStarRating = ({ rating, setRating, maxStars = 5 }: { rating: number, setRating: (rating: number) => void, maxStars?: number }) => {
    const [hoverRating, setHoverRating] = React.useState(0);
    return (<div className="flex items-center gap-1">{Array.from({ length: maxStars }, (_, i) => { const starValue = i + 1; return (<button type="button" key={i} onClick={() => setRating(starValue)} onMouseEnter={() => setHoverRating(starValue)} onMouseLeave={() => setHoverRating(0)}><Star className={cn("h-5 w-5 transition-colors cursor-pointer", starValue <= (hoverRating || rating) ? 'text-black fill-black' : 'text-neutral-300')} /></button>); })}</div>);
};

const ProductImageGallery = ({ images }: { images: string[] }) => {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length);
    const prevImage = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    return (<div className="relative w-full aspect-[4/5] bg-gray-100"><img src={images[currentIndex]} alt={`Product image ${currentIndex + 1}`} className="w-full h-full object-cover" />{images.length > 1 && (<><Button onClick={prevImage} variant="ghost" size="icon" className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/50 hover:bg-white/80"><ChevronLeft className="h-5 w-5" /></Button><Button onClick={nextImage} variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/50 hover:bg-white/80"><ChevronRight className="h-5 w-5" /></Button></>)}</div>);
};


const ProductInfo = ({ product }: { product: ProductDetail }) => {
    const [selectedColor, setSelectedColor] = React.useState(product.variants[0].colors[0]);
    const [selectedSize, setSelectedSize] = React.useState(product.variants[0].sizes[0]);
    const averageRating = mockReviews.reduce((acc, review) => acc + review.rating, 0) / mockReviews.length;
    return (<div className="flex flex-col h-full"><h1 className="font-serif text-3xl md:text-4xl">{product.name}</h1><div className="flex items-center gap-2 mt-3"><StarRating rating={averageRating} /><span className="text-sm text-neutral-500">({mockReviews.length} reviews)</span></div><div className="flex items-baseline gap-3 mt-4">{product.variants[0].salePrice ? (<><p className="font-serif text-2xl text-red-600">${product.variants[0].salePrice.toFixed(2)}</p><p className="font-serif text-xl text-neutral-500 line-through">${product.variants[0].price.toFixed(2)}</p></>) : (<p className="font-serif text-2xl text-neutral-800">${product.variants[0].price.toFixed(2)}</p>)}</div><p className="mt-6 text-sm text-neutral-600 leading-relaxed">{product.description}</p><Separator className="my-8" /><div><h3 className="text-sm font-semibold uppercase tracking-wider mb-3">Color: <span className="font-normal text-neutral-600 capitalize">{selectedColor}</span></h3><div className="flex gap-2">{product.variants[0].colors.map((color: string) => (<button key={color} onClick={() => setSelectedColor(color)} className={cn('h-8 w-8 rounded-full border-2 transition-all', selectedColor === color ? 'border-black scale-110' : 'border-neutral-200')} style={{ backgroundColor: color.toLowerCase() }} />))}</div></div><div className="mt-8"><h3 className="text-sm font-semibold uppercase tracking-wider mb-3">Size: <span className="font-normal text-neutral-600">{selectedSize}</span></h3><div className="flex gap-2">{product.variants[0].sizes.map((size: string) => (<Button key={size} variant="outline" onClick={() => setSelectedSize(size)} className={cn("rounded-none w-12 h-12", selectedSize === size && "border-2 border-black bg-neutral-100")}>{size}</Button>))}</div></div><div className="mt-8"><Button size="lg" className="w-full rounded-none bg-black text-white hover:bg-neutral-800 h-12 text-sm uppercase tracking-wider">Add to Cart</Button></div></div>);
};

const ReviewForm = () => {
    const [rating, setRating] = React.useState(0);
    const [comment, setComment] = React.useState("");
    const [error, setError] = React.useState<string | null>(null);
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); const userId = 'user_123'; if (rating === 0 || !comment.trim()) { setError("Please provide a rating and a comment."); return; } const reviewData = { userId, rating, comment }; console.log("Submitting review:", reviewData); toast.success("Review Submitted!", { description: "Thank you for your valuable feedback.", duration: 3000 }); setRating(0); setComment(""); };
    return (<><form onSubmit={handleSubmit} className="max-w-2xl mx-auto text-left"><h3 className="font-semibold text-lg mb-4">Leave a Review</h3><div className="space-y-4"><div><p className="text-sm mb-2">Your rating</p><InteractiveStarRating rating={rating} setRating={setRating} /></div><Textarea placeholder="Write your comment..." value={comment} onChange={(e) => setComment(e.target.value)} /><Button type="submit" className="rounded-none bg-black text-white hover:bg-neutral-800">Submit Review</Button></div></form><AlertDialog open={!!error} onOpenChange={() => setError(null)}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Incomplete Submission</AlertDialogTitle><AlertDialogDescription>{error}</AlertDialogDescription></AlertDialogHeader><AlertDialogAction>OK</AlertDialogAction></AlertDialogContent></AlertDialog></>);
};


const ReviewsSection = ({ reviews }: { reviews: Review[] }) => {
    const INITIAL_COUNT = 5;
    const [visibleCount, setVisibleCount] = React.useState(INITIAL_COUNT);
    const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
    const allReviewsShown = visibleCount >= reviews.length;
    const handleToggleReviews = () => { if (allReviewsShown) { setVisibleCount(INITIAL_COUNT); } else { setVisibleCount(reviews.length); } };
    return (<div className="container mx-auto px-4 py-16"><Accordion type="single" collapsible className="w-full"><AccordionItem value="reviews"><AccordionTrigger className="hover:no-underline [&>svg]:mr-2"><div className="flex justify-start items-center w-full gap-4"><h2 className="font-semibold text-lg">Reviews ({reviews.length})</h2><StarRating rating={averageRating} /></div></AccordionTrigger><AccordionContent className="pt-8"><div className="space-y-8 max-w-3xl mx-auto text-left">{reviews.slice(0, visibleCount).map(review => (<div key={review.id}><div className="flex items-center gap-4"><div className="font-semibold">{review.author}</div><StarRating rating={review.rating} /></div><p className="text-sm text-neutral-600 mt-2">{review.comment}</p></div>))}</div>{reviews.length > INITIAL_COUNT && (<div className="text-center mt-12"><Button onClick={handleToggleReviews} variant="outline" className="rounded-full px-8">{allReviewsShown ? "Show Less" : "Show More"}</Button></div>)}<Separator className="my-12" /><ReviewForm /></AccordionContent></AccordionItem></Accordion></div>);
}


export const ProductDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = React.useState<ProductDetail | null>(null);
    const navigate = useNavigate();

    React.useEffect(() => {
        const foundProduct = mockProducts.find(p => p._id === id);
        setProduct(foundProduct || null);
        window.scrollTo(0, 0);
    }, [id]);

    if (!product) { return <div>Loading...</div>; }

    return (
        <div className="font-sans bg-[#F7F2EC]">
            <div className="container mx-auto px-4 py-12">
                <div className="mb-8"><Button onClick={() => navigate(-1)} variant="link" className="p-0 text-neutral-600 hover:text-black"><ChevronLeft className="h-4 w-4 mr-2" />Back to products</Button></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
                    <div><ProductImageGallery images={product.images} /></div>
                    <div><ProductInfo product={product} /></div>
                </div>
            </div>
            <Separator />
            <ReviewsSection reviews={mockReviews} />
        </div>
    );
};