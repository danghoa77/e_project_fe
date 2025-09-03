import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { ShippingAddress } from "@/types/user";
import { customerApi } from "@/pages/customer/api";

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  addresses: ShippingAddress[];
  setAddresses: React.Dispatch<React.SetStateAction<ShippingAddress[]>>;
  shippingAddress?: ShippingAddress;
  setShippingAddress: React.Dispatch<
    React.SetStateAction<ShippingAddress | undefined>
  >;
}

const AddressModal: React.FC<AddressModalProps> = ({
  isOpen,
  onClose,
  addresses,
  setAddresses,
  shippingAddress,
  setShippingAddress,
}) => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [addressForm, setAddressForm] = useState({ street: "", city: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canAddAddress = addresses.length < 5;

  const handleSelectAddress = async (address: ShippingAddress) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const payload = { addresses: [{ ...address, isDefault: true }] };
    try {
      const res = await customerApi.updateProfile(payload);
      setAddresses(res.addresses);
      setShippingAddress(
        res.addresses.find((a: ShippingAddress) => a.isDefault)
      );
      toast.success(`Default address updated: ${address.street}`);
      onClose();
    } catch {
      toast.error("Could not switch address.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canAddAddress) {
      toast.warning("You can only have a maximum of 5 addresses.");
      return;
    }
    if (!addressForm.street || !addressForm.city) {
      toast.warning("Please fill in all address fields.");
      return;
    }
    setIsSubmitting(true);
    const newAddressPayload = {
      addresses: [{ ...addressForm, isDefault: true }],
    };
    try {
      const res = await customerApi.updateProfile(newAddressPayload);
      setAddresses(res.addresses);
      setShippingAddress(
        res.addresses.find((a: ShippingAddress) => a.isDefault)
      );
      toast.success("New address added successfully!");
      setIsAddingNew(false);
      setAddressForm({ street: "", city: "" });
      onClose();
    } catch {
      toast.error("Could not add address.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    setIsSubmitting(true);
    try {
      await customerApi.deleteAddress(id);
      const updated = addresses.filter((addr) => addr._id !== id);
      if (shippingAddress?._id === id) {
        const newDefault = updated.find((addr) => addr.isDefault) || updated[0];
        setShippingAddress(newDefault);
      }
      setAddresses(updated);
      toast.success("Address has been deleted.");
    } catch {
      toast.error("Failed to delete address.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] bg-white">
        <DialogHeader>
          <DialogTitle>
            {isAddingNew ? "Add New Address" : "Select Shipping Address"}
          </DialogTitle>
          <DialogDescription>
            {isAddingNew
              ? "Enter your new address details."
              : "Choose from your saved addresses or add a new one."}
          </DialogDescription>
        </DialogHeader>

        {isAddingNew ? (
          <form onSubmit={handleFormSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="street" className="text-right">
                Street
              </Label>
              <Input
                id="street"
                value={addressForm.street}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, street: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="city" className="text-right">
                City
              </Label>
              <Input
                id="city"
                value={addressForm.city}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, city: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddingNew(false)}
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#F37321] hover:bg-[#E86A1A] text-white"
              >
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="py-4">
            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
              {addresses.map((addr) => (
                <div
                  key={addr._id}
                  className="group p-3 border rounded-md flex justify-between items-center hover:border-orange-400"
                >
                  <div
                    className="flex-grow cursor-pointer"
                    onClick={() => handleSelectAddress(addr)}
                  >
                    <p className="font-medium text-sm">
                      {addr.street}, {addr.city}
                    </p>
                    {addr.isDefault && (
                      <span className="text-xs font-semibold text-green-600">
                        Default
                      </span>
                    )}
                  </div>
                  {!addr.isDefault && (
                    <AlertDialog>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 invisible group-hover:visible"
                                onClick={(e) => e.stopPropagation()}
                                disabled={isSubmitting}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </AlertDialogTrigger>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete Address</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <AlertDialogContent className="bg-white">
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you sure you want to delete?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete{" "}
                            <span className="font-semibold">
                              {addr.street}, {addr.city}
                            </span>
                            .
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() =>
                              addr._id && handleDeleteAddress(addr._id)
                            }
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
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => setIsAddingNew(true)}
                      className="w-full"
                      variant="outline"
                      disabled={!canAddAddress}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add New Address
                    </Button>
                  </TooltipTrigger>
                  {!canAddAddress && (
                    <TooltipContent>
                      <p>You can only have 5 addresses.</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddressModal;
