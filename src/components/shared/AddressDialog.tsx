import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useUserStore } from '@/store/userStore';
import type { Address } from '../../types/user';
import { useForm } from 'react-hook-form';
import type { Address as AddressType } from '@/types/user';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AddAddressSchema } from '../../pages/customer/orders/schemas';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ChevronLeft } from 'lucide-react';

const AddAddressView = ({ onBack, onSuccess }: { onBack: () => void, onSuccess: () => void }) => {
    const { addAddress } = useUserStore();
    const form = useForm<z.infer<typeof AddAddressSchema>>({
        resolver: zodResolver(AddAddressSchema), defaultValues: { street: "", city: "" },
    });

    function onSubmit(values: z.infer<typeof AddAddressSchema>) {
        addAddress(values);
        onSuccess();
    }

    return (
        <div>
            <div className="flex items-center mb-4"><Button variant="ghost" size="icon" className="mr-2" onClick={onBack}><ChevronLeft /></Button><DialogTitle>New Address</DialogTitle></div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField control={form.control} name="street" render={({ field }) => (<FormItem><Label>Street Address</Label><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="city" render={({ field }) => (<FormItem><Label>City</Label><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <Button type="submit" className="w-full rounded-none bg-neutral-800 hover:bg-neutral-700">Add Address</Button>
                </form>
            </Form>
        </div>
    );
}

const AddressListView = ({ onAddressSelect, onAddNew }: { onAddressSelect: (address: Address) => void, onAddNew: () => void }) => {
    const { addresses, setDefaultAddress } = useUserStore();
    const defaultAddress = addresses.find(a => a.isDefault);

    return (
        <div>
            <DialogHeader><DialogTitle>Change Shipping Address</DialogTitle></DialogHeader>
            <div className="max-h-64 overflow-y-auto my-4 pr-4">
                <RadioGroup defaultValue={defaultAddress?.id} onValueChange={(value) => {
                    const selectedAddress = addresses.find(a => a.id === value);
                    if (selectedAddress) {
                        onAddressSelect(selectedAddress);
                        setDefaultAddress(selectedAddress.id);
                    }
                }}>
                    {addresses.map(addr => (
                        <div key={addr.id} className="flex items-center space-x-2 py-2">
                            <RadioGroupItem value={addr.id} id={addr.id} />
                            <Label htmlFor={addr.id} className="font-normal cursor-pointer">{addr.street}, {addr.city} {addr.isDefault && <span className="font-semibold text-neutral-800"> (Default)</span>}</Label>
                        </div>
                    ))}
                </RadioGroup>
            </div>
            <DialogFooter className="sm:justify-between flex-col sm:flex-row gap-2">
                <Button variant="outline" className="rounded-none" onClick={onAddNew}>Add a new address</Button>
                <DialogClose asChild><Button type="button" className="rounded-none">Done</Button></DialogClose>
            </DialogFooter>
        </div>
    );
}

const AddressDialog = ({ onAddressSelect, children }: { onAddressSelect: (address: AddressType) => void, children: React.ReactNode }) => {
    const [view, setView] = useState<'list' | 'add'>('list');

    return (
        <Dialog onOpenChange={(isOpen) => !isOpen && setView('list')}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            {/* Thêm font-sans ở đây */}
            <DialogContent className="sm:max-w-md bg-[#fcf7f1] font-sans">
                {view === 'list' ? (
                    <AddressListView onAddressSelect={onAddressSelect} onAddNew={() => setView('add')} />
                ) : (
                    <AddAddressView onBack={() => setView('list')} onSuccess={() => setView('list')} />
                )}
            </DialogContent>
        </Dialog>
    );
}

export default AddressDialog