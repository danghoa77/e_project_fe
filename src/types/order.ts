export interface Order {
    _id: string;
    userId: string;
    items: any[];
    totalPrice: number;
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
    createdAt: string;
}