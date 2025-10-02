import { DollarSign, Users, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import adminApi from "../api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const AdminDashboardPage = () => {
  const [userDashboard, setUserDashboard] = useState<any>({});
  const [orderDashboard, setOrderDashboard] = useState<any>({});
  const [topCategory, setTopCategory] = useState<any[]>([]);
  const [allCategory, setAllCategory] = useState<any[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const resUser = await adminApi.userDashboard();
      const allCate = await adminApi.getAllCategory();
      const resCate = await adminApi.topCategory();
      const resOrder = await adminApi.orderDashboard();

      setAllCategory(allCate);
      setUserDashboard(resUser);
      setTopCategory(resCate);
      setOrderDashboard(resOrder);
    };
    fetchData();
  }, []);
  const orderChartData = [
    {
      name: "Weekly",
      Orders: Math.round(orderDashboard.weekly?.totalOrders || 0),
    },
    {
      name: "Monthly",
      Orders: Math.round(orderDashboard.monthly?.totalOrders || 0),
    },
    {
      name: "Overview",
      Orders: Math.round(orderDashboard.overview?.totalOrders || 0),
    },
  ];

  const userChartData = [
    {
      name: "Weekly",
      Users: Math.round(userDashboard.weekly?.totalUsers || 0),
    },
    {
      name: "Monthly",
      Users: Math.round(userDashboard.monthly?.totalUsers || 0),
    },
    {
      name: "Overview",
      Users: Math.round(userDashboard.overview?.totalUsers || 0),
    },
  ];

  const topCateChartData = topCategory
    .filter((tc) => tc.totalQuantity > 0)
    .sort((a, b) => b.totalQuantity - a.totalQuantity)
    .slice(0, 5)
    .map((tc) => {
      const category = allCategory.find((c) => c._id === tc._id);
      return {
        name: category ? category.name : "Unknown",
        Quantity: Math.round(tc.totalQuantity),
      };
    });

  return (
    <div className="p-8 bg-[#F8F5F0] min-h-screen space-y-8">
      <h1 className="font-bold text-4xl text-[#5A463C] mb-8">
        Admin Dashboard
      </h1>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white rounded-lg shadow-sm border-neutral-200/8">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-medium ">Total Orders</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <ShoppingCart className="h-8 w-8 " />
            <span className="text-2xl font-bold text-neutral-700">
              {orderDashboard.overview?.totalOrders || 0}
            </span>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-lg shadow-sm border-neutral-200/8">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-medium ">Total Users</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <Users className="h-8 w-8 " />
            <span className="text-2xl font-bold text-neutral-700">
              {userDashboard.overview?.totalUsers || 0}
            </span>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-lg shadow-sm border-neutral-200/8">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <DollarSign className="h-8 w-8 " />
            <span className="text-2xl font-bold text-neutral-700">
              ${orderDashboard.overview?.totalRevenue || 0}
            </span>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white shadow-md h-[300px]">
          <CardHeader>
            <CardTitle>Orders</CardTitle>
          </CardHeader>
          <CardContent className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="Orders" fill="#D9B382" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md h-[300px]">
          <CardHeader>
            <CardTitle>Top Categories</CardTitle>
          </CardHeader>
          <CardContent className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topCateChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="Quantity" fill="#8C6239" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md h-[300px]">
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="Users" fill="#C19A6B" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
