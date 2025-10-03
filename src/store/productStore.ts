import { create } from "zustand";
import { Category, FilterState } from "@/types/product";

interface ProductState {
    category: Category[];
    setCategory: (category: Category[]) => void;
    filters: Omit<FilterState, "page" | "limit">;
    setFilters: (filters: Partial<Omit<FilterState, "page" | "limit">>) => void;
}

export const useProductStore = create<ProductState>((set) => ({
    category: [],
    setCategory: (category) => set({ category }),
    filters: {} as Omit<FilterState, "page" | "limit">,
    setFilters: (filters) => set({ filters }),
}));
