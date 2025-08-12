// src/features/cart/CartPage.tsx
import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CartResponse } from "@/types/cart";
import { customerApi } from "../api";
import { ShippingAddress } from "@/types/user";

export const CartPage = () => {
    const [cart, setCart] = useState<CartResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [shipping, setShipping] = useState<ShippingAddress>({
        id: "",
        street: "",
        city: "",
    });

    const fetchCart = async () => {
        try {
            const res = await customerApi.getCart();
            setCart(res);
        } catch (err) {
            console.error("Error fetching cart:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const changeQuantity = (index: number, delta: number) => {
        if (!cart) return;

        const updatedItems = [...cart.items];
        const currentQty = updatedItems[index].quantity;
        const newQty = currentQty + delta;

        if (newQty < 1) return;

        updatedItems[index] = {
            ...updatedItems[index],
            quantity: newQty,
        };

        setCart({ ...cart, items: updatedItems });
    };

    const submitOrder = async () => {
        const finalShipping = {
            street: shipping.street || "123 Test Street",
            city: shipping.city || "Test City",
        };

        if (!cart || cart.items.length === 0) {
            alert("Your cart is empty.");
            return;
        }

        const orderPayload = {
            items: cart.items.map((i) => ({
                productId: i.productId,
                name: i.name,
                variantId: i.variantId,
                imageUrl: i.imageUrl,
                quantity: i.quantity,
            })),
            shippingAddress: finalShipping,
        };

        try {
            await customerApi.createOrder(orderPayload);
            alert("Order created successfully!");
        } catch (err) {
            console.error(err);
            alert("Failed to create order.");
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-10 space-y-6">
            <Card className="shadow-sm border border-gray-200 rounded-none">
                <CardHeader className="border-b border-gray-100">
                    <CardTitle className="text-2xl font-light tracking-wide">
                        Your Cart
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    {loading ? (
                        <Skeleton className="h-10 w-full" />
                    ) : cart && cart.items.length > 0 ? (
                        <>
                            <div className="overflow-x-auto">
                                <Table className="table-fixed w-full">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-24">Product</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead className="w-40">Quantity</TableHead>
                                            <TableHead className="w-24">Price</TableHead>
                                            <TableHead className="w-28">Total</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {cart.items.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <img
                                                        src={item.imageUrl}
                                                        alt={item.name}
                                                        className="w-20 h-20 object-cover border border-gray-100"
                                                    />
                                                </TableCell>
                                                <TableCell>{item.name}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2 justify-center">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => changeQuantity(index, -1)}
                                                        >
                                                            −
                                                        </Button>
                                                        <span className="inline-block w-6 text-center">
                                                            {item.quantity}
                                                        </span>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => changeQuantity(index, 1)}
                                                        >
                                                            +
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {item.price.toLocaleString()} $
                                                </TableCell>
                                                <TableCell>
                                                    {(item.price * item.quantity).toLocaleString()} $
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Shipping Form */}
                            <div className="mt-6 grid grid-cols-2 gap-4">
                                <Input
                                    placeholder="Street Address"
                                    value={shipping.street}
                                    onChange={(e) =>
                                        setShipping({ ...shipping, street: e.target.value })
                                    }
                                />
                                <Input
                                    placeholder="City"
                                    value={shipping.city}
                                    onChange={(e) =>
                                        setShipping({ ...shipping, city: e.target.value })
                                    }
                                />
                            </div>

                            <div className="mt-6 flex justify-between">
                                <Button
                                    className="rounded-none bg-black text-white px-8 py-2 tracking-wide hover:bg-gray-800"
                                    onClick={submitOrder}
                                >
                                    Checkout
                                </Button>
                            </div>
                        </>
                    ) : (
                        <p className="text-gray-500 text-center py-8">
                            Your cart is empty.
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
