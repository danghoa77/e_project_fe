// src/features/profile/components/ProfileForm.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";
import ProfileSchema from "./schemas";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const ProfileForm = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof ProfileSchema>>({
        resolver: zodResolver(ProfileSchema),
        defaultValues: { name: user?.name || "", phone: "" }, // Thêm phone từ user nếu có
    });

    function onSubmit(values: z.infer<typeof ProfileSchema>) {
        console.log("Updating profile with:", values);
        // TODO: Gọi API PATCH /users/me với 'values'
        toast.success("Profile updated successfully!");
    }

    const handleLogout = () => {
        logout();
        toast.info("You have been logged out.");
        navigate('/');
    }

    if (!user) return <p>Loading user data...</p>;

    return (
        <div className="max-w-2xl">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl><Input value={user.email} disabled /></FormControl>
                    </FormItem>
                    <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <div className="flex gap-4">
                        <Button type="submit" className="rounded-none bg-neutral-800 hover:bg-neutral-700">Save Changes</Button>
                        <Button type="button" variant="outline" className="rounded-none" onClick={handleLogout}>Logout</Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};