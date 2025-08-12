// src/store/userStore.ts
import { create } from 'zustand';
import type { ShippingAddress } from '@/types/user';
import { authApi } from '@/pages/auth/api';
import { customerApi } from '@/pages/customer/api';
import { v4 as uuidv4 } from 'uuid';

interface UserState {
    addresses: ShippingAddress[];
    getDefaultAddress: () => ShippingAddress | undefined;
    fetchProfile: () => Promise<void>;
    addAddress: (newAddress: Omit<ShippingAddress, 'id' | 'isDefault'>) => Promise<void>;
    setDefaultAddress: (id: string) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
    addresses: [],

    getDefaultAddress: () => get().addresses.find(addr => addr.isDefault),

    fetchProfile: async () => {
        try {
            const res = await authApi.getUserProfile();
            const addressesFromApi: ShippingAddress[] = res.data?.addresses || [];
            const addressesWithId = addressesFromApi.map(addr => ({
                ...addr,
                id: uuidv4(),
            }));

            set({ addresses: addressesWithId });
        } catch (err) {
            console.error('Failed to fetch user profile:', err);
        }
    },

    addAddress: async (newAddress) => {
        try {
            const newAddressWithId: ShippingAddress = {
                id: uuidv4(),
                ...newAddress,
                isDefault: false,
            };

            const updatedAddresses = [...get().addresses, newAddressWithId];

            const payloadAddresses = updatedAddresses.map(({ id, ...rest }) => rest);

            await customerApi.updateProfile({ addresses: payloadAddresses });
            set({ addresses: updatedAddresses });
        } catch (err) {
            console.error('Failed to add address:', err);
            throw err;
        }
    },

    setDefaultAddress: async (id) => {
        try {
            const updatedAddresses = get().addresses.map(addr => ({
                ...addr,
                isDefault: addr.id === id,
            }));

            const payloadAddresses = updatedAddresses.map(({ id, ...rest }) => rest);

            await customerApi.updateProfile({ addresses: payloadAddresses });
            set({ addresses: updatedAddresses });
        } catch (err) {
            console.error('Failed to set default address:', err);
            throw err;
        }
    },
}));
