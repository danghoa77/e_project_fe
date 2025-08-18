

import { useEffect, useState } from "react";
import adminApi from "../api";

import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { PackageSearch } from "lucide-react";
import { toast } from "sonner";
import { Order } from "@/types/order";
import { Skeleton } from "@/components/ui/skeleton";


interface User {
    _id: string;
    email: string;
}

const STATUS_OPTIONS = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] as const;
type OrderStatus = typeof STATUS_OPTIONS[number];

const OrderTableRowSkeleton = () => {
    return (
        <TableRow className="border-b border-neutral-200/50">
            <TableCell className="font-mono text-sm truncate">
                <Skeleton className="h-4 w-3/4" />
            </TableCell>
            <TableCell>
                <Skeleton className="h-4 w-full" />
            </TableCell>
            <TableCell>
                <Skeleton className="h-4 w-full" />
            </TableCell>
            <TableCell className="text-right font-medium">
                <Skeleton className="h-4 w-1/2 ml-auto" />
            </TableCell>
            <TableCell className="text-center">
                <Skeleton className="h-6 w-20 mx-auto" />
            </TableCell>
            <TableCell className="flex justify-center">
                <Skeleton className="h-10 w-[150px]" />
            </TableCell>
        </TableRow>
    );
};

export const AdminOrdersPage = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [userMap, setUserMap] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);

    const handleStatusUpdate = async (id: string, status: OrderStatus) => {
        try {
            await adminApi.updateStatusOrder(id, { status });
            toast.success(`Order #${id.slice(0, 6)} status updated.`);
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order._id === id ? { ...order, status } : order
                )
            );
        } catch (error) {
            toast.error("Failed to update order status.");
            console.error(error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const [ordersResponse, usersResponse] = await Promise.all([
                    adminApi.fetchOrders(),
                    adminApi.fetchAllUser()
                ]);

                const users = usersResponse || [];
                const newUsersMap = users.reduce((acc: Record<string, string>, user: User) => {
                    acc[user._id] = user.email;
                    return acc;
                }, {});

                setUserMap(newUsersMap);
                setOrders(ordersResponse || []);

            } catch (error) {
                console.error("Failed to fetch data:", error);
                toast.error("Could not fetch page data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="bg-[#fcf7f1] min-h-screen p-4 sm:p-6 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <h1 className="font-sans  text-3xl md:text-4xl text-neutral-800 mb-8">
                    Order Management
                </h1>

                <div className="bg-white rounded-lg shadow-sm border border-neutral-200/80 overflow-x-auto">
                    <Table className="table-fixed w-full">
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-b border-neutral-200/80">
                                <TableHead style={{ width: '10%' }}>Order ID</TableHead>
                                <TableHead style={{ width: '15%' }}>Date</TableHead>
                                <TableHead style={{ width: '25%' }}>Customer Email</TableHead>
                                <TableHead style={{ width: '15%' }} className="text-right">Total</TableHead>
                                <TableHead style={{ width: '15%' }} className="text-center">Status</TableHead>
                                <TableHead style={{ width: '20%' }} className="text-center">Change Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 8 }).map((_, index) => (
                                    <OrderTableRowSkeleton key={index} />
                                ))
                            ) : orders.length > 0 ? (
                                orders.map((order) => (
                                    <TableRow key={order._id} className="border-b border-neutral-200/50">
                                        <TableCell className="font-mono text-sm truncate">#{order._id.slice(0, 6)}</TableCell>
                                        <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>

                                        <TableCell className="text-sm truncate">
                                            {userMap[order.userId] || 'N/A'}
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            {order.totalPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                        </TableCell>

                                        <TableCell className="text-center">
                                            <Badge variant="outline" className="capitalize text-sm">
                                                {order.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="flex justify-center">
                                            <Select
                                                value={order.status}
                                                onValueChange={(newStatus: OrderStatus) => {
                                                    handleStatusUpdate(order._id, newStatus);
                                                }}
                                            >
                                                <SelectTrigger className="capitalize bg-white w-[150px]">
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-white">
                                                    {STATUS_OPTIONS.map((status) => (
                                                        <SelectItem key={status} value={status} className="capitalize">
                                                            {status}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-48 text-center">
                                        <PackageSearch className="h-12 w-12 mx-auto text-neutral-400 mb-4" />
                                        <p className="text-lg">No Orders Found</p>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
};