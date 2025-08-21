// stores/useCartStore.ts
import { create } from "zustand";

type CartState = {
    cartItemCount: number;
    setCartItemCount: (count: number) => void;
    increaseCartItemCount: () => void;
    decreaseCartItemCount: () => void;
};

export const userStore = create<CartState>((set) => ({
    cartItemCount: 0,
    setCartItemCount: (count) => set({ cartItemCount: count }),
    increaseCartItemCount: () =>
        set((state) => ({ cartItemCount: state.cartItemCount + 1 })),
    decreaseCartItemCount: () =>
        set((state) => ({ cartItemCount: state.cartItemCount - 1 })),
}));
