// src/features/auth/components/RegisterForm.tsx

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { RegisterSchema } from "../schemas";
import { authApi } from "../api";
import type { LoginResponse } from "@/types/user";
import { AxiosError } from "axios";

export const RegisterForm = () => {
    const navigate = useNavigate();
    const { setUser } = useAuthStore();
    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: { name: "", email: "", phone: "", password: "", confirmPassword: "" },
    });

    const registerMutation = useMutation({
        mutationFn: authApi.register,
        onSuccess: (data: LoginResponse) => {
            toast.success("Account created successfully!");
            setUser(data.user, data.access_token);
            navigate('/');
        },
        onError: (error: AxiosError) => {
            const errorMessage = (error.response?.data as { message?: string[] | string })?.message || "An error occurred while registering.";
            toast.error(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage);
        }
    });

    function onSubmit(values: z.infer<typeof RegisterSchema>) {
        const { password, confirmPassword, ...dataFromForm } = values;

        if (password !== confirmPassword) {
            form.setError("confirmPassword", {
                type: "manual",
                message: "Password does not match.",
            });
            return;
        }

        const payload = { ...dataFromForm, password, role: "customer" };
        registerMutation.mutate(payload);
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
                <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Name</FormLabel><FormControl><Input className="border-0 border-b-2 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0" placeholder="Your Name" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input className="border-0 border-b-2 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0" placeholder="your@email.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input className="border-0 border-b-2 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0" placeholder="Your Phone Number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="password" render={({ field }) => (<FormItem><FormLabel>Password</FormLabel><FormControl><Input className="border-0 border-b-2 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0" type="password" placeholder="••••••••" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="confirmPassword" render={({ field }) => (<FormItem><FormLabel>Confirm Password</FormLabel><FormControl><Input className="border-0 border-b-2 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0" type="password" placeholder="••••••••" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <Button type="submit" className="w-full rounded-none bg-neutral-800 text-white hover:bg-neutral-700" disabled={registerMutation.isPending}>
                    {registerMutation.isPending ? "Creating..." : "Create Account"}
                </Button>
            </form>
        </Form>
    );
}