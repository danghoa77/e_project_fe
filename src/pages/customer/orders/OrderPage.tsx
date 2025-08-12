// src/features/orders/pages/OrderPage.tsx

import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ShippingAddress } from '@/types/user';
import { ChevronLeft, Plus, MapPin, Pencil } from 'lucide-react';
import { toast } from "sonner";
import { CartItem } from '@/types/cart';
import { customerApi } from '../api';
import { AddressSelectionDialog } from '@/components/shared/AddressSelectionDialog';


export const OrderPage = () => {
    const navigate = useNavigate();

    // State quản lý địa chỉ và dialog
    const [allAddresses, setAllAddresses] = useState<ShippingAddress[]>([]);
    const [shippingAddress, setShippingAddress] = useState<ShippingAddress | undefined>(undefined);
    const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);

    // State cho giỏ hàng và thanh toán
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'vnpay'>('cash');
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await customerApi.getCart();
                if (res?.items) {
                    setCartItems(res.items);
                    const allVariantIds = res.items.map((item: CartItem) => item.variantId);
                    setSelectedItems(allVariantIds);
                }
            } catch (error) {
                console.error("Failed to fetch cart:", error);
                setCartItems([]);
            }
        };
        fetchCart();
    }, []);

    // THAY ĐỔI: useEffect để lấy danh sách địa chỉ đã được đơn giản hóa
    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const res = await customerApi.getAddresses();
                const addressesFromApi: ShippingAddress[] = res;
                // =================================================================
                console.log("addressesFromApi", addressesFromApi);
                setAllAddresses(addressesFromApi);

                const defaultAddress = addressesFromApi.find(addr => addr.isDefault);
                if (defaultAddress) {
                    setShippingAddress(defaultAddress);
                } else if (addressesFromApi.length > 0) {
                    setShippingAddress(addressesFromApi[0]);
                }
            } catch (error) {
                toast.error("Could not fetch shipping addresses.");
                console.error("Failed to fetch addresses:", error);
                setAllAddresses([]);
            }
        };

        fetchAddresses();
    }, []);

    const itemsToCheckout = useMemo(
        () => cartItems.filter((item) => selectedItems.includes(item.variantId)),
        [cartItems, selectedItems]
    );

    useEffect(() => {
        if (itemsToCheckout.length === 0 && cartItems.length > 0) {
            navigate('/');
        }
    }, [itemsToCheckout, cartItems, navigate]);

    const subtotal = itemsToCheckout.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    const handleSelectAddress = (address: ShippingAddress) => {
        setShippingAddress(address);
        setIsAddressDialogOpen(false);
        // TODO: Gọi API để cập nhật địa chỉ mặc định mới nếu cần
        toast.info(`Switched to address: ${address.street}`);
    };

    const handleAddNewAddress = (newAddress: { street: string, city: string }) => {
        // TODO: Gọi API của bạn để lưu địa chỉ mới vào DB
        // const savedAddress = await customerApi.addAddress(newAddress);

        // Sau khi API thành công, cập nhật state ở client
        const newlyAddedAddress: ShippingAddress = { ...newAddress, isDefault: false }; // Thay bằng `savedAddress` nếu API trả về
        setAllAddresses(prev => [...prev, newlyAddedAddress]);
        setShippingAddress(newlyAddedAddress);
        setIsAddressDialogOpen(false);
        toast.success("New address added successfully!");
    };

    const handlePlaceOrder = async () => {
        if (!shippingAddress) {
            toast.error("Please add a shipping address to proceed.");
            setIsAddressDialogOpen(true);
            return;
        }

        const orderPayload = {
            items: itemsToCheckout.map((item) => ({
                productId: item.productId,
                variantId: item.variantId,
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
            totalPrice:
                itemsToCheckout.reduce(
                    (acc, item) => acc + item.price * item.quantity,
                    0
                )
        };
        console.log(orderPayload);

        try {
            await customerApi.createOrder(orderPayload);

            if (paymentMethod === 'vnpay') {
                console.log("Redirecting to VNPAY...");
            } else {
                toast.success("Order placed successfully!");

                await customerApi.deleteCart();
                navigate('/');
            }
        } catch (err) {
            toast.error("Failed to place order.");
            console.error(err);
        }
    };

    if (itemsToCheckout.length === 0) {
        return <div className="flex h-screen items-center justify-center font-sans">Redirecting...</div>;
    }

    return (
        <>
            <AddressSelectionDialog
                open={isAddressDialogOpen}
                onOpenChange={setIsAddressDialogOpen}
                addresses={allAddresses}
                onSelectAddress={handleSelectAddress}
                onAddNewAddress={handleAddNewAddress}
            />
            <div className="font-sans bg-[#fcf7f1] min-h-screen">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* ... JSX không đổi ... */}
                    <Button asChild variant="link" className="p-0 text-neutral-600 hover:text-black mb-6">
                        <Link to="/"><ChevronLeft className="h-4 w-4 mr-2" /> Back to Home</Link>
                    </Button>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="bg-white p-8 space-y-6">
                            <h2 className="font-sans text-2xl">Order Summary</h2>
                            <div className="max-h-96 overflow-y-auto pr-4 space-y-6">
                                {itemsToCheckout.map((item) => (
                                    <div key={item.variantId} className="flex gap-4 items-center">
                                        <img src={item.imageUrl} alt={item.name} className="h-20 w-16 object-cover" />
                                        <div className="flex-1 text-sm">
                                            <p className="font-semibold">{item.name}</p>
                                            <p className="text-neutral-500">Quantity: {item.quantity}</p>
                                            <p className="text-neutral-500">{item.color} / {item.size}</p>
                                        </div>
                                        <p className="text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                            <Separator />
                            <div className="flex justify-between font-semibold">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="space-y-8">
                            <div>
                                <h2 className="font-sans text-2xl mb-4">Shipping Address</h2>
                                {shippingAddress ? (
                                    <div className="bg-white p-6 flex items-center justify-between text-sm">
                                        <div className="flex items-start">
                                            <MapPin className="h-5 w-5 mr-4 mt-1 text-neutral-500" />
                                            <div>
                                                <p className="font-semibold">{shippingAddress.street}</p>
                                                <p className="text-neutral-500">{shippingAddress.city}</p>
                                            </div>
                                        </div>
                                        <Button variant="outline" onClick={() => setIsAddressDialogOpen(true)}>
                                            <Pencil className="h-4 w-4 mr-2" /> Change
                                        </Button>
                                    </div>
                                ) : (
                                    <Button className="bg-white p-6 text-sm" onClick={() => setIsAddressDialogOpen(true)}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Shipping Address
                                    </Button>
                                )}
                            </div>
                            <div>
                                <h2 className="font-sans text-2xl mb-4">Payment Method</h2>
                                <div className="bg-white p-6 text-sm">
                                    <RadioGroup defaultValue="cash" onValueChange={(value: 'cash' | 'vnpay') => setPaymentMethod(value)}>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="cash" id="cash" />
                                            <Label htmlFor="cash">Cash on Delivery</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="vnpay" id="vnpay" />
                                            <Label htmlFor="vnpay">VNPAY</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                            </div>
                            <Button
                                className="w-full rounded-none bg-neutral-800 hover:bg-neutral-700 text-white h-12 text-base"
                                onClick={handlePlaceOrder}
                            >
                                Place Order
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};