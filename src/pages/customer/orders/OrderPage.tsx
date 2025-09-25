import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { customerApi } from "../api";
import { CartItem } from "@/types/cart";
import { ShippingAddress } from "@/types/user";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, ChevronLeft, Pencil, Plus } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import AddressModal from "@/components/shared/AddressModal";

export const OrderPage = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [allAddresses, setAllAddresses] = useState<ShippingAddress[]>([]);
  const [shippingAddress, setShippingAddress] = useState<
    ShippingAddress | undefined
  >(undefined);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "momo" | "vnpay">(
    "cash"
  );
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const [cartRes, addressRes] = await Promise.all([
          customerApi.getCart(),
          customerApi.getAddresses(),
        ]);

        if (Array.isArray(cartRes) && cartRes.length > 0) {
          setCartItems(cartRes);
        } else {
          toast.info("Your cart is empty. Redirecting...");
          navigate("/");
          return;
        }

        setAllAddresses(addressRes);

        const defaultAddress =
          addressRes.find((addr: ShippingAddress) => addr.isDefault) ||
          addressRes[0];

        setShippingAddress(defaultAddress);
      } catch (error) {
        toast.error("Could not load page data.");
        console.error("Failed to load initial data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, [navigate]);

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (acc, item: CartItem) => acc + item.price * item.quantity,
        0
      ),
    [cartItems]
  );

  const handlePlaceOrder = async () => {
    if (!shippingAddress) {
      toast.error("Please add a shipping address to proceed.");
      setIsAddressModalOpen(true);
      return;
    }
    setIsSubmitting(true);
    const orderPayload = {
      items: cartItems.map((item: CartItem) => ({
        productId: item.productId,
        variantId: item.variantId,
        sizeId: item.sizeId,
        quantity: item.quantity,
        name: item.name,
        price: item.price,
        size: item.size,
        color: item.color,
      })),
      shippingAddress: {
        street: shippingAddress.street,
        city: shippingAddress.city,
      },
      totalPrice: subtotal,
    };

    if (paymentMethod === "cash") {
      try {
        await customerApi.createOrder(orderPayload);
        const stockPayload = orderPayload.items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          sizeId: item.sizeId,
        }));

        await customerApi.decreaseStock(stockPayload);

        await customerApi.deleteCart();
        window.location.href = "/";
        toast.success("Order placed successfully!");
      } catch (err: any) {
        const message = err?.response?.data?.message || "Failed to order.";
        toast.error(message);
        console.error("API Error:", err?.response?.data);
      } finally {
        setIsSubmitting(false);
      }
    }

    if (paymentMethod === "momo") {
      try {
        const stockPayload = orderPayload.items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
        }));
        await customerApi.decreaseStock(stockPayload);

        const order = await customerApi.createOrder(orderPayload);
        if (order && order._id && order.totalPrice != null) {
          await handelMomo(order._id, order.totalPrice);
        } else {
          throw new Error("Order data is incomplete.");
        }
      } catch (err: any) {
        const message = err?.response?.data?.message || "Failed to order.";
        toast.error(message);
        console.error("Order error:", err);
      } finally {
        setIsSubmitting(false);
      }
    }
    if (paymentMethod === "vnpay") {
      try {
        const stockPayload = orderPayload.items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
        }));
        await customerApi.decreaseStock(stockPayload);

        const order = await customerApi.createOrder(orderPayload);
        if (order && order._id && order.totalPrice != null) {
          await handelVnpay(order._id, order.totalPrice);
        } else {
          throw new Error("Order data is incomplete.");
        }
      } catch (err: any) {
        const message = err?.response?.data?.message || "Failed to order.";
        toast.error(message);
        console.error("Order error:", err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center font-sans text-gray-500">
        Loading...
      </div>
    );
  }

  const handelMomo = async (orderId: string, amount: number) => {
    try {
      const res = await customerApi.createMomoUrl(orderId, amount);
      if (res) {
        window.location.href = res;
      } else {
        toast.error("Could not get MOMO link.");
      }
    } catch (err) {
      toast.error("MOMO payment failed.");
      console.error(err);
    }
  };

  const handelVnpay = async (orderId: string, amount: number) => {
    try {
      const res = await customerApi.createVnpayUrl(orderId, amount);
      if (res) {
        window.location.href = res;
      } else {
        toast.error("Could not get VNPay link.");
      }
    } catch (err) {
      toast.error("VNPay payment failed.");
      console.error(err);
    }
  };

  return (
    <TooltipProvider>
      <div className="bg-zinc-50 min-h-screen font-sans">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <div className="mb-8 max-w-6xl mx-auto">
            <Button
              onClick={() => navigate("/")}
              variant="link"
              className="p-0 text-neutral-600 hover:text-orange-900 transition-colors"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Home
            </Button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="shadow-sm border-zinc-200">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {cartItems.map((item: CartItem) => (
                      <div
                        key={item.variantId}
                        className="flex items-start gap-6"
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-24 h-28 object-cover"
                        />
                        <div className="flex-grow">
                          <p className="font-semibold text-base">{item.name}</p>
                          <p className="text-sm text-gray-500">
                            {item.color} / {item.size}
                          </p>
                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold text-base">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <div className="space-y-6 sticky top-8">
                <Card className="shadow-sm border-zinc-200">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium tracking-wide">
                      TOTAL
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between font-medium">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <Separator className="bg-zinc-200" />
                    <div className="space-y-2">
                      <label className="font-medium">Shipping Address</label>
                      {shippingAddress ? (
                        <div className="border border-zinc-200 rounded-md p-3 flex justify-between items-center text-sm">
                          <div>
                            <p className="font-medium">
                              {shippingAddress.street}
                            </p>
                            <p className="text-zinc-500">
                              {shippingAddress.city}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setIsAddressModalOpen(true)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => setIsAddressModalOpen(true)}
                        >
                          <Plus className="h-4 w-4 mr-2" /> Add Address
                        </Button>
                      )}
                    </div>

                    {/* Payment */}
                    <div className="space-y-2">
                      <label className="font-medium">Payment Method</label>
                      <RadioGroup
                        value={paymentMethod}
                        onValueChange={(value) =>
                          setPaymentMethod(value as "cash" | "momo" | "vnpay")
                        }
                        className="space-y-2"
                      >
                        <label className="flex items-center p-3 border border-zinc-200 rounded-md has-[:checked]:border-orange-500 cursor-pointer">
                          <RadioGroupItem value="cash" id="cash" />
                          <span className="ml-3 font-medium text-sm">
                            Cash on Delivery
                          </span>
                        </label>
                        <label className="flex items-center p-3 border border-zinc-200 rounded-md has-[:checked]:border-orange-500 cursor-pointer">
                          <RadioGroupItem value="momo" id="momo" />
                          <span className="ml-3 font-medium text-sm">MOMO</span>
                        </label>
                        <label className="flex items-center p-3 border border-zinc-200 rounded-md has-[:checked]:border-orange-500 cursor-pointer">
                          <RadioGroupItem value="vnpay" id="vnpay" />
                          <span className="ml-3 font-medium text-sm">
                            VNPAY
                          </span>
                        </label>
                      </RadioGroup>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={handlePlaceOrder}
                      disabled={isSubmitting}
                      size="lg"
                      className="w-full bg-[#F37321] hover:bg-[#E86A1A] text-white text-base font-semibold rounded-full"
                    >
                      {isSubmitting ? "Processing..." : "Confirm Order"}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </div>

        <AddressModal
          isOpen={isAddressModalOpen}
          onClose={() => setIsAddressModalOpen(false)}
          addresses={allAddresses}
          setAddresses={setAllAddresses}
          shippingAddress={shippingAddress}
          setShippingAddress={setShippingAddress}
        />
      </div>
    </TooltipProvider>
  );
};
