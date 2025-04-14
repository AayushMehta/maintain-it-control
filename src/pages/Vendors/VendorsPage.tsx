
import React, { useState } from "react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useData, Vendor, PaymentStatus } from "@/contexts/DataContext";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Trash2, Edit, Mail, Phone, MapPin, Package, Tag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const VendorsPage = () => {
  const { user } = useAuth();
  const { vendors, addVendor } = useData();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Add vendor form state
  const [vendorName, setVendorName] = useState("");
  const [vendorEmail, setVendorEmail] = useState("");
  const [vendorPhone, setVendorPhone] = useState("");
  const [vendorAddress, setVendorAddress] = useState("");
  const [vendorMaterials, setVendorMaterials] = useState("");
  
  // Edit/delete state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteConfirmName, setDeleteConfirmName] = useState("");
  
  // Access check
  const isAdmin = user?.role === "admin";
  
  if (!isAdmin && user?.role !== "vendor") {
    // Redirect logic would go here if using a real router
    return (
      <DashboardLayout>
        <div className="flex h-full flex-col items-center justify-center">
          <h2 className="text-2xl font-bold">Access Denied</h2>
          <p className="text-muted-foreground">
            You don't have permission to view this page.
          </p>
        </div>
      </DashboardLayout>
    );
  }
  
  // Filter vendors based on search
  const filteredVendors = vendors.filter((vendor) =>
    vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.materials.some((material) =>
      material.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
  
  // Handle add vendor
  const handleAddVendor = () => {
    try {
      // Validate inputs
      if (!vendorName.trim()) throw new Error("Vendor name is required");
      if (!vendorEmail.trim()) throw new Error("Email is required");
      if (!vendorPhone.trim()) throw new Error("Phone number is required");
      if (!vendorAddress.trim()) throw new Error("Address is required");
      if (!vendorMaterials.trim()) throw new Error("Materials are required");
      
      // Parse materials from comma-separated string
      const materials = vendorMaterials
        .split(",")
        .map((material) => material.trim())
        .filter((material) => material.length > 0);
      
      // Add vendor
      addVendor({
        name: vendorName,
        email: vendorEmail,
        phone: vendorPhone,
        address: vendorAddress,
        materials,
        paymentStatus: "pending",
      });
      
      // Reset form
      setVendorName("");
      setVendorEmail("");
      setVendorPhone("");
      setVendorAddress("");
      setVendorMaterials("");
      
      // Close dialog
      setIsDialogOpen(false);
      
      // Show success toast
      toast({
        title: "Vendor Added",
        description: `${vendorName} has been added successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add vendor",
        variant: "destructive",
      });
    }
  };
  
  // Get payment status badge
  const getPaymentStatusBadge = (status: PaymentStatus) => {
    const statusStyles = {
      pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80",
      paid: "bg-green-100 text-green-800 hover:bg-green-100/80",
      failed: "bg-red-100 text-red-800 hover:bg-red-100/80",
      refunded: "bg-purple-100 text-purple-800 hover:bg-purple-100/80",
    };
    
    return (
      <Badge
        variant="outline"
        className={cn(statusStyles[status])}
      >
        {status}
      </Badge>
    );
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Vendors</h2>
            <p className="text-muted-foreground">
              Manage your material suppliers and vendors
            </p>
          </div>
          
          {isAdmin && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add Vendor
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Add New Vendor</DialogTitle>
                  <DialogDescription>
                    Add a new material supplier to your vendor list
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Vendor Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., ABC Supply Co."
                      value={vendorName}
                      onChange={(e) => setVendorName(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="contact@example.com"
                        value={vendorEmail}
                        onChange={(e) => setVendorEmail(e.target.value)}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        placeholder="(555) 123-4567"
                        value={vendorPhone}
                        onChange={(e) => setVendorPhone(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      placeholder="123 Business St, City, State, ZIP"
                      value={vendorAddress}
                      onChange={(e) => setVendorAddress(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="materials">Materials Supplied</Label>
                    <Textarea
                      id="materials"
                      placeholder="Enter materials separated by commas (e.g., Pipes, Fixtures, Water Heaters)"
                      value={vendorMaterials}
                      onChange={(e) => setVendorMaterials(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Separate multiple materials with commas
                    </p>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddVendor}>
                    Add Vendor
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
        
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vendors by name, email, or materials..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Vendor List</CardTitle>
            <CardDescription>
              {filteredVendors.length} {filteredVendors.length === 1 ? "vendor" : "vendors"} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredVendors.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Contact Info</TableHead>
                      <TableHead>Materials</TableHead>
                      <TableHead>Payment Status</TableHead>
                      {isAdmin && <TableHead className="w-[100px]">Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVendors.map((vendor) => (
                      <TableRow key={vendor.id}>
                        <TableCell>
                          <div className="font-medium">{vendor.name}</div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="mr-1 h-3 w-3" />
                            {vendor.address.split(",")[0]}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <Mail className="mr-1 h-3 w-3" />
                            <span className="underline">{vendor.email}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Phone className="mr-1 h-3 w-3" />
                            {vendor.phone}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {vendor.materials.map((material, index) => (
                              <div
                                key={index}
                                className="inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs"
                              >
                                <Package className="mr-1 h-3 w-3" />
                                {material}
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getPaymentStatusBadge(vendor.paymentStatus)}
                        </TableCell>
                        {isAdmin && (
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="text-red-500">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="rounded-md border border-dashed p-8 text-center">
                <Package className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
                <h3 className="mb-1 text-lg font-medium">No Vendors Found</h3>
                <p className="mb-4 text-muted-foreground">
                  {searchQuery 
                    ? "No vendors match your search criteria" 
                    : "No vendors have been added yet"}
                </p>
                {isAdmin && (
                  <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Your First Vendor
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        {isAdmin && filteredVendors.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Vendor Materials Overview</CardTitle>
              <CardDescription>
                Summary of materials supplied by vendors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {Array.from(
                  new Set(
                    vendors.flatMap((vendor) => vendor.materials)
                  )
                ).map((material, index) => (
                  <div
                    key={index}
                    className="flex items-center rounded-full bg-muted px-3 py-1 text-sm"
                  >
                    <Tag className="mr-1 h-4 w-4" />
                    <span>{material}</span>
                    <Badge
                      variant="outline"
                      className="ml-2 bg-background"
                    >
                      {vendors.filter((v) => v.materials.includes(material)).length}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default VendorsPage;
