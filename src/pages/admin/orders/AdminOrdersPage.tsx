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
import { toast } from "sonner";
import { Order } from "@/types/order";
import { Skeleton } from "@/components/ui/skeleton";

interface User {
  _id: string;
  email: string;
}

const STATUS_OPTIONS = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
] as const;
type OrderStatus = (typeof STATUS_OPTIONS)[number];

const statusColor = (status: OrderStatus) => {
  switch (status) {
    case "confirmed":
      return "bg-green-100 text-green-700 border-green-700";
    case "pending":
      return "bg-yellow-100 text-yellow-700 border-yellow-700";
    case "shipped":
      return "bg-blue-100 text-blue-700 border-blue-700";
    case "delivered":
      return "bg-gray-100 text-gray-700 border-gray-700";
    case "cancelled":
      return "bg-red-100 text-red-700 border-red-700";
    default:
      return "";
  }
};

const OrderTableRowSkeleton = () => (
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
  </TableRow>
);

export const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [userMap, setUserMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const handleStatusUpdate = async (id: string, status: OrderStatus) => {
    try {
      await adminApi.updateStatusOrder(id, { status });
      toast.success(`Order #${id.slice(0, 6)} status updated.`);
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status } : o))
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
          adminApi.fetchAllUser(),
        ]);

        const users = usersResponse || [];
        const newUsersMap = users.reduce(
          (acc: Record<string, string>, user: User) => {
            acc[user._id] = user.email;
            return acc;
          },
          {}
        );

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
    <div className="bg-stone-50 min-h-screen p-4 sm:p-6 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-bold text-3xl md:text-4xl text-neutral-800 mb-8">
          Orders
        </h1>

        {/* Bảng cho desktop */}
        <div className="hidden md:block bg-white rounded-lg shadow-sm border border-neutral-200/80 overflow-x-auto">
          <Table className="table-fixed w-full">
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-neutral-200/80">
                <TableHead style={{ width: "23%" }}>Order ID</TableHead>
                <TableHead style={{ width: "15%" }}>Date</TableHead>
                <TableHead style={{ width: "20%" }}>Customer Email</TableHead>
                <TableHead style={{ width: "8%" }}>Payment</TableHead>
                <TableHead style={{ width: "15%" }} className="text-right">
                  Total
                </TableHead>
                <TableHead style={{ width: "15%" }} className="text-center">
                  Status
                </TableHead>
                <TableHead style={{ width: "20%" }} className="text-center">
                  Change Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <OrderTableRowSkeleton key={i} />
                ))
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <TableRow
                    key={order._id}
                    className="border-b border-neutral-200/50"
                  >
                    <TableCell className="font-mono text-sm truncate">
                      #{order._id.slice(0, 24)}
                    </TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-sm truncate">
                      {userMap[order.userId] || "N/A"}
                    </TableCell>
                    <TableCell className="text-sm truncate">
                      {order.paymentMethod}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {order.totalPrice.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={`capitalize text-sm ${statusColor(
                          order.status as OrderStatus
                        )}`}
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="flex justify-center">
                      <Select
                        value={order.status}
                        onValueChange={(s: OrderStatus) =>
                          handleStatusUpdate(order._id, s)
                        }
                      >
                        <SelectTrigger className="capitalize bg-white w-[150px]">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {STATUS_OPTIONS.map((status) => (
                            <SelectItem
                              key={status}
                              value={status}
                              className="capitalize"
                            >
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
                  <TableCell
                    colSpan={7}
                    className="text-center py-30 text-gray-500"
                  >
                    No orders found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {/* Card cho mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white p-4 rounded-lg shadow-sm border space-y-2"
              >
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ))
          ) : orders.length > 0 ? (
            orders.map((order) => (
              <div
                key={order._id}
                className="bg-white p-4 rounded-lg shadow-sm border space-y-2"
              >
                <div className="flex justify-between items-center">
                  <span className="font-mono text-sm">
                    #{order._id.slice(0, 8)}
                  </span>
                  <Badge
                    className={`capitalize ${statusColor(
                      order.status as OrderStatus
                    )}`}
                  >
                    {order.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm">{userMap[order.userId] || "N/A"}</p>
                <p className="text-sm">{order.paymentMethod}</p>
                <p className="font-medium">
                  {order.totalPrice.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </p>

                <Select
                  value={order.status}
                  onValueChange={(s: OrderStatus) =>
                    handleStatusUpdate(order._id, s)
                  }
                >
                  <SelectTrigger className="capitalize bg-white w-full">
                    <SelectValue placeholder="Change status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {STATUS_OPTIONS.map((status) => (
                      <SelectItem
                        key={status}
                        value={status}
                        className="capitalize"
                      >
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No orders found</p>
          )}
        </div>
      </div>
    </div>
  );
};
