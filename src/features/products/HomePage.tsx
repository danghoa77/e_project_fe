// src/features/products/HomePage.tsx
import { Button } from "@/components/ui/button";

const editorialProducts = [
    {
        id: 'p4',
        name: 'The Kaki Bomber Jacket',
        category: 'Outerwear',
        price: 95,
        image: 'https://placehold.co/800x1000/EAE7E2/333?text=Look+1',
        description: 'Crafted from premium kaki fabric, this jacket is the definition of timeless elegance and modern form.'
    },
    {
        id: 'p2',
        name: 'The Relaxed Fit Jeans',
        category: 'Denim Collection',
        price: 79,
        image: 'https://placehold.co/800x1000/D9D9D9/333?text=Look+2',
        description: 'A comfortable silhouette and durable denim make this an indispensable piece for any wardrobe.'
    },
    {
        id: 'p1',
        name: 'The Knit Crewneck T-Shirt',
        category: 'Daily Essentials',
        price: 35,
        image: 'https://placehold.co/600x750/F0F0F0/333?text=Knit+T-shirt',
    },
    {
        id: 'p3',
        name: 'The Silk Shirt',
        category: 'Workwear',
        price: 55,
        image: 'https://placehold.co/600x750/EBEBEB/333?text=Silk+Shirt',
    },
];

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

export const HomePage = () => {
    const mainLook = editorialProducts[0];
    const secondaryLook = editorialProducts[1];
    const essentialItems = editorialProducts.slice(2);

    return (
        <div className="bg-white text-neutral-800">
            <section className="container mx-auto px-4 py-16 sm:py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="text-left">
                        <p className="font-serif text-sm uppercase tracking-widest text-neutral-500">{mainLook.category}</p>
                        <h1 className="font-serif text-4xl sm:text-5xl mt-4 leading-tight">
                            {mainLook.name}
                        </h1>
                        <p className="mt-6 text-base text-neutral-600 max-w-md">
                            {mainLook.description}
                        </p>
                        <Button asChild variant="link" className="p-0 mt-8 text-sm uppercase tracking-widest text-neutral-800 hover:text-neutral-500 h-auto justify-start">
                            <a href="#">
                                Discover More
                            </a>
                        </Button>
                    </div>
                    <div className="order-first md:order-last">
                        <img src={mainLook.image} alt={mainLook.name} className="w-full h-auto object-cover" />
                    </div>
                </div>
            </section>

            <section className="bg-[#F7F7F7]">
                <div className="container mx-auto px-4 py-16 sm:py-24">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <img src={secondaryLook.image} alt={secondaryLook.name} className="w-full h-auto object-cover" />
                        </div>
                        <div className="text-left">
                            <p className="font-serif text-sm uppercase tracking-widest text-neutral-500">{secondaryLook.category}</p>
                            <h1 className="font-serif text-4xl sm:text-5xl mt-4 leading-tight">
                                {secondaryLook.name}
                            </h1>
                            <p className="mt-6 text-base text-neutral-600 max-w-md">
                                {secondaryLook.description}
                            </p>
                            <Button asChild variant="link" className="p-0 mt-8 text-sm uppercase tracking-widest text-neutral-800 hover:text-neutral-500 h-auto justify-start">
                                <a href="#">
                                    Explore Details
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="container mx-auto px-4 py-16 sm:py-24">
                <div className="text-center mb-12">
                    <h2 className="font-serif text-3xl sm:text-4xl">The Essentials</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {essentialItems.map(item => (
                        <div key={item.id} className="text-left">
                            <img src={item.image} alt={item.name} className="w-full h-auto object-cover mb-4" />
                            <h3 className="font-serif text-xl">{item.name}</h3>
                            <p className="text-neutral-600 mt-1">{formatCurrency(item.price)}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="bg-white py-16 sm:py-24">
                <div className="container mx-auto px-4 text-center max-w-3xl">
                    <h2 className="font-serif text-3xl sm:text-4xl">The Art of Craft</h2>
                    <p className="mt-6 text-base text-neutral-600 leading-relaxed">
                        Each product is a work of art, created by the hands of the most skilled artisans with a commitment to exceptional quality and sustainability. We believe true beauty lies in the finest details and in value that lasts a lifetime.
                    </p>
                </div>
            </section>
        </div>
    )
}
