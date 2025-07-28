import { create } from 'zustand';
import type { Address as AddressType } from '@/types'; // Giả sử Address đã ở trong types/index.ts

// Mở rộng Address để có id
export interface Address extends AddressType {
    id: string;
}

interface UserState {
    addresses: Address[];
    getDefaultAddress: () => Address | undefined;
    addAddress: (newAddress: Omit<Address, 'id' | 'isDefault'>) => void;
    setDefaultAddress: (addressId: string) => void;
}

const mockAddresses: Address[] = [
    { id: 'addr1', street: "123 Le Loi", city: "Hoi An", isDefault: true },
    { id: 'addr2', street: "456 Tran Hung Dao", city: "Da Nang" },
];

export const useUserStore = create<UserState>((set, get) => ({
    addresses: mockAddresses,
    getDefaultAddress: () => get().addresses.find(addr => addr.isDefault),

    addAddress: (newAddress) => {
        // TODO: Gọi API PATCH /users/me ở đây để thêm địa chỉ mới
        set(state => {
            const newAddressWithId: Address = {
                ...newAddress,
                id: `addr${state.addresses.length + 1}`, // Tạo id giả
                isDefault: false, // Địa chỉ mới sẽ không tự động là mặc định
            };
            return { addresses: [...state.addresses, newAddressWithId] };
        });
    },

    setDefaultAddress: (addressId: string) => {
        // TODO: Gọi API PATCH /users/me ở đây để cập nhật địa chỉ mặc định
        set(state => {
            const updatedAddresses = state.addresses.map(addr => ({
                ...addr,
                isDefault: addr.id === addressId
            }));
            return { addresses: updatedAddresses };
        });
    }
}));