export interface CloudinaryImage {
  url: string;
  cloudinaryId: string;
}
export type PreviewFile = {
  file: File;
  preview: string;
};
export interface ProductVariant {
  _id: string;
  size: string;
  color: string;
  price: number;
  salePrice?: number;
  stock: number;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  images: CloudinaryImage[];
  category: string;
  variants: ProductVariant[];
  // reviews: Review[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductApiResponse {
  products: Product[];
  total: number;
}

export interface FilterState {
  page: number;
  limit: number;
  category?: string;
  sortBy?: string;
  size?: string;
  price?: {
    min: number;
    max: number;
  };
}
export interface Review {
  _id: string;
  author: string;
  rating: number;
  comment: string;
  createdAt: string;
}
export interface CreateVariantDto extends Omit<ProductVariant, '_id'> { }

export interface CreateProductDto extends Omit<Product, '_id' | 'createdAt' | 'updatedAt' | 'variants'> {
  variants: CreateVariantDto[];
}

export type VariantForm = {
  size: string;
  color: string;
  price?: number;
  salePrice?: number;
  stock?: number;
};

export type UpdateProductDto = Partial<CreateProductDto>;
