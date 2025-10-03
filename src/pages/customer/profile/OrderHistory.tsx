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

const getStatusClasses = (status: string) => {
  switch (status) {
    case "confirmed":
      return "bg-green-100 text-green-700 border border-green-700";
    case "pending":
      return "bg-yellow-100 text-yellow-700 border border-yellow-700";
    case "shipped":
      return "bg-blue-100 text-blue-700 border border-blue-700";
    case "delivered":
      return "bg-gray-100 text-gray-700 border border-gray-700";
    case "cancelled":
      return "bg-red-100 text-red-700 border border-red-700";
    default:
      return "bg-neutral-100 text-neutral-600 border border-neutral-400";
  }
};

const OrderHistory = () => {
  const { user } = useAuthStore();
  const [orders, setOrders] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await customerApi.getOrderbyRole();
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

      <div className="hidden md:block overflow-x-auto">
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
              <tr key={order._id} className="border-b hover:bg-neutral-50">
                <td className="p-3">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="p-3">
                  <span
                    className={`capitalize px-3 py-1 rounded-full text-sm font-medium ${getStatusClasses(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="p-3">{order.paymentMethod}</td>
                <td className="p-3">
                  {order.shippingAddress.street}, {order.shippingAddress.city}
                </td>
                <td className="p-3 font-medium">${order.totalPrice}</td>
                <td className="p-3">
                  {order.status === "pending" ? (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="text-red-500 hover:underline">
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
                    <span className="text-neutral-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 gap-4 md:hidden">
        {[...orders].reverse().map((order) => (
          <div
            key={order._id}
            className="rounded-lg border border-neutral-200 shadow-sm p-4 bg-white hover:shadow-md transition relative"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-stone-700">
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
              <span
                className={`capitalize text-xs px-2 py-1 rounded-full font-medium ${getStatusClasses(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </div>
            <p className="text-sm text-neutral-600">
              <b>Payment:</b> {order.paymentMethod}
            </p>
            <p className="text-sm text-neutral-600">
              <b>Shipping:</b> {order.shippingAddress.street},{" "}
              {order.shippingAddress.city}
            </p>
            <p className="text-sm text-neutral-700 mt-1">
              <b>Total:</b> ${order.totalPrice}
            </p>

            {order.status === "pending" && (
              <div className="mt-3">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="text-red-500 text-sm underline">
                      Cancel Order
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-white text-neutral-900">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Cancel this order?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone.
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
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
