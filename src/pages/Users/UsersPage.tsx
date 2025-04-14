
import React from "react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { UserPlus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const UsersPage = () => {
  const { user } = useAuth();

  // Mock users data
  const users = [
    { id: "1", name: "Admin User", email: "admin@example.com", role: "admin", status: "active" },
    { id: "2", name: "Sarah Client", email: "client@example.com", role: "client", status: "active" },
    { id: "3", name: "Mike Provider", email: "provider@example.com", role: "service_provider", status: "active" },
    { id: "4", name: "Vendor User", email: "vendor@example.com", role: "vendor", status: "inactive" },
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-dashboard-blue text-white";
      case "client":
        return "bg-dashboard-teal text-white";
      case "service_provider":
        return "bg-dashboard-indigo text-white";
      case "vendor":
        return "bg-dashboard-orange text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Users</h2>
          {user?.role === "admin" && (
            <Button>
              <UserPlus className="mr-2 h-4 w-4" /> Add User
            </Button>
          )}
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>User Management</CardTitle>
            <CardDescription>View and manage all system users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex w-full items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search users..."
                  className="w-full rounded-md pl-8"
                />
              </div>
              <Button variant="outline">Filter</Button>
            </div>

            <div className="rounded-md border">
              <div className="grid grid-cols-12 border-b bg-muted/50 p-2 text-sm font-medium">
                <div className="col-span-3">Name</div>
                <div className="col-span-3">Email</div>
                <div className="col-span-2">Role</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>
              
              {users.map((userItem) => (
                <div key={userItem.id} className="grid grid-cols-12 border-b p-3 text-sm">
                  <div className="col-span-3 font-medium">{userItem.name}</div>
                  <div className="col-span-3 text-muted-foreground">{userItem.email}</div>
                  <div className="col-span-2">
                    <span className={`rounded-full px-2 py-1 text-xs ${getRoleColor(userItem.role)}`}>
                      {userItem.role.replace("_", " ")}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className={`rounded-full px-2 py-1 text-xs ${userItem.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {userItem.status}
                    </span>
                  </div>
                  <div className="col-span-2 text-right">
                    <Button variant="ghost" size="sm">Edit</Button>
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

export default UsersPage;
