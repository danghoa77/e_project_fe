import { useAuthStore } from "@/store/authStore";
import { customerApi } from "../api";
import React from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const OrderHistory = () => {
  const { user } = useAuthStore();
  const [orders, setOrders] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await customerApi.getOrderbyRole();
        console.log("order", res);
        setOrders(res);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchOrders();
  }, [user]);

  const handleCancel = async (orderId: string) => {
    try {
      await customerApi.cancelOrder(orderId);
      toast.success("Order cancelled successfully!");
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: "cancelled" } : o))
      );
    } catch (err) {
      console.error("Failed to cancel order:", err);
      toast.error("Failed to cancel order. Please try again.");
    }
  };

  if (loading) return <p>Loading order history...</p>;
  if (!orders || orders.length === 0)
    return <p className="text-neutral-500">No orders found.</p>;

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-6 border border-neutral-200">
      <h2 className="text-xl font-semibold mb-4">Order History</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-neutral-100 text-left">
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Shipping</th>
              <th className="p-3">Total</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {[...orders].reverse().map((order) => (
              <tr key={order._id} className="border-b">
                <td className="p-3">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="p-3 capitalize">{order.status}</td>
                <td className="p-3">{order.paymentMethod}</td>
                <td className="p-3">
                  {order.shippingAddress.street}, {order.shippingAddress.city}
                </td>
                <td className="p-3 font-medium">${order.totalPrice}</td>
                <td className="p-3">
                  {order.status === "pending" ? (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="flex items-center justify-center text-red-500 hover:text-red-700">
                          Cancel
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-white text-neutral-900">
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Cancel this order?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. The order will be
                            marked as <b>cancelled</b>.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Close</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleCancel(order._id)}
                          >
                            Confirm Cancel
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : (
                    <span className="text-neutral-400"></span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderHistory;
