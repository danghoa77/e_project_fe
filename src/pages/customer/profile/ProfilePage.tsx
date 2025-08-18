
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileForm } from "./ProfileForm";
import OrderHistory from "./OrderHistory";


const AddressManagement = () => (
    <div>
        <h3 className="font-serif text-2xl">My Addresses</h3>
        <p className="mt-4 text-muted-foreground">Manage your shipping addresses.</p>
    </div>
);

export const ProfilePage = () => {
    return (
        <div className="font-sans bg-[#fcf7f1] min-h-screen">
            <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <h1 className="font-serif text-4xl mb-8">My Account</h1>
                <Tabs defaultValue="profile" className="w-full flex flex-col md:flex-row gap-8">
                    <TabsList className="flex flex-row md:flex-col items-start justify-start p-0 bg-transparent gap-4 md:w-1/5">
                        <TabsTrigger value="profile" className="w-full justify-start data-[state=active]:font-bold data-[state=active]:shadow-none">My Profile</TabsTrigger>
                        <TabsTrigger value="orders" className="w-full justify-start data-[state=active]:font-bold data-[state=active]:shadow-none">Order History</TabsTrigger>
                        <TabsTrigger value="addresses" className="w-full justify-start data-[state=active]:font-bold data-[state=active]:shadow-none">Addresses</TabsTrigger>
                    </TabsList>
                    <div className="flex-1">
                        <TabsContent value="profile"><ProfileForm /></TabsContent>
                        <TabsContent value="orders"><OrderHistory /></TabsContent>
                        <TabsContent value="addresses"><AddressManagement /></TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    );
};