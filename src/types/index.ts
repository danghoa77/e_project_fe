// src/types/index.ts
export type UserRole = 'admin' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  addresses?: Address[];
}

export interface Address {
  street: string;
  city: string;
  isDefault?: boolean;
}


export type CartItem = {
  productId: string;
  variantId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
};

export type Cart = {
  items: CartItem[];
};


export type ProductVariant = {
  color: string;
  price: number;
  salePrice?: number;
  size: string;
  stock: number;
};

export type Product = {
  _id: string;
  name: string;
  category: string;
  images: string[];
  variants: ProductVariant[];
  createdAt: string;
};

export type FilterState = {
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


export type HeroVideoSectionData = { type: 'heroVideo'; props: { videoSrc: string; }; };
export type SloganSectionData = { type: 'slogan'; props: { title: string; subtitle: string; }; };
export type ProductGridSectionData = { type: 'productGrid'; props: { products: { id: number; name: string; image: string; }[]; }; };
export type HeadlineSectionData = { type: 'headline'; props: { title: string; subtitle: string; buttonText: string; buttonLink: string; }; };
export type FullWidthImageSectionData = { type: 'fullWidthImage'; props: { imageUrl: string; altText: string; }; };
export type EditorialProductGridSectionData = { type: 'editorialProductGrid'; props: { products: { id: number; name: string; price: number; image: string; }[]; }; };

export type PageSectionData =
  | HeroVideoSectionData
  | SloganSectionData
  | ProductGridSectionData
  | HeadlineSectionData
  | FullWidthImageSectionData
  | EditorialProductGridSectionData;

