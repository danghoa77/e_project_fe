// src/features/orders/pages/OrderPage.tsx

import React, { useState, useMemo, useEffect } from 'react'; // Thêm useEffect
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useCartStore } from '@/store/cartStore';
import { useUserStore } from '../../../store/userStore';
import { Address } from '@/types/user';
import AddressDialog from '../../../components/shared/AddressDialog';
import { ChevronLeft } from 'lucide-react';
import { toast } from "sonner";
import { CartItem } from '@/types/cart';

export const OrderPage = () => {
    const navigate = useNavigate();
    const { cart, selectedItems, clearCart } = useCartStore(); // Thêm clearCart
    const { getDefaultAddress } = useUserStore();

    const [shippingAddress, setShippingAddress] = useState<Address | undefined>(getDefaultAddress());
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'vnpay'>('cash');

    const itemsToCheckout = useMemo(() =>
        cart.items.filter((item: CartItem) => selectedItems.includes(item.variantId)),
        [cart.items, selectedItems]
    );

    useEffect(() => {
        if (itemsToCheckout.length === 0) {
            navigate('/');
        }
    }, [itemsToCheckout, navigate]);

    const subtotal = itemsToCheckout.reduce((acc: number, item: CartItem) => acc + item.price * item.quantity, 0);

    const handlePlaceOrder = () => {
        if (!shippingAddress) {
            toast.error("Please add a shipping address to proceed.");
            return;
        }

        const orderPayload = {
            items: itemsToCheckout.map((item: CartItem) => ({
                productId: item.productId,
                variantId: item.variantId,
                quantity: item.quantity,
            })),
            shippingAddress: {
                street: shippingAddress.street,
                city: shippingAddress.city,
            }
        };

        console.log("Creating order with payload:", orderPayload);
        // TODO: Gọi API createOrder với orderPayload

        if (paymentMethod === 'vnpay') {
            console.log("Redirecting to VNPAY...");
            // TODO: Sau khi createOrder thành công, gọi API create-vnpay-payment
        } else {
            // --- PHẦN ĐÃ CẬP NHẬT ---
            console.log("Order placed with cash payment.");

            // 1. Hiển thị thông báo thành công
            toast.success("Order placed successfully!", {
                description: `Monday, July 28, 2025 at ${new Date().toLocaleTimeString()}`,
                action: {
                    label: "View Orders",
                    onClick: () => navigate('/profile/orders'), // Giả sử có trang lịch sử đơn hàng
                },
            });

            // 2. Xóa các sản phẩm đã chọn khỏi giỏ hàng
            clearCart(); // Hoặc một hàm mới `removeSelectedItemsFromCart()`

            // 3. Điều hướng người dùng sau một khoảng trễ
            setTimeout(() => {
                navigate('/'); // Điều hướng về trang chủ
            }, 3000);
            // --- KẾT THÚC PHẦN CẬP NHẬT ---
        }
    };

    if (itemsToCheckout.length === 0) {
        return <div className="flex h-screen items-center justify-center font-sans">Redirecting...</div>;
    }

    return (
        <div className="font-sans bg-[#fcf7f1] min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Button asChild variant="link" className="p-0 text-neutral-600 hover:text-black mb-6">
                    <Link to="/"><ChevronLeft className="h-4 w-4 mr-2" /> Back to Home</Link>
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Cột trái: Tóm tắt đơn hàng */}
                    <div className="bg-white p-8 space-y-6">
                        <h2 className="font-serif text-2xl">Order Summary</h2>
                        <div className="max-h-96 overflow-y-auto pr-4 space-y-6">
                            {itemsToCheckout.map((item: CartItem) => (
                                <div key={item.variantId} className="flex gap-4 items-center">
                                    <img src={item.image} alt={item.name} className="h-20 w-16 object-cover" />
                                    <div className="flex-1 text-sm"><p className="font-semibold">{item.name}</p><p className="text-neutral-500">Qty: {item.quantity}</p></div>
                                    <p className="text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                        <Separator />
                        <div className="flex justify-between font-semibold"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                    </div>

                    {/* Cột phải: Địa chỉ và thanh toán */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="font-serif text-2xl mb-4">Shipping Address</h2>
                            <div className="bg-white p-6 text-sm">
                                {shippingAddress ? (
                                    <>
                                        <p>{shippingAddress.street}, {shippingAddress.city}</p>
                                        <AddressDialog onAddressSelect={setShippingAddress}><Button variant="link" className="p-0 h-auto mt-2">Change address</Button></AddressDialog>
                                    </>
                                ) : (
                                    <AddressDialog onAddressSelect={setShippingAddress}><Button variant="outline" className="rounded-none">Add a shipping address</Button></AddressDialog>
                                )}
                            </div>
                        </div>
                        <div>
                            <h2 className="font-serif text-2xl mb-4">Payment Method</h2>
                            <div className="bg-white p-6 text-sm">
                                <RadioGroup defaultValue="cash" onValueChange={(value: 'cash' | 'vnpay') => setPaymentMethod(value)}>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="cash" id="cash" /><Label htmlFor="cash">Cash on Delivery</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="vnpay" id="vnpay" /><Label htmlFor="vnpay">VNPAY</Label></div>
                                </RadioGroup>
                            </div>
                        </div>
                        <Button className="w-full rounded-none bg-neutral-800 hover:bg-neutral-700 text-white h-12 text-base" onClick={handlePlaceOrder}>Place Order</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};