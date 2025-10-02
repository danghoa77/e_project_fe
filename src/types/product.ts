// src/types/product.ts
export interface Rating {
  _id: string;
  userId: string;
  userName: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Image {
  url: string;
  cloudinaryId: string;
}

export interface ReqImage {
  file: File[];
}

export interface SizeOption {
  _id: string;
  size: string;
  price: number;
  salePrice: number;
  stock: number;
}

export interface ColorVariant {
  _id: string;
  color: string;
  sizes: SizeOption[];
}

export interface ResProduct {
  _id: string;
  name: string;
  description: string;
  category: Category;
  images: Image[];
  variants: ColorVariant[];
  ratings: Rating[];
  averageRating: number;
  numReviews: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReqProduct {
  name: string;
  description: string;
  category: string;
  variants: ColorVariant[];
  images: ReqImage[];
}

export interface FilterState {
  page: number;
  limit: number;
  category?: string;
  sortBy?: string;
  size?: string[];
  price?: {
    min: number;
    max: number;
  };
}

export interface Category {
  _id: string;
  name: string;
}

export interface GetProductsResponse {
  products: ResProduct[];
  total: number;
}


export interface UpdateSizeDto {
  _id?: string;
  size: string;
  price: number;
  salePrice: number;
  stock: number;
}

export interface UpdateVariantDto {
  _id?: string;
  color: string;
  sizes: UpdateSizeDto[];
}
export interface UpdateImageDto {
  url?: string;
  cloudinaryId?: string;
}

export interface UpdateProductDto {
  name?: string;
  images?: UpdateImageDto[];
  description?: string;
  category?: string;
  variants?: UpdateVariantDto[];
  deletedImages?: string[];
  deletedVariants?: string[];
  deletedSizes?: string[];
}
