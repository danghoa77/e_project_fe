import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileForm } from "./ProfileForm";
import OrderHistory from "./OrderHistory";

const AddressManagement = () => (
  <div>
    <h3 className="font-serif text-2xl">My Addresses</h3>
    <p className="mt-4 text-muted-foreground">
      Manage your shipping addresses.
    </p>
  </div>
);

export const ProfilePage = () => {
  return (
    <div className="font-sans bg-gray-100 min-h-screen">
      <div className="container mx-auto max-w-6xl py-12 px-6">
        <h1 className="text-4xl mb-8">My Account</h1>
        <Tabs
          defaultValue="profile"
          className="w-full flex flex-col md:flex-row gap-8"
        >
          <TabsList className="flex flex-row md:flex-col items-start justify-start p-0 bg-transparent gap-4 w-full md:w-1/5">
            <TabsTrigger
              value="profile"
              className="w-full justify-start data-[state=active]:font-bold data-[state=active]:shadow-none"
            >
              My Profile
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="w-full justify-start data-[state=active]:font-bold data-[state=active]:shadow-none"
            >
              Order History
            </TabsTrigger>
            <TabsTrigger
              value="loyalty"
              className="w-full justify-start data-[state=active]:font-bold data-[state=active]:shadow-none"
            >
              Hismes Loyalty
            </TabsTrigger>
          </TabsList>

          <div className="w-full md:w-4/5">
            <TabsContent value="profile">
              <ProfileForm />
            </TabsContent>
            <TabsContent value="orders">
              <OrderHistory />
            </TabsContent>
            <TabsContent value="addresses">
              <AddressManagement />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};
