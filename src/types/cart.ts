export interface CartItem {
    productId: string;
    variantId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    size: string;
    color: string;
}

export interface Cart {
    items: CartItem[];
}
