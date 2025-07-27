import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginSchema, RegisterSchema } from "./schemas";

const GoogleIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
);

const LoginForm = () => {
    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema), defaultValues: { email: "", password: "" },
    });

    function onSubmit(values: z.infer<typeof LoginSchema>) { console.log("Login values:", values); }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
                <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input className="border-0 border-b-2 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0" placeholder="your@email.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="password" render={({ field }) => (<FormItem><FormLabel>Password</FormLabel><FormControl><Input className="border-0 border-b-2 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0" type="password" placeholder="••••••••" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <Button type="submit" className="w-full rounded-none text-white bg-neutral-800 hover:bg-neutral-700">Login</Button>
                <div className="flex items-center gap-2 md:gap-4"><div className="flex-grow border-t border-neutral-300"></div><span className="text-[0.7rem] md:text-xs text-neutral-500 uppercase">Or continue with</span><div className="flex-grow border-t border-neutral-300"></div></div>
                <Button variant="outline" type="button" className="w-full rounded-none"><GoogleIcon /> Continue with Google</Button>
            </form>
        </Form>
    );
};

const RegisterForm = () => {
    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: { name: "", email: "", phone: "", password: "", confirmPassword: "" },
    });

    function onSubmit(values: z.infer<typeof RegisterSchema>) {
        // THAY ĐỔI: Sử dụng `delete` để loại bỏ trường confirmPassword, tránh lỗi unused-var
        const payload = { ...values, role: 'customer' as const };
        delete (payload as { confirmPassword?: string }).confirmPassword;

        console.log("Payload to send to backend:", payload);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
                <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Name</FormLabel><FormControl><Input className="border-0 border-b-2 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0" placeholder="Your Name" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input className="border-0 border-b-2 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0" placeholder="your@email.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input className="border-0 border-b-2 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0" placeholder="Your Phone Number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="password" render={({ field }) => (<FormItem><FormLabel>Password</FormLabel><FormControl><Input className="border-0 border-b-2 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0" type="password" placeholder="••••••••" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                    <FormItem><FormLabel>Confirm Password</FormLabel><FormControl><Input className="border-0 border-b-2 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0" type="password" placeholder="••••••••" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <Button type="submit" className="w-full rounded-none bg-neutral-800 text-white hover:bg-neutral-700">Create Account</Button>
            </form>
        </Form>
    );
}

export const AuthPage = () => {
    return (
        <div className="font-sans flex items-center justify-center min-h-[calc(100vh-200px)] py-6 md:py-12 text-left px-4 md:px-0">
            <Tabs defaultValue="login" className="w-full max-w-md">
                <TabsList className="grid w-full grid-cols-2 bg-transparent p-0">
                    <TabsTrigger value="login" className="rounded-none bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 border-black text-sm md:text-base">Login</TabsTrigger>
                    <TabsTrigger value="register" className="rounded-none bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 border-black text-sm md:text-base">Register</TabsTrigger>
                </TabsList>
                <TabsContent value="login" className="pt-6 md:pt-8">
                    <h1 className="font-sans text-2xl md:text-3xl font-bold">Welcome Back</h1>
                    <p className="text-muted-foreground mt-2 text-sm md:text-base">Enter your credentials to access your account.</p>
                    <div className="mt-4 md:mt-8"><LoginForm /></div>
                </TabsContent>
                <TabsContent value="register" className="pt-6 md:pt-8">
                    <h1 className="font-sans text-2xl md:text-3xl font-bold">Create an Account</h1>
                    <p className="text-muted-foreground mt-2 text-sm md:text-base">Enter your details below to create a new account.</p>
                    <div className="mt-4 md:mt-8"><RegisterForm /></div>
                </TabsContent>
            </Tabs>
        </div>
    );
};