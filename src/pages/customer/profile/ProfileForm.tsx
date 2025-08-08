// src/features/profile/components/ProfileForm.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";
import ProfileSchema from "./schemas";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { getUserProfile } from "@/pages/auth/api";
import React from "react";

// --- Bảng màu Hermès ---
const HERMES_ORANGE = "#F37021";
const HERMES_ORANGE_HOVER = "#E0651A"; // Màu cam đậm hơn khi hover
const HERMES_BROWN = "#4A3730"; // Màu nâu sẫm cho văn bản và viền
const HERMES_BROWN_HOVER = "#382A24";

export const ProfileForm = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [role, setRole] = React.useState<string | null>(null);

    const form = useForm<z.infer<typeof ProfileSchema>>({
        resolver: zodResolver(ProfileSchema),
        defaultValues: { name: user?.name || "", phone: user?.phone || "" },
    });

    function onSubmit(values: z.infer<typeof ProfileSchema>) {
        console.log("Updating profile with:", values);
        // TODO: Gọi API PATCH /users/me với 'values'
        toast.success("Profile updated successfully!");
    }

    React.useEffect(() => {
        const fetchUserProfile = async () => {
            const res = await getUserProfile();
            console.log(res.data.role);
            setRole(res.data.role);
        }
        fetchUserProfile();
    }, [user]);

    const handleLogout = async () => {
        try {
            // NOTE: Giả sử logout() từ useAuthStore đã xử lý việc gọi API
            await logout();
            toast.info("You have been logged out.");
            navigate('/');
        } catch (error) {
            console.error("Failed to logout:", error);
            toast.error("Logout failed. Please try again.");
        }
    };

    if (!user) return <p>Loading user data...</p>;

    return (
        <div className="max-w-2xl">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel style={{ color: HERMES_BROWN }}>Full Name</FormLabel>
                                <FormControl>
                                    <Input {...field} className="rounded-none border-gray-400 focus:border-orange-500 focus:ring-orange-500" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormItem>
                        <FormLabel style={{ color: HERMES_BROWN }}>Email</FormLabel>
                        <FormControl>
                            <Input value={user.email} disabled className="rounded-none" />
                        </FormControl>
                    </FormItem>
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel style={{ color: HERMES_BROWN }}>Phone Number</FormLabel>
                                <FormControl>
                                    <Input {...field} className="rounded-none border-gray-400 focus:border-orange-500 focus:ring-orange-500" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex gap-4 pt-4">
                        <Button
                            type="submit"
                            className="rounded-none text-white"
                            style={{ backgroundColor: HERMES_ORANGE }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = HERMES_ORANGE_HOVER}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = HERMES_ORANGE}
                        >
                            Save Changes
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="rounded-none hover:bg-stone-100"
                            style={{ borderColor: HERMES_BROWN, color: HERMES_BROWN }}
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                        {role === "admin" && (
                            <Button
                                type="button"
                                onClick={() => navigate("/admin")}
                                className=" rounded-none text-white"
                                style={{ backgroundColor: HERMES_BROWN }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = HERMES_BROWN_HOVER}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = HERMES_BROWN}
                            >
                                Admin Dashboard
                            </Button>
                        )}

                    </div>
                </form>
            </Form>
        </div>
    );
};