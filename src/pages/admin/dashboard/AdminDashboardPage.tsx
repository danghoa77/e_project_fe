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
  const [topCategory, setTopCategory] = useState<{
    labels: string[];
    data: number[];
  }>({
    labels: [],
    data: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const resUser = await adminApi.userDashboard();
      const resCate = await adminApi.topCategory();
      const resOrder = await adminApi.orderDashboard();

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

  const topCateChartData = (topCategory.labels || []).map(
    (label: string, idx: number) => ({
      name: label,
      Quantity: Math.round(topCategory.data?.[idx] || 0),
    })
  );

  return (
    <div className="p-4 md:p-8 bg-[#F8F5F0] min-h-screen space-y-6">
      <h1 className="font-bold text-2xl md:text-4xl text-[#5A463C] mb-6 md:mb-8">
        Admin Dashboard
      </h1>

      {/* Tổng quan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <Card className="bg-white rounded-lg shadow-sm border-neutral-200/8">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm md:text-md font-medium">
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <ShoppingCart className="h-6 w-6 md:h-8 md:w-8" />
            <span className="text-xl md:text-2xl font-bold text-neutral-700">
              {orderDashboard.overview?.totalOrders || 0}
            </span>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-lg shadow-sm border-neutral-200/8">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm md:text-md font-medium">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <Users className="h-6 w-6 md:h-8 md:w-8" />
            <span className="text-xl md:text-2xl font-bold text-neutral-700">
              {userDashboard.overview?.totalUsers || 0}
            </span>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-lg shadow-sm border-neutral-200/8">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm md:text-md font-medium">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <DollarSign className="h-6 w-6 md:h-8 md:w-8" />
            <span className="text-xl md:text-2xl font-bold text-neutral-700">
              ${orderDashboard.overview?.totalRevenue || 0}
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <Card className="bg-white shadow-md h-[260px] md:h-[300px]">
          <CardHeader>
            <CardTitle className="text-sm md:text-md">Orders</CardTitle>
          </CardHeader>
          <CardContent className="h-[180px] md:h-[220px]">
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

        <Card className="bg-white shadow-md h-[260px] md:h-[300px]">
          <CardHeader>
            <CardTitle className="text-sm md:text-md">Top Categories</CardTitle>
          </CardHeader>
          <CardContent className="h-[180px] md:h-[220px]">
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

        <Card className="bg-white shadow-md h-[260px] md:h-[300px]">
          <CardHeader>
            <CardTitle className="text-sm md:text-md">Users</CardTitle>
          </CardHeader>
          <CardContent className="h-[180px] md:h-[220px]">
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
