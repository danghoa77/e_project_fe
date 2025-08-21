import React, { useEffect, useState } from "react";
import adminApi from "../api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PackageSearch } from "lucide-react";
import { Payment } from "@/types/payment";

const PaymentRowSkeleton = () => (
  <TableRow className="border-b border-neutral-200/50">
    <TableCell className="font-mono text-sm truncate">
      <Skeleton className="h-4 w-3/4" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-full" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-full" />
    </TableCell>
    <TableCell className="text-right font-medium">
      <Skeleton className="h-4 w-1/2 ml-auto" />
    </TableCell>
    <TableCell className="text-center">
      <Skeleton className="h-6 w-20 mx-auto" />
    </TableCell>
  </TableRow>
);

export const AdminPaymentsPage = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const getStatusBadge = (status: Payment["status"]) => {
    switch (status) {
      case "SUCCESS":
        return <Badge className="bg-green-500 text-white">{status}</Badge>;
      case "PENDING":
        return <Badge className="bg-yellow-500 text-white">{status}</Badge>;
      case "FAILED":
        return <Badge className="bg-red-500 text-white">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatUSD = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await adminApi.getAllPayments();
        setPayments(res);
      } catch (err) {
        console.error("Failed to fetch payments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-[#fcf7f1] min-h-screen p-4 sm:p-6 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-bold text-3xl md:text-4xl text-neutral-800 mb-8">
          Payments Management
        </h1>

        <div className="bg-white rounded-lg shadow-sm border border-neutral-200/80 overflow-x-auto">
          <Table className="table-fixed w-full">
            <TableHeader>
              <TableRow className="border-b border-neutral-200/80">
                <TableHead style={{ width: "33%" }}>Order ID</TableHead>
                <TableHead style={{ width: "32%" }}>User ID</TableHead>
                <TableHead style={{ width: "13%" }}>Provider</TableHead>
                <TableHead style={{ width: "12%" }} className="text-right">
                  Amount (USD)
                </TableHead>
                <TableHead style={{ width: "20%" }} className="text-center">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <PaymentRowSkeleton key={i} />
                ))
              ) : payments.length > 0 ? (
                payments.map((p) => (
                  <TableRow
                    key={p._id}
                    className="border-b border-neutral-200/50"
                  >
                    <TableCell className="font-mono text-sm truncate">
                      {p.orderId}
                    </TableCell>
                    <TableCell className="text-sm truncate">
                      {p.userId}
                    </TableCell>
                    <TableCell className="text-sm truncate">
                      {p.provider}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatUSD(p.amount / 25000)}
                    </TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(p.status)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-48 text-center">
                    <PackageSearch className="h-12 w-12 mx-auto text-neutral-400 mb-4" />
                    <p className="text-lg">No Payments Found</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
