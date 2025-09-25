import { DollarSign, Users, ShoppingCart, RefreshCw } from "lucide-react";
import { AdminDashboardCard } from "./AdminDashboardCard";

export const AdminDashboardPage = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-bold  text-3xl md:text-4xl text-neutral-800 mt-8 mb-8">
          Dashboard
        </h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <AdminDashboardCard
          title="Total Sales"
          value="$9,328.55"
          change="+15.6% this week"
          isPositive={true}
          icon={DollarSign}
        />
        <AdminDashboardCard
          title="Total Orders"
          value="731"
          change="+1.4K this week"
          isPositive={true}
          icon={ShoppingCart}
        />
        <AdminDashboardCard
          title="Visitors"
          value="12,302"
          change="+12.7% this week"
          isPositive={true}
          icon={Users}
        />
        <AdminDashboardCard
          title="Refunds"
          value="2 Disputed"
          change="-12.7% this week"
          isPositive={false}
          icon={RefreshCw}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border-neutral-200/80">
          <h2 className="text-lg font-semibold text-neutral-700">
            Sales Performance
          </h2>
          <p className="text-sm text-neutral-500">
            A placeholder for sales chart.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border-neutral-200/80">
          <h2 className="text-lg font-semibold text-neutral-700">
            Top Categories
          </h2>
          <p className="text-sm text-neutral-500">
            A placeholder for category chart.
          </p>
        </div>
      </div>
    </div>
  );
};
