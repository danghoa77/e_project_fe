import React from "react";
import adminApi from "../api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, User } from "lucide-react";
import { UserType } from "@/types/user";
import { Skeleton } from "@/components/ui/skeleton";
import { AddAdminDialog } from "../../../components/shared/AddAdminDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const HERMES_BROWN = "#4A3730";
const HERMES_TEXT_MUTED = "#6E5E58";

export const AdminUsersPage = () => {
  const [users, setUsers] = React.useState<UserType[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = React.useState<string | null>(
    null
  );
  const [currentAdminId, setCurrentAdminId] = React.useState<string | null>(
    null
  );

  React.useEffect(() => {
    const fetchCurrentAdmin = async () => {
      try {
        const res = await adminApi.getCurrentAdmin();
        setCurrentAdminId(res._id);
      } catch (err) {
        console.error("Failed to fetch current admin", err);
      }
    };
    fetchCurrentAdmin();
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await adminApi.fetchAllUser();
        setUsers(res);
      } catch (err) {
        console.error("Failed to fetch users", err);
        setError("Cannot fetch users.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteAdmin = async (id: string) => {
    setDeletingUserId(id);
    try {
      await adminApi.deleteUser(id);
      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (error) {
      console.error("Failed to delete admin:", error);
    } finally {
      setDeletingUserId(null);
    }
  };

  const { admins, customers, adminCount, customerCount } = React.useMemo(() => {
    const adminUsers = users.filter((user) => user.role === "admin");
    const customerUsers = users.filter((user) => user.role === "customer");
    return {
      admins: adminUsers,
      customers: customerUsers,
      adminCount: adminUsers.length,
      customerCount: customerUsers.length,
    };
  }, [users]);

  if (error) {
    return <div className="p-8 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4 md:p-8 space-y-8 bg-stone-50 min-h-screen font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-3xl md:text-4xl text-neutral-800 mb-8">
          Users
        </h1>
        <AddAdminDialog />
      </div>

      {/* Stats cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
        <Card style={{ borderColor: HERMES_BROWN, backgroundColor: "white" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle
              className="text-sm font-medium"
              style={{ color: HERMES_BROWN }}
            >
              Admin
            </CardTitle>
            <Shield className="h-4 w-4" style={{ color: HERMES_TEXT_MUTED }} />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16 bg-stone-200 rounded-md" />
            ) : (
              <div
                className="text-2xl font-bold"
                style={{ color: HERMES_BROWN }}
              >
                {adminCount}
              </div>
            )}
            <p className="text-xs" style={{ color: HERMES_TEXT_MUTED }}>
              Total Admin
            </p>
          </CardContent>
        </Card>

        <Card style={{ borderColor: HERMES_BROWN, backgroundColor: "white" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle
              className="text-sm font-medium"
              style={{ color: HERMES_BROWN }}
            >
              Customer
            </CardTitle>
            <User className="h-4 w-4" style={{ color: HERMES_TEXT_MUTED }} />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16 bg-stone-200 rounded-md" />
            ) : (
              <div
                className="text-2xl font-bold"
                style={{ color: HERMES_BROWN }}
              >
                {customerCount}
              </div>
            )}
            <p className="text-xs" style={{ color: HERMES_TEXT_MUTED }}>
              Total Customer
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Admin list */}
      {!isLoading && (
        <>
          <div className="space-y-4">
            <h2
              className="text-2xl font-semibold"
              style={{ color: HERMES_BROWN }}
            >
              List Admin
            </h2>

            {/* Table for desktop */}
            <div
              className="overflow-x-auto rounded-md border bg-white hidden sm:block"
              style={{ borderColor: HERMES_BROWN }}
            >
              {admins.length > 0 ? (
                <table className="w-full border-collapse">
                  <thead style={{ backgroundColor: "#F5F0E9" }}>
                    <tr>
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Email</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map((admin) => (
                      <tr
                        key={admin._id}
                        className="border-t"
                        style={{ borderColor: "#F5F0E9" }}
                      >
                        <td className="px-4 py-2">{admin.name}</td>
                        <td className="px-4 py-2">{admin.email}</td>
                        <td className="px-4 py-2">
                          {admin._id !== currentAdminId && adminCount > 1 && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  disabled={deletingUserId === admin._id}
                                  className="text-white hover:bg-red-800/90"
                                  style={{ backgroundColor: "#B9473B" }}
                                >
                                  {deletingUserId === admin._id
                                    ? "Deleting..."
                                    : "Delete"}
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-white">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Confirm delete?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete the admin account.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteAdmin(admin._id)}
                                  >
                                    Confirm
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="p-4" style={{ color: HERMES_TEXT_MUTED }}>
                  No Admin found.
                </p>
              )}
            </div>

            {/* Card view for mobile */}
            <div className="space-y-3 sm:hidden">
              {admins.map((admin) => (
                <div
                  key={admin._id}
                  className="p-4 rounded-md border bg-white shadow-sm flex flex-col gap-2"
                  style={{ borderColor: HERMES_BROWN }}
                >
                  <p className="font-semibold" style={{ color: HERMES_BROWN }}>
                    {admin.name}
                  </p>
                  <p className="text-sm" style={{ color: HERMES_TEXT_MUTED }}>
                    {admin.email}
                  </p>
                  {admin._id !== currentAdminId && adminCount > 1 && (
                    <Button
                      size="sm"
                      className="w-full text-white hover:bg-red-800/90"
                      style={{ backgroundColor: "#B9473B" }}
                      disabled={deletingUserId === admin._id}
                      onClick={() => handleDeleteAdmin(admin._id)}
                    >
                      {deletingUserId === admin._id ? "Deleting..." : "Delete"}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Customer list */}
          <div className="space-y-4">
            <h2
              className="text-2xl font-semibold"
              style={{ color: HERMES_BROWN }}
            >
              List Customer
            </h2>

            {/* Table for desktop */}
            <div
              className="overflow-x-auto rounded-md border bg-white hidden sm:block"
              style={{ borderColor: HERMES_BROWN }}
            >
              {customers.length > 0 ? (
                <table className="w-full border-collapse">
                  <thead style={{ backgroundColor: "#F5F0E9" }}>
                    <tr>
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer) => (
                      <tr
                        key={customer._id}
                        className="border-t"
                        style={{ borderColor: "#F5F0E9" }}
                      >
                        <td className="px-4 py-2">{customer.name}</td>
                        <td className="px-4 py-2">{customer.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="p-4" style={{ color: HERMES_TEXT_MUTED }}>
                  No Customer found.
                </p>
              )}
            </div>

            {/* Card view for mobile */}
            <div className="space-y-3 sm:hidden">
              {customers.map((customer) => (
                <div
                  key={customer._id}
                  className="p-4 rounded-md border bg-white shadow-sm flex flex-col gap-2"
                  style={{ borderColor: HERMES_BROWN }}
                >
                  <p className="font-semibold" style={{ color: HERMES_BROWN }}>
                    {customer.name}
                  </p>
                  <p className="text-sm" style={{ color: HERMES_TEXT_MUTED }}>
                    {customer.email}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
