import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Link } from "react-router-dom";
import { Minus, Plus, X } from "lucide-react";
import { customerApi } from "../api";
import type { Cart, CartResponse } from "@/types/cart";
import { DialogContent } from "@radix-ui/react-dialog";
import userStore from "@/store/userStore";

export const CartSheet = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { decreaseCartItemCount } = userStore();

  const [isOpen, setIsOpen] = useState(false);
  const [cart, setCart] = useState<Cart>({ items: [] });

  const [loading, setLoading] = useState(false);

  // loading cho từng item
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(
    new Set()
  );

  const normalizeCart = useCallback((data: any): Cart => {
    if (Array.isArray(data)) return { items: data };

    if (data && Array.isArray(data.items))
      return { items: data.items };

    return { items: [] };
  }, []);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);

      const res: CartResponse = await customerApi.getCart();

      setCart(normalizeCart(res));
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  }, [normalizeCart]);

  const subtotal = useMemo(() => {
    return cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }, [cart.items]);

  const setItemUpdating = useCallback(
    (variantId: string, loading: boolean) => {
      setUpdatingItems((prev) => {
        const next = new Set(prev);

        if (loading) {
          next.add(variantId);
        } else {
          next.delete(variantId);
        }

        return next;
      });
    },
    []
  );

  const updateQuantity = useCallback(
    async (
      productId: string,
      variantId: string,
      sizeId: string,
      quantity: number
    ) => {
      if (quantity < 1) return;

      if (updatingItems.has(variantId)) return;

      const previousItems = cart.items;

      // Optimistic Update
      setCart((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.variantId === variantId
            ? {
                ...item,
                quantity,
              }
            : item
        ),
      }));

      setItemUpdating(variantId, true);

      try {
        await customerApi.updateQuantity(
          productId,
          variantId,
          sizeId,
          quantity
        );

        // Nếu backend chỉ trả success thì
        // không cần setCart lần nữa.
      } catch (error) {
        console.error("Error updating quantity:", error);

        // Rollback
        setCart((prev) => ({
          ...prev,
          items: previousItems,
        }));
      } finally {
        setItemUpdating(variantId, false);
      }
    },
    [cart.items, updatingItems, setItemUpdating]
  );

  const removeItem = useCallback(
    async (
      productId: string,
      variantId: string,
      sizeId: string
    ) => {
      if (updatingItems.has(variantId)) return;

      const previousItems = cart.items;

      // Optimistic Remove
      setCart((prev) => ({
        ...prev,
        items: prev.items.filter(
          (item) => item.variantId !== variantId
        ),
      }));

      setItemUpdating(variantId, true);

      try {
        await customerApi.removeItemFromCart(
          productId,
          variantId,
          sizeId
        );

        decreaseCartItemCount();
      } catch (error) {
        console.error("Error removing item:", error);

        // Rollback
        setCart((prev) => ({
          ...prev,
          items: previousItems,
        }));
      } finally {
        setItemUpdating(variantId, false);
      }
    },
    [
      cart.items,
      updatingItems,
      decreaseCartItemCount,
      setItemUpdating,
    ]
  );

  const handleCheckout = useCallback(() => {
    console.log("Proceeding to checkout:", cart.items);

    setIsOpen(false);
  }, [cart.items]);

  useEffect(() => {
    if (!isOpen) return;

    fetchCart();
  }, [isOpen, fetchCart]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      {children}

      <SheetContent className="w-full sm:max-w-md bg-[#fcf7f1] p-0 flex flex-col font-sans">
        <DialogContent />

        <SheetHeader className="relative p-6 border-b border-neutral-200">
          <SheetTitle className="text-xl text-left font-normal tracking-wider uppercase">
            Your Cart
          </SheetTitle>

          <SheetClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1/2 right-4 -translate-y-1/2"
            >
              <X className="h-5 w-5" />
            </Button>
          </SheetClose>
        </SheetHeader>
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            Loading...
          </div>
        ) : cart.items.length > 0 ? (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.items.map((item) => {
                const isUpdating = updatingItems.has(item.variantId);

                return (
                  <div
                    key={item.variantId}
                    className="flex gap-4 items-start"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-24 w-20 object-cover"
                    />

                    <div className="flex-1 flex flex-col justify-between text-sm">
                      <div>
                        <p className="font-semibold text-neutral-800">
                          {item.name}
                        </p>

                        <p className="text-neutral-500">
                          {item.color} / {item.size}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-neutral-300">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            disabled={
                              isUpdating || item.quantity <= 1
                            }
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.variantId,
                                item.sizeId,
                                item.quantity - 1
                              )
                            }
                          >
                            <Minus className="h-4 w-4" />
                          </Button>

                          <span className="w-8 text-center">
                            {item.quantity}
                          </span>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            disabled={isUpdating}
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.variantId,
                                item.sizeId,
                                item.quantity + 1
                              )
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <p className="font-semibold">
                          $
                          {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 self-start"
                      disabled={isUpdating}
                      onClick={() =>
                        removeItem(
                          item.productId,
                          item.variantId,
                          item.sizeId
                        )
                      }
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>

            <SheetFooter className="p-6 border-t border-neutral-200 bg-[#fcf7f1]">
              <div className="w-full space-y-4">
                <div className="flex justify-between font-semibold">
                  <span>
                    Subtotal ({cart.items.length} items)
                  </span>

                  <span>${subtotal.toFixed(2)}</span>
                </div>

                <Button
                  asChild
                  className="w-full rounded-none bg-neutral-800 hover:bg-neutral-700 text-white uppercase"
                >
                  <Link
                    to="/checkout"
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                  </Link>
                </Button>
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <p className="text-lg font-serif">
              Your bag is empty.
            </p>

            <p className="text-neutral-500 mt-2">
              Add items to your bag to see them here.
            </p>

            <SheetClose asChild>
              <Button
                asChild
                variant="link"
                className="mt-4 text-neutral-800 hover:text-black"
              >
                <Link to="/products">
                  Continue Shopping
                </Link>
              </Button>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

