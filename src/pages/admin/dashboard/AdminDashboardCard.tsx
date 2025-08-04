import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight } from 'lucide-react';

interface AdminDashboardCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ElementType;
}

export const AdminDashboardCard = ({ title, value, change, isPositive, icon: Icon }: AdminDashboardCardProps) => (
  <Card className="bg-white rounded-lg shadow-sm border-neutral-200/80">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-neutral-500">{title}</CardTitle>
      <Icon className="h-5 w-5 text-neutral-400" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-neutral-800">{value}</div>
      <p className={`text-xs mt-1 flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        <ArrowUpRight className={`h-4 w-4 mr-1 ${!isPositive && 'transform rotate-90'}`} />
        {change}
      </p>
    </CardContent>
  </Card>
);