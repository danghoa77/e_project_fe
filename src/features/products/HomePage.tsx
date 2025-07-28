// src/features/products/HomePage.tsx
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import type { PageSectionData, HeroVideoSectionData, SloganSectionData, ProductGridSectionData, HeadlineSectionData, EditorialProductGridSectionData, FullWidthImageSectionData } from '@/types';

const topGridProducts = [
    { id: 1, name: "TIES", image: 'https://res.cloudinary.com/dzskttedu/image/upload/v1753603541/274201T_2001_flat_wm_1_rluqfj.jpg' },
    { id: 2, name: "MEN'S SILK", image: 'https://res.cloudinary.com/dzskttedu/image/upload/v1753603505/284200T_2002_worn_1_kj8zpp.jpg' },
    { id: 3, name: "WOMEN'S BELTS", image: 'https://res.cloudinary.com/dzskttedu/image/upload/v1753603891/011749UCAB_front_wm_1_loyemv.jpg' },
    { id: 4, name: "WOMEN'S READY-TO-WEAR", image: 'https://res.cloudinary.com/dzskttedu/image/upload/v1753603878/5H3617DH91_worn_3_b191yc.jpg' },
    { id: 5, name: "HATS", image: 'https://res.cloudinary.com/dzskttedu/image/upload/v1753603450/251051N_20S157_bk0n68.jpg' },
    { id: 6, name: "WOMENT'S SILK", image: 'https://res.cloudinary.com/dzskttedu/image/upload/v1753603496/064205S_2010_worn_1_udagh5.jpg' },
    { id: 7, name: "GAMES AND OUTDOOR", image: 'https://res.cloudinary.com/dzskttedu/image/upload/v1753603426/0009957_2019_back_wm_4_dkoswj.jpg' },
    { id: 8, name: "MEN'S SHOES", image: 'https://res.cloudinary.com/dzskttedu/image/upload/v1753603858/252863ZHVD_front_wm_1_jakn4f.jpg' },
];
const bottomGridProducts = [
    { id: 9, name: "Carré 90 Silk Twilly", price: 480, image: 'https://res.cloudinary.com/dzskttedu/image/upload/v1753603514/004211S_2005_flat_wm_3_opbqew.jpg' },
    { id: 10, name: "Portrait in Red", price: 330, image: 'https://res.cloudinary.com/dzskttedu/image/upload/v1753604412/310911M_2001_wornsquare_1_zfo5vo.jpg' },
    { id: 11, name: "The Geometric Square", price: 250, image: 'https://res.cloudinary.com/dzskttedu/image/upload/v1753604415/103907M_2004_front_wm_1_hqy1gd.jpg' },
    { id: 12, name: "A Dash of Blue", price: 120, image: 'https://res.cloudinary.com/dzskttedu/image/upload/v1753604400/311474M_2001_wornsquare_1_mc1kqk.jpg' },
];

const formatCurrency = (amount: number) => {
    if (amount === 0) return '';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);
};



const HeroVideoSection = (props: HeroVideoSectionData['props']) => (
    <section className="w-full">
        <video src={props.videoSrc} className="w-full h-auto object-cover" autoPlay loop muted playsInline controls={false} />
    </section>
);
const SloganSection = (props: SloganSectionData['props']) => (
    <section className="container mx-auto px-4 py-16 md:py-20 text-center">
        <h2 className="text-2xl md:text-3xl uppercase tracking-[0.2em] text-neutral-800">{props.title}</h2>
        <p className="mt-5 text-base text-neutral-600 max-w-2xl mx-auto font-serif leading-relaxed">{props.subtitle}</p>
    </section>
);
const ProductGridSection = (props: ProductGridSectionData['props']) => (
    <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-8">
            {props.products.map(item => (
                <div key={item.id} className="text-left">
                    <img src={item.image} alt={item.name} className="w-full h-auto object-cover mb-3" />
                    <h3 className="text-xs text-neutral-700 uppercase tracking-wider">{item.name}</h3>
                </div>
            ))}
        </div>
    </section>
);
const HeadlineSection = (props: HeadlineSectionData['props']) => (
    <section className="container mx-auto px-4 py-12 md:py-16 text-center">
        <h2 className="font-serif text-3xl md:text-4xl uppercase tracking-wider">{props.title}</h2>
        <p className="mt-4 text-sm text-neutral-600 max-w-2xl mx-auto">{props.subtitle}</p>
        <Button asChild variant="link" className="p-0 mt-6 text-sm uppercase tracking-widest text-neutral-800 hover:text-neutral-500 h-auto">
            <Link to={props.buttonLink}>{props.buttonText}</Link>
        </Button>
    </section>
);
const FullWidthImageSection = (props: FullWidthImageSectionData['props']) => (
    <section className="w-full my-8">
        <img src={props.imageUrl} alt={props.altText} className="w-full h-auto object-cover" />
    </section>
);
const EditorialProductGridSection = (props: EditorialProductGridSectionData['props']) => (
    <section className="container mx-auto px-4 pt-12 pb-16 md:pb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {props.products.map(item => (
                <div key={item.id} className="text-left">
                    <img src={item.image} alt={item.name} className="w-full h-auto object-cover mb-4" />
                    <h3 className="font-semibold text-base">{item.name}</h3>
                    <p className="text-neutral-600 text-sm mt-1">{formatCurrency(item.price)}</p>
                </div>
            ))}
        </div>
    </section>
);


const pageData: PageSectionData[] = [
    { type: 'heroVideo', props: { videoSrc: 'https://res.cloudinary.com/dzskttedu/video/upload/v1753603101/Astonishing_orange_-_Herm%C3%A8s_tglwbm.mp4' } },
    { type: 'slogan', props: { title: "FLYING STEED", subtitle: "An equestrian case captures the image of a winged horse, and the myth of Pegasus rises from its ashes, once again." } },
    { type: 'productGrid', props: { products: topGridProducts } },
    { type: 'headline', props: { title: "Where there's silk, there's sunshine", subtitle: "A vibrant energy radiates from the Spring-Summer 2025 silk collection.", buttonText: "Discover the Collection", buttonLink: "/products" } },
    { type: 'fullWidthImage', props: { imageUrl: "https://res.cloudinary.com/dzskttedu/image/upload/v1753603320/imgi_138_P_169_SUMMERMOOD_U_M_wniouk.webp", altText: "Campaign" } },
    { type: 'headline', props: { title: "Gallop in style", subtitle: "Everything you need for the perfect equestrian outing, from signature silks to technical apparel.", buttonText: "Shop the selection", buttonLink: "#" } },
    { type: 'editorialProductGrid', props: { products: bottomGridProducts } }
];

export const HomePage = () => {
    const renderSection = (section: PageSectionData, index: number) => {
        switch (section.type) {
            case 'heroVideo':
                return <HeroVideoSection key={index} {...section.props} />;
            case 'slogan':
                return <SloganSection key={index} {...section.props} />;
            case 'productGrid':
                return <ProductGridSection key={index} {...section.props} />;
            case 'headline':
                return <HeadlineSection key={index} {...section.props} />;
            case 'fullWidthImage':
                return <FullWidthImageSection key={index} {...section.props} />;
            case 'editorialProductGrid':
                return <EditorialProductGridSection key={index} {...section.props} />;
            default:
                return null;
        }
    };

    return (
        <div className="bg-[#F7F2EC] text-neutral-800">
            {pageData.map((section, index) => renderSection(section, index))}
        </div>
    )
}