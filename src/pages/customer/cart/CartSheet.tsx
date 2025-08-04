import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { useCartStore } from "@/store/cartStore";
import { Link } from "react-router-dom";
import { Minus, Plus, X } from "lucide-react";

export const CartSheet = ({ children }: { children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { cart, updateQuantity, removeItem, selectedItems, toggleItemSelection, toggleSelectAll } = useCartStore();

    const subtotal = cart.items
        .filter(item => selectedItems.includes(item.variantId))
        .reduce((acc, item) => acc + item.price * item.quantity, 0);

    const isAllSelected = cart.items.length > 0 && selectedItems.length === cart.items.length;
    const isCheckoutDisabled = selectedItems.length === 0;

    const handleCheckout = () => {
        const itemsToCheckout = cart.items.filter(item => selectedItems.includes(item.variantId));
        console.log("Proceeding to checkout with:", itemsToCheckout);
        setIsOpen(false);
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            {children}
            <SheetContent className="w-full sm:max-w-md bg-[#fcf7f1] p-0 flex flex-col font-sans">

                {/* --- PHẦN ĐÃ CẬP NHẬT --- */}
                <SheetHeader className="relative p-6 border-b border-neutral-200">
                    <SheetTitle className="text-xl text-left font-normal tracking-wider uppercase">Your Cart</SheetTitle>
                    {/* Thêm nút đóng ở đây */}
                    <SheetClose asChild>
                        <Button variant="ghost" size="icon" className="absolute top-1/2 right-4 -translate-y-1/2">
                            <X className="h-5 w-5" />
                            <span className="sr-only">Close</span>
                        </Button>
                    </SheetClose>
                </SheetHeader>
                {/* --- KẾT THÚC PHẦN CẬP NHẬT --- */}


                {cart.items.length > 0 ? (
                    <>
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="select-all" checked={isAllSelected} onCheckedChange={toggleSelectAll} />
                                <label htmlFor="select-all" className="text-sm font-medium">Select All ({selectedItems.length} items)</label>
                            </div>

                            {cart.items.map(item => (
                                <div key={item.variantId} className="flex gap-4 items-start">
                                    <Checkbox className="mt-1" checked={selectedItems.includes(item.variantId)} onCheckedChange={() => toggleItemSelection(item.variantId)} />
                                    <img src={item.image} alt={item.name} className="h-24 w-20 object-cover" />
                                    <div className="flex-1 flex flex-col justify-between text-sm">
                                        <div>
                                            <p className="font-semibold text-neutral-800">{item.name}</p>
                                            <p className="text-neutral-500">{item.color} / {item.size}</p>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center border border-neutral-300">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none" onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}><Minus className="h-4 w-4" /></Button>
                                                <span className="w-8 text-center">{item.quantity}</span>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none" onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}><Plus className="h-4 w-4" /></Button>
                                            </div>
                                            <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 self-start" onClick={() => removeItem(item.productId, item.variantId)}><X className="h-4 w-4" /></Button>
                                </div>
                            ))}
                        </div>
                        <SheetFooter className="p-6 border-t border-neutral-200 bg-[#fcf7f1]">
                            <div className="w-full space-y-4">
                                <div className="flex justify-between font-semibold">
                                    <span>Subtotal ({selectedItems.length} items)</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                {isCheckoutDisabled ? (
                                    <Button className="w-full rounded-none bg-neutral-800 text-white uppercase opacity-50 cursor-not-allowed" disabled>
                                        Proceed to Checkout
                                    </Button>
                                ) : (
                                    <Button asChild className="w-full rounded-none bg-neutral-800 hover:bg-neutral-700 text-white uppercase">
                                        <Link to="/checkout" onClick={handleCheckout}>Proceed to Checkout</Link>
                                    </Button>
                                )}
                            </div>
                        </SheetFooter>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                        <p className="text-lg font-serif">Your bag is empty.</p>
                        <p className="text-neutral-500 mt-2">Add items to your bag to see them here.</p>
                        <SheetClose asChild>
                            <Button asChild variant="link" className="mt-4 text-neutral-800 hover:text-black">
                                <Link to="/products">Continue Shopping</Link>
                            </Button>
                        </SheetClose>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
};