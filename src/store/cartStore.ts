import { create } from 'zustand';
import type { Cart, CartItem } from '@/types/user';

interface CartState {
    cart: Cart;
    selectedItems: string[]; // Mảng chứa các variantId được chọn
    setCart: (cart: Cart) => void;
    addItem: (item: CartItem) => void;
    removeItem: (productId: string, variantId: string) => void;
    updateQuantity: (productId: string, variantId: string, quantity: number) => void;
    clearCart: () => void;
    toggleItemSelection: (variantId: string) => void;
    toggleSelectAll: () => void;
}

// Dữ liệu mẫu để test giao diện
const mockCart: Cart = {
    items: [
        {
            productId: 'p1',
            variantId: 'v1',
            name: 'The Knit Crewneck T-Shirt',
            image: 'https://placehold.co/100x120/F0F0F0/333?text=Knit+T-shirt',
            price: 35,
            quantity: 2,
            size: 'M',
            color: 'White'
        },
        {
            productId: 'p2',
            variantId: 'v2',
            name: 'The Relaxed Fit Jeans',
            image: 'https://placehold.co/100x120/EAE7E2/333?text=Jeans',
            price: 79,
            quantity: 1,
            size: '30',
            color: 'Blue'
        },
        {
            productId: 'p3',
            variantId: 'v3',
            name: 'Classic Leather Sneakers',
            image: 'https://placehold.co/100x120/FFFFFF/333?text=Sneakers',
            price: 120,
            quantity: 1,
            size: '42',
            color: 'White'
        },
        {
            productId: 'p4',
            variantId: 'v4',
            name: 'Oversized Hoodie',
            image: 'https://placehold.co/100x120/DDDDDD/333?text=Hoodie',
            price: 60,
            quantity: 1,
            size: 'L',
            color: 'Black'
        },
        {
            productId: 'p5',
            variantId: 'v5',
            name: 'Slim Fit Chinos',
            image: 'https://placehold.co/100x120/F5F5F5/333?text=Chinos',
            price: 50,
            quantity: 2,
            size: '32',
            color: 'Khaki'
        },
        {
            productId: 'p6',
            variantId: 'v6',
            name: 'Cotton Baseball Cap',
            image: 'https://placehold.co/100x120/CCCCCC/333?text=Cap',
            price: 25,
            quantity: 1,
            size: 'One Size',
            color: 'Navy'
        },
        {
            productId: 'p7',
            variantId: 'v7',
            name: 'Wool Blend Scarf',
            image: 'https://placehold.co/100x120/EEEEEE/333?text=Scarf',
            price: 30,
            quantity: 1,
            size: 'One Size',
            color: 'Gray'
        }
    ]
};
export const useCartStore = create<CartState>((set) => ({
    cart: mockCart,
    selectedItems: [], // Ban đầu không có sản phẩm nào được chọn

    setCart: (cart) => set({ cart }),

    addItem: (newItem) => set((state) => {
        // TODO: Gọi API thêm sản phẩm ở đây
        const existingItem = state.cart.items.find(
            (item) => item.productId === newItem.productId && item.variantId === newItem.variantId
        );
        if (existingItem) {
            const updatedItems = state.cart.items.map(item =>
                item.variantId === newItem.variantId
                    ? { ...item, quantity: item.quantity + newItem.quantity }
                    : item
            );
            return { cart: { ...state.cart, items: updatedItems } };
        }
        return { cart: { ...state.cart, items: [...state.cart.items, newItem] } };
    }),

    removeItem: (productId, variantId) => set((state) => {
        // TODO: Gọi API xóa sản phẩm ở đây
        const updatedItems = state.cart.items.filter(item =>
            !(item.productId === productId && item.variantId === variantId)
        );
        return { cart: { ...state.cart, items: updatedItems } };
    }),

    updateQuantity: (productId, variantId, quantity) => set((state) => {
        // TODO: Gọi API cập nhật số lượng ở đây
        if (quantity < 1) { // Nếu số lượng < 1 thì xóa sản phẩm
            const updatedItems = state.cart.items.filter(item =>
                !(item.productId === productId && item.variantId === variantId)
            );
            return { cart: { ...state.cart, items: updatedItems } };
        }
        const updatedItems = state.cart.items.map(item =>
            item.productId === productId && item.variantId === variantId
                ? { ...item, quantity }
                : item
        );
        return { cart: { ...state.cart, items: updatedItems } };
    }),

    clearCart: () => set((state) => {
        // TODO: Gọi API xóa toàn bộ giỏ hàng ở đây
        return { cart: { ...state.cart, items: [] } };
    }),

    toggleItemSelection: (variantId: string) => set((state) => {
        const { selectedItems } = state;
        if (selectedItems.includes(variantId)) {
            return { selectedItems: selectedItems.filter(id => id !== variantId) };
        } else {
            return { selectedItems: [...selectedItems, variantId] };
        }
    }),

    toggleSelectAll: () => set((state) => {
        const { cart, selectedItems } = state;
        const allItemIds = cart.items.map(item => item.variantId);
        // Nếu đã chọn tất cả thì bỏ chọn, ngược lại thì chọn tất cả
        if (selectedItems.length === allItemIds.length) {
            return { selectedItems: [] };
        } else {
            return { selectedItems: allItemIds };
        }
    }),
}));