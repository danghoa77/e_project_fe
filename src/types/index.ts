export interface HeroVideoSectionData {
    type: 'heroVideo';
    props: {
        videoSrc: string;
    };
}

export interface SloganSectionData {
    type: 'slogan';
    props: {
        title: string;
        subtitle: string;
    };
}

export interface ProductGridSectionData {
    type: 'productGrid';
    props: {
        products: {
            id: number;
            name: string;
            image: string;
        }[];
    };
}

export interface HeadlineSectionData {
    type: 'headline';
    props: {
        title: string;
        subtitle: string;
        buttonText: string;
        buttonLink: string;
    };
}

export interface FullWidthImageSectionData {
    type: 'fullWidthImage';
    props: {
        imageUrl: string;
        altText: string;
    };
}

export interface EditorialProductGridSectionData {
    type: 'editorialProductGrid';
    props: {
        products: {
            id: number;
            name: string;
            price: number;
            image: string;
        }[];
    };
}

// ✅ Cái này mới đúng
export type PageSectionData =
    | HeroVideoSectionData
    | SloganSectionData
    | ProductGridSectionData
    | HeadlineSectionData
    | FullWidthImageSectionData
    | EditorialProductGridSectionData;
