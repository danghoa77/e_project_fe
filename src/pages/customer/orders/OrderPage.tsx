import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { customerApi } from '../api';
import { CartItem } from '@/types/cart';
import { ShippingAddress } from '@/types/user';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Pencil, Plus, Trash2 } from 'lucide-react';


export const OrderPage = () => {
    const navigate = useNavigate();

    // --- STATE ---
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [allAddresses, setAllAddresses] = useState<ShippingAddress[]>([]);
    const [shippingAddress, setShippingAddress] = useState<ShippingAddress | undefined>(undefined);
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'momo' | 'vnpay'>('cash');
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [addressForm, setAddressForm] = useState({ street: '', city: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true);
            try {
                const [cartRes, addressRes] = await Promise.all([
                    customerApi.getCart(),
                    customerApi.getAddresses()
                ]);

                if (Array.isArray(cartRes) && cartRes.length > 0) {
                    setCartItems(cartRes);
                } else {
                    toast.info("Your cart is empty. Redirecting...");
                    navigate('/');
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


    const subtotal = useMemo(() => cartItems.reduce((acc, item: CartItem) => acc + item.price * item.quantity, 0), [cartItems]);

    const canAddAddress = allAddresses.length < 5;

    // --- HANDLERS ---
    const handleSelectAddress = async (address: ShippingAddress) => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        const payload = { addresses: [{ ...address, isDefault: true }] };
        try {
            const res = await customerApi.updateProfile(payload);
            setAllAddresses(res.addresses);
            setShippingAddress(res.addresses.find((a: ShippingAddress) => a.isDefault));
            toast.success(`Address updated to: ${address.street}`);
            setIsAddressModalOpen(false);
        } catch (error) {
            toast.error("Could not switch address.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFormSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!canAddAddress) {
            toast.warning("You can only have a maximum of 5 addresses.");
            return;
        }
        if (!addressForm.street || !addressForm.city) {
            toast.warning("Please fill in all address fields.");
            return;
        }
        setIsSubmitting(true);
        const newAddressPayload = { addresses: [{ ...addressForm, isDefault: true }] };
        try {
            const res = await customerApi.updateProfile(newAddressPayload);
            setAllAddresses(res.addresses);
            setShippingAddress(res.addresses.find((a: ShippingAddress) => a.isDefault));
            toast.success("New address added successfully!");
            setIsAddressModalOpen(false);
            setIsAddingNew(false);
            setAddressForm({ street: '', city: '' });
        } catch (error) {
            toast.error("Could not add shipping address.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteAddress = async (addressIdToDelete: string) => {
        setIsSubmitting(true);
        try {
            await customerApi.deleteAddress(addressIdToDelete);

            const updatedList = allAddresses.filter(addr => addr._id !== addressIdToDelete);

            if (shippingAddress?._id === addressIdToDelete) {
                const newDefault = updatedList.find(addr => addr.isDefault) || updatedList[0];
                setShippingAddress(newDefault);
            }

            setAllAddresses(updatedList);
            toast.success("Address has been deleted.");

        } catch (error) {
            toast.error("Failed to delete address.");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePlaceOrder = async () => {
        if (!shippingAddress) {
            toast.error("Please add a shipping address to proceed.");
            setIsAddressModalOpen(true);
            return;
        }
        setIsSubmitting(true);
        const orderPayload = {
            items: cartItems.map((item: CartItem) => ({
                productId: item.productId, variantId: item.variantId, quantity: item.quantity,
                name: item.name, price: item.price, size: item.size, color: item.color,
            })),
            shippingAddress: { street: shippingAddress.street, city: shippingAddress.city },
            totalPrice: subtotal * 25000,
        };
        if (paymentMethod === 'cash') {
            try {
                await customerApi.createOrder(orderPayload);
                const stockPayload = orderPayload.items.map((item) => ({
                    productId: item.productId,
                    variantId: item.variantId,
                    quantity: item.quantity,
                }));

                await customerApi.decreaseStock(stockPayload);

                await customerApi.deleteCart();
                navigate('/');
                toast.success("Order placed successfully!");
            } catch (err: any) {
                const message = err?.response?.data?.message || "Failed to order.";
                toast.error(message);
                console.error("API Error:", err?.response?.data);
            }
            finally {
                setIsSubmitting(false);
            }
        }

        if (paymentMethod === 'momo') {
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
                    console.log(order._id);
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
        if (paymentMethod === 'vnpay') {
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
                    console.log(order._id);
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

        console.log(orderPayload, paymentMethod, subtotal);
    };



    if (isLoading) {
        return <div className="flex h-screen items-center justify-center font-sans text-gray-500">Loading...</div>;
    }

    const handelMomo = async (orderId: string, amount: number) => {
        try {
            const res = await customerApi.createMomoUrl(orderId, amount);
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
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <Card className="shadow-sm border-zinc-200">
                                <CardContent className="p-6">
                                    <div className="space-y-6">
                                        {cartItems.map((item: CartItem) => (
                                            <div key={item.variantId} className="flex items-start gap-6">
                                                <img src={item.imageUrl} alt={item.name} className="w-24 h-28 object-cover" />
                                                <div className="flex-grow">
                                                    <p className="font-semibold text-base">{item.name}</p>
                                                    <p className="text-sm text-gray-500">{item.color} / {item.size}</p>
                                                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                                </div>
                                                <p className="font-semibold text-base">${(item.price * item.quantity).toFixed(2)}</p>
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
                                        <CardTitle className="text-lg font-medium tracking-wide">TOTAL</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex justify-between font-medium">
                                            <span>Subtotal</span>
                                            <span>${subtotal.toFixed(2)}</span>
                                        </div>
                                        <Separator className="bg-zinc-200" />
                                        <div className="space-y-2">
                                            <Label className="font-medium">Shipping Address</Label>
                                            {shippingAddress ? (
                                                <div className="border border-zinc-200 rounded-md p-3 flex justify-between items-center text-sm">
                                                    <div>
                                                        <p className="font-medium">{shippingAddress.street}</p>
                                                        <p className="text-zinc-500">{shippingAddress.city}</p>
                                                    </div>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsAddressModalOpen(true)}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Button variant="outline" className="w-full" onClick={() => { if (canAddAddress) { setIsAddingNew(true); setIsAddressModalOpen(true); } else { toast.warning("You have reached the maximum of 5 addresses."); } }}>
                                                    <Plus className="h-4 w-4 mr-2" /> Add Address
                                                </Button>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="font-medium">Payment Method</Label>
                                            <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'cash' | 'momo')} className="space-y-2">
                                                <Label className="flex items-center p-3 border border-zinc-200 rounded-md has-[:checked]:border-orange-500 cursor-pointer">
                                                    <RadioGroupItem value="cash" id="cash" />
                                                    <span className="ml-3 font-medium text-sm">Cash on Delivery</span>
                                                </Label>
                                                <Label className="flex items-center p-3 border border-zinc-200 rounded-md has-[:checked]:border-orange-500 cursor-pointer">
                                                    <RadioGroupItem value="momo" id="momo" />
                                                    <span className="ml-3 font-medium text-sm" >MOMO</span>
                                                </Label>
                                                <Label className="flex items-center p-3 border border-zinc-200 rounded-md has-[:checked]:border-orange-500 cursor-pointer">
                                                    <RadioGroupItem value="vnpay" id="vnpay" />
                                                    <span className="ml-3 font-medium text-sm" >VNPAY</span>
                                                </Label>
                                            </RadioGroup>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button onClick={handlePlaceOrder} disabled={isSubmitting} size="lg" className="w-full bg-[#F37321] hover:bg-[#E86A1A] text-white text-base font-semibold rounded-full">
                                            {isSubmitting ? 'Processing...' : 'Confirm Order'}
                                            <ArrowRight className="h-4 w-4 ml-2" />
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>

                <Dialog open={isAddressModalOpen} onOpenChange={setIsAddressModalOpen}>
                    <DialogContent className="sm:max-w-[480px] bg-white">
                        <DialogHeader>
                            <DialogTitle className="text-xl tracking-wide">{isAddingNew ? "Add New Address" : "Select Shipping Address"}</DialogTitle>
                            <DialogDescription>
                                {isAddingNew ? "Please enter your new address details." : "Choose from your saved addresses or add a new one."}
                            </DialogDescription>
                        </DialogHeader>
                        {isAddingNew ? (
                            <form onSubmit={handleFormSubmit} className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="street" className="text-right">Street</Label>
                                    <Input id="street" value={addressForm.street} onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })} className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="city" className="text-right">City</Label>
                                    <Input id="city" value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} className="col-span-3" />
                                </div>
                                <DialogFooter className="pt-4">
                                    <Button type="button" variant="outline" onClick={() => setIsAddingNew(false)}>Back to list</Button>
                                    <Button type="submit" disabled={isSubmitting} className="bg-[#F37321] hover:bg-[#E86A1A] text-white">{isSubmitting ? 'Saving...' : 'Save Address'}</Button>
                                </DialogFooter>
                            </form>
                        ) : (
                            <div className="py-4">
                                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
                                    {allAddresses.map((addr: ShippingAddress) => (
                                        // FIX: Sử dụng _id cho key
                                        <div key={addr._id} className="group p-3 border rounded-md flex justify-between items-center hover:border-orange-400">
                                            <div className="flex-grow cursor-pointer" onClick={() => handleSelectAddress(addr)}>
                                                <p className="font-medium text-sm">{addr.street}, {addr.city}</p>
                                                {addr.isDefault && <span className="text-xs font-semibold text-green-600">Default</span>}
                                            </div>
                                            {!addr.isDefault && (
                                                <AlertDialog>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <AlertDialogTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 invisible group-hover:visible" onClick={(e) => e.stopPropagation()} disabled={isSubmitting}>
                                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Delete Address</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                    <AlertDialogContent className='bg-white'>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action cannot be undone. This will permanently delete the address: <span className="font-semibold">{addr.street}, {addr.city}</span>.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                className="bg-red-600 hover:bg-red-700"
                                                                onClick={() => {
                                                                    if (addr._id) {
                                                                        handleDeleteAddress(addr._id)
                                                                    } else {
                                                                        toast.error("Cannot delete address: Missing ID.")
                                                                    }
                                                                }}
                                                            >
                                                                Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <DialogFooter className="pt-4">
                                    <Tooltip>
                                        <TooltipTrigger className="w-full">
                                            <Button onClick={() => setIsAddingNew(true)} className="w-full" variant="outline" disabled={!canAddAddress}>
                                                <Plus className="h-4 w-4 mr-2" /> Add New Address
                                            </Button>
                                        </TooltipTrigger>
                                        {!canAddAddress && (
                                            <TooltipContent>
                                                <p>You can only have a maximum of 5 addresses.</p>
                                            </TooltipContent>
                                        )}
                                    </Tooltip>
                                </DialogFooter>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </TooltipProvider>
    );
};
