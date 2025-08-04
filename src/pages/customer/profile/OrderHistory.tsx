// src/features/profile/components/OrderHistory.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Dữ liệu mẫu - Sau này sẽ thay bằng API
const mockOrders = [
    { id: "ORDER-8463", date: "July 20, 2025", status: "Delivered", total: 114.00 },
    { id: "ORDER-7291", date: "June 15, 2025", status: "Delivered", total: 85.50 },
    { id: "ORDER-6842", date: "May 30, 2025", status: "Cancelled", total: 205.00 },
];

const OrderHistory = () => {
    // TODO: Dùng React Query để fetch lịch sử đơn hàng
    return (
        <div className="border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {mockOrders.map(order => (
                        <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.id}</TableCell>
                            <TableCell>{order.date}</TableCell>
                            <TableCell>
                                <Badge variant={order.status === 'Delivered' ? 'default' : 'destructive'}>{order.status}</Badge>
                            </TableCell>
                            <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default OrderHistory;