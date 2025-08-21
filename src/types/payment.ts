export interface Payment {
    _id: string;
    orderId: string;
    userId: string;
    amount: number;
    status: "SUCCESS" | "PENDING" | "FAILED";
    provider: string;
    createdAt: string;
}