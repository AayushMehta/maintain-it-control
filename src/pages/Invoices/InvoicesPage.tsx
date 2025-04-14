
import React from "react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { FileText, Search, Download, Printer } from "lucide-react";
import { Input } from "@/components/ui/input";

const InvoicesPage = () => {
  const { user } = useAuth();

  // Mock invoices data
  const invoices = [
    { id: "INV-001", job: "Electrical Wiring Fix", client: "Sarah Client", amount: 500, date: "2025-04-01", status: "paid" },
    { id: "INV-002", job: "HVAC Installation", client: "Sarah Client", amount: 2300, date: "2025-04-05", status: "pending" },
    { id: "INV-003", job: "Roof Repair", client: "Sarah Client", amount: 1100, date: "2025-04-10", status: "paid" },
    { id: "INV-004", job: "Solar Panel Installation", client: "Sarah Client", amount: 7500, date: "2025-04-15", status: "pending" },
    { id: "INV-005", job: "Plumbing Fix", client: "Sarah Client", amount: 350, date: "2025-04-20", status: "paid" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Invoices</h2>
          {(user?.role === "admin" || user?.role === "client") && (
            <Button>
              <FileText className="mr-2 h-4 w-4" /> Generate Invoice
            </Button>
          )}
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Invoice Management</CardTitle>
            <CardDescription>View and manage all invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex w-full items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search invoices..."
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
                <div className="col-span-2">Invoice #</div>
                <div className="col-span-3">Job</div>
                <div className="col-span-2">Client</div>
                <div className="col-span-1">Amount</div>
                <div className="col-span-1">Date</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>
              
              {invoices.map((invoice) => (
                <div key={invoice.id} className="grid grid-cols-12 border-b p-3 text-sm">
                  <div className="col-span-2 font-medium">{invoice.id}</div>
                  <div className="col-span-3">{invoice.job}</div>
                  <div className="col-span-2 text-muted-foreground">{invoice.client}</div>
                  <div className="col-span-1">${invoice.amount.toFixed(2)}</div>
                  <div className="col-span-1 text-muted-foreground">{invoice.date}</div>
                  <div className="col-span-1">
                    <span className={`rounded-full px-2 py-1 text-xs ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </div>
                  <div className="col-span-2 text-right space-x-1">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Printer className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">View</Button>
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

export default InvoicesPage;
