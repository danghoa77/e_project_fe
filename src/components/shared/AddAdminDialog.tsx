import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PlusCircle } from "lucide-react";
import adminApi from "@/pages/admin/api";
import { RegisterSchema } from "@/pages/auth/schemas";

type RegisterFormData = z.infer<typeof RegisterSchema>;


const HERMES_ORANGE = "#F37021";
const HERMES_ORANGE_HOVER = "#E0651A";

const HERMES_BROWN = "#4A3730";

const HERMES_CREAM = "#F5F0E9";


export function AddAdminDialog() {
    const [open, setOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<RegisterFormData>({
        resolver: zodResolver(RegisterSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        const { confirmPassword, ...rest } = data;
        const payload = {
            ...rest,
            role: "admin",
        };

        setIsLoading(true);
        try {
            const res = await adminApi.createUser(payload);
            console.log("Admin created:", res);
            reset();
            setOpen(false);
            window.location.reload();
        } catch (error) {
            console.error("Failed to create admin:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                
                <Button style={{ backgroundColor: HERMES_ORANGE, color: 'white' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = HERMES_ORANGE_HOVER}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = HERMES_ORANGE}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Admin
                </Button>
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-md" style={{ backgroundColor: HERMES_CREAM, borderColor: HERMES_BROWN, borderWidth: '2px' }}>
                <DialogHeader>
                    
                    <DialogTitle style={{ color: HERMES_BROWN }}>Create new admin</DialogTitle>
                    <DialogDescription style={{ color: HERMES_BROWN }}>
                        Fill in the form below to create a new admin.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    
                    <div>
                        <Input placeholder="Full name" {...register("name")} className="border-gray-400 focus:border-orange-500 focus:ring-orange-500" />
                        {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
                    </div>
                    <div>
                        <Input placeholder="Email" {...register("email")} className="border-gray-400 focus:border-orange-500 focus:ring-orange-500" />
                        {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
                    </div>
                    <div>
                        <Input placeholder="Password" type="password" {...register("password")} className="border-gray-400 focus:border-orange-500 focus:ring-orange-500" />
                        {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
                    </div>
                    <div>
                        <Input placeholder="Confirm Password" type="password" {...register("confirmPassword")} className="border-gray-400 focus:border-orange-500 focus:ring-orange-500" />
                        {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>}
                    </div>
                    <div>
                        <Input placeholder="Phone number" {...register("phone")} className="border-gray-400 focus:border-orange-500 focus:ring-orange-500" />
                        {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
                    </div>
                    
                    <Button type="submit" className="w-full text-white" disabled={isLoading}
                        style={{ backgroundColor: isLoading ? '#F9A87C' : HERMES_ORANGE }}
                        onMouseOver={(e) => !isLoading && (e.currentTarget.style.backgroundColor = HERMES_ORANGE_HOVER)}
                        onMouseOut={(e) => !isLoading && (e.currentTarget.style.backgroundColor = HERMES_ORANGE)}>
                        {isLoading ? "Creating..." : "Create"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}