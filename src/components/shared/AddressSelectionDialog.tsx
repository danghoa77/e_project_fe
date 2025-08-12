// src/features/orders/components/AddressSelectionDialog.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from "@/components/ui/badge";
import { ShippingAddress } from '@/types/user';

// Định nghĩa props cho component
interface AddressSelectionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    addresses: ShippingAddress[];
    onSelectAddress: (address: ShippingAddress) => void;
    onAddNewAddress: (newAddress: { street: string; city: string }) => void;
}

export const AddressSelectionDialog = ({
    open,
    onOpenChange,
    addresses,
    onSelectAddress,
    onAddNewAddress,
}: AddressSelectionDialogProps) => {

    const [view, setView] = useState<'list' | 'add'>('list');


    const [newStreet, setNewStreet] = useState('');
    const [newCity, setNewCity] = useState('');


    const handleAddSubmit = () => {
        if (newStreet && newCity) {
            onAddNewAddress({ street: newStreet, city: newCity });
            setNewStreet('');
            setNewCity('');
            setView('list');
        }
    };


    const handleOpenChange = (isOpen: boolean) => {
        if (isOpen) {
            setView('list');
        }
        onOpenChange(isOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-white">
                {view === 'list' ? (
                    <>
                        <DialogHeader>
                            <DialogTitle>Select Shipping Address</DialogTitle>
                        </DialogHeader>
                        <Separator />
                        <ScrollArea className="h-72 w-full pr-6">
                            <div className="space-y-4">
                                {addresses.map((address) => (
                                    <div key={`${address.street}-${address.city}`} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50">
                                        <div>
                                            <p className="font-medium">{address.street}, {address.city}</p>
                                            {address.isDefault && (
                                                <Badge variant="outline" className="mt-1">Default</Badge>
                                            )}
                                        </div>
                                        <Button variant="ghost" onClick={() => onSelectAddress(address)}>
                                            Select
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                        <Separator />
                        <DialogFooter>
                            <Button className="w-full" onClick={() => setView('add')}>
                                Add New Address
                            </Button>
                        </DialogFooter>
                    </>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle>Add New Address</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="street" className="text-right">
                                    Street
                                </Label>
                                <Input
                                    id="street"
                                    value={newStreet}
                                    onChange={(e) => setNewStreet(e.target.value)}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="city" className="text-right">
                                    City
                                </Label>
                                <Input
                                    id="city"
                                    value={newCity}
                                    onChange={(e) => setNewCity(e.target.value)}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setView('list')}>
                                Back
                            </Button>
                            <Button onClick={handleAddSubmit}>Add Address</Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};