// src/features/products/constants.ts

export const CATEGORIES = [
    { name: "Women", subcategories: ["Shoes", "Ready-to-Wear", "Bags", "Silk", "Belts"] },
    { name: "Men", subcategories: ["Shoes", "Ready-to-Wear", "Ties", "Hats"] },
    { name: "Home, Outdoor and Equestrian", subcategories: ["Furniture", "Outdoor", "Equestrian"] }
];

export const SIZES = ["XS", "S", "M", "L", "XL"];

export const SORT_OPTIONS = [
    { value: "-createdAt", label: "Newest" },
    { value: "createdAt", label: "Oldest" },
    { value: "price", label: "Price: Low to High" },
    { value: "-price", label: "Price: High to Low" },
];

export const MAX_PRICE = 2500;