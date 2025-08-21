export interface Order {
    _id: string;
    userId: string;
    items: any[];
    totalPrice: number;
    paymentMethod: 'CASH' | 'VNPAY' | 'MOMO';
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
    createdAt: string;
}