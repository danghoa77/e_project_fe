import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/pages/auth/api";
import React, { useState } from "react";
import { customerApi } from "../api";
import { ShippingAddress } from "@/types/user";
import { Pencil } from "lucide-react";
import AddressModal from "@/components/shared/AddressModal";

export const ProfileForm = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<
    ShippingAddress | undefined
  >(undefined);
  const [allAddresses, setAllAddresses] = useState<ShippingAddress[]>([]);
  const [profile, setProfile] = React.useState<any>(null);

  React.useEffect(() => {
    const loadAddresses = async () => {
      try {
        const res = await customerApi.getAddresses();
        setAllAddresses(res);
        const defaultAddr =
          res.find((addr: ShippingAddress) => addr.isDefault) || res[0];
        setShippingAddress(defaultAddr);
      } catch (error) {
        toast.error("Failed to load addresses.");
        console.error(error);
      }
    };
    loadAddresses();
  }, []);

  React.useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await authApi.getUserProfile();
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };
    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.info("You have been logged out.");
      navigate("/");
    } catch (error) {
      console.error("Failed to logout:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  if (!profile) return <p>Loading user data...</p>;

  return (
    <div className="max-w-3xl bg-white rounded-xl shadow-md p-6 border border-neutral-200">
      <div className="flex items-center gap-4 border-b pb-6 mb-6">
        <img
          src={profile.photoUrl}
          alt={profile.name}
          className="w-20 h-20 rounded-full border border-neutral-300 object-cover"
        />
        <div>
          <h2 className="text-2xl text-[#5c3d2e]">{profile.name}</h2>
          <p className="text-neutral-600">{profile.email}</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <tbody>
            <tr className="border-b">
              <td className="py-3 font-medium text-neutral-700">Phone</td>
              <td className="py-3">{profile.phone || "N/A"}</td>
            </tr>
            <tr className="border-b">
              <td className="py-3 font-medium text-neutral-700">Created At</td>
              <td className="py-3">
                {new Date(profile.createdAt).toLocaleDateString()}
              </td>
            </tr>
            <tr>
              <td className="py-3 font-medium text-neutral-700">Address</td>
              <td className="py-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    {shippingAddress ? (
                      <p>
                        {shippingAddress.street}, {shippingAddress.city}{" "}
                        <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                          Default
                        </span>
                      </p>
                    ) : (
                      <span className="text-neutral-500">
                        No default address set
                      </span>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setIsAddressModalOpen(true)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex gap-4 pt-6">
        <Button
          type="button"
          className="rounded-md hover:bg-stone-100 hover:border-neutral-400 border-2 border-neutral-200"
          onClick={handleLogout}
        >
          Logout
        </Button>
        {profile.role === "admin" && (
          <Button
            type="button"
            onClick={() => navigate("/admin")}
            className="rounded-md hover:bg-stone-100 hover:border-neutral-400 border-2 border-neutral-200"
          >
            Admin Dashboard
          </Button>
        )}
      </div>

      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        addresses={allAddresses}
        setAddresses={setAllAddresses}
        shippingAddress={shippingAddress}
        setShippingAddress={setShippingAddress}
      />
    </div>
  );
};
