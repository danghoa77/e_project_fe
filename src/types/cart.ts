
export interface Cart {
    items: CartItem[];
}


export type CartItem = {
    productId: string;
    name: string;
    imageUrl: string;
    variantId: string;
    quantity: number;
    price: number;
    size: string;
    color: string;
};

export type CartResponse = {
    userId: string;
    items: CartItem[];
};