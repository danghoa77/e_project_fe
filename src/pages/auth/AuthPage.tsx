

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "./components/LoginForm";
import { RegisterForm } from "./components/RegisterForm";

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