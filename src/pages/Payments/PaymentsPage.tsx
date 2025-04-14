
import React from "react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { BadgeDollarSign, Search, Download } from "lucide-react";
import { Input } from "@/components/ui/input";

const PaymentsPage = () => {
  const { user } = useAuth();

  // Mock payments data
  const payments = [
    { id: "1", job: "Electrical Wiring Fix", amount: 500, date: "2025-04-01", status: "paid", method: "Credit Card" },
    { id: "2", job: "HVAC Installation", amount: 2300, date: "2025-04-05", status: "pending", method: "Bank Transfer" },
    { id: "3", job: "Roof Repair", amount: 1100, date: "2025-04-10", status: "paid", method: "PayPal" },
    { id: "4", job: "Solar Panel Installation", amount: 7500, date: "2025-04-15", status: "pending", method: "Check" },
    { id: "5", job: "Plumbing Fix", amount: 350, date: "2025-04-20", status: "failed", method: "Credit Card" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Payments</h2>
          {user?.role === "admin" && (
            <Button>
              <BadgeDollarSign className="mr-2 h-4 w-4" /> Record Payment
            </Button>
          )}
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Payment Management</CardTitle>
            <CardDescription>View and manage all payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex w-full items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search payments..."
                  className="w-full rounded-md pl-8"
                />
              </div>
              <Button variant="outline">Filter</Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" /> Export
              </Button>
            </div>

            <div className="rounded-md border">
              <div className="grid grid-cols-12 border-b bg-muted/50 p-2 text-sm font-medium">
                <div className="col-span-4">Job</div>
                <div className="col-span-2">Amount</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>
              
              {payments.map((payment) => (
                <div key={payment.id} className="grid grid-cols-12 border-b p-3 text-sm">
                  <div className="col-span-4 font-medium">{payment.job}</div>
                  <div className="col-span-2">${payment.amount.toFixed(2)}</div>
                  <div className="col-span-2 text-muted-foreground">{payment.date}</div>
                  <div className="col-span-2">
                    <span className={`rounded-full px-2 py-1 text-xs ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </div>
                  <div className="col-span-2 text-right">
                    <Button variant="ghost" size="sm">Details</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PaymentsPage;
