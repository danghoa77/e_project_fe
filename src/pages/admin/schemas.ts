import { z } from "zod";

// ✅ Schema cho ảnh
const imageSchema = z.object({
  url: z.string().min(1, "Image URL is required."),
  cloudinaryId: z.string().min(1, "Cloudinary ID is required."),
});


const variantSchema = z.object({
  size: z.string().min(1, "Size must not be empty."),
  color: z.string().min(1, "Color must not be empty."),
  price: z.number().min(0, "Price cannot be negative."),
  salePrice: z.number().min(0, "Sale price cannot be negative.").optional(),
  stock: z.number().min(0, "Stock quantity cannot be negative."),
});


export const productSchema = z.object({
  name: z.string().min(1, "Product name must not be empty."),
  category: z.string().min(1, "Category must not be empty."),
  images: z
    .array(imageSchema)
    .nonempty("Images array must not be empty.")
    .optional(),
  variants: z.array(variantSchema).min(1, "At least one variant is required."),
});


export const updateProductSchema = productSchema.partial();
