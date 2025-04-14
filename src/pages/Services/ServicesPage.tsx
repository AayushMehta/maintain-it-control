
import React, { useState } from "react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useData, Service, ServiceCategory } from "@/contexts/DataContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Wrench, Zap, Flame, Droplet, Fan, Home, AlertTriangle } from "lucide-react";
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
import { cn } from "@/lib/utils";

const categoryIcons: Record<ServiceCategory, React.ReactElement> = {
  electrical: <Zap className="h-4 w-4" />,
  plumbing: <Droplet className="h-4 w-4" />,
  hvac: <Fan className="h-4 w-4" />,
  roofing: <Home className="h-4 w-4" />,
  solar: <Zap className="h-4 w-4" />,
  maintenance: <Wrench className="h-4 w-4" />,
  emergency: <AlertTriangle className="h-4 w-4" />,
};

const categoryColors: Record<ServiceCategory, string> = {
  electrical: "bg-yellow-100 text-yellow-800",
  plumbing: "bg-blue-100 text-blue-800",
  hvac: "bg-purple-100 text-purple-800",
  roofing: "bg-slate-100 text-slate-800",
  solar: "bg-orange-100 text-orange-800",
  maintenance: "bg-green-100 text-green-800",
  emergency: "bg-red-100 text-red-800",
};

const ServicesPage = () => {
  const { user } = useAuth();
  const { services, toggleServiceActive } = useData();
  const [searchQuery, setSearchQuery] = useState("");

  const isAdmin = user?.role === "admin";

  // Filter services based on search
  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group services by category
  const groupedServices = filteredServices.reduce((acc, service) => {
    const category = service.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(service);
    return acc;
  }, {} as Record<ServiceCategory, Service[]>);

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Services</h2>
            <p className="text-muted-foreground">
              Manage maintenance and installation services
            </p>
          </div>
          
          {isAdmin && (
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add Service
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Service</DialogTitle>
                  <DialogDescription>
                    Create a new service offering for your clients
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Service Name</Label>
                    <Input id="name" placeholder="e.g., Emergency Plumbing" />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="electrical">Electrical</option>
                      <option value="plumbing">Plumbing</option>
                      <option value="hvac">HVAC</option>
                      <option value="roofing">Roofing</option>
                      <option value="solar">Solar Installation</option>
                      <option value="maintenance">Preventive Maintenance</option>
                      <option value="emergency">Emergency Services</option>
                    </select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Input id="description" placeholder="Describe the service" />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="rate">Base Rate ($/hour)</Label>
                    <Input id="rate" type="number" placeholder="75" />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Service</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
        
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search services..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="grid gap-6">
          {Object.keys(groupedServices).length > 0 ? (
            Object.entries(groupedServices).map(([category, categoryServices]) => (
              <Card key={category}>
                <CardHeader className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn("rounded-full p-1.5", categoryColors[category as ServiceCategory])}>
                        {categoryIcons[category as ServiceCategory]}
                      </div>
                      <CardTitle className="capitalize">
                        {category.replace("_", " ")} Services
                      </CardTitle>
                    </div>
                    <Badge variant="outline" className="px-2 py-1">
                      {categoryServices.length} {categoryServices.length === 1 ? "service" : "services"}
                    </Badge>
                  </div>
                  <CardDescription>
                    {category === "electrical" && "Electrical installation and repair services"}
                    {category === "plumbing" && "Water systems installation and repair"}
                    {category === "hvac" && "Heating, ventilation, and air conditioning"}
                    {category === "roofing" && "Roof installation and repair services"}
                    {category === "solar" && "Solar panel installation and maintenance"}
                    {category === "maintenance" && "Regular maintenance services"}
                    {category === "emergency" && "Urgent repair services"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {categoryServices.map((service) => (
                      <div
                        key={service.id}
                        className={cn(
                          "flex flex-col justify-between rounded-md border p-4",
                          !service.isActive && "opacity-60"
                        )}
                      >
                        <div>
                          <div className="mb-2 flex items-center justify-between">
                            <h3 className="font-medium">
                              {service.name}
                            </h3>
                            {isAdmin && (
                              <Switch
                                checked={service.isActive}
                                onCheckedChange={() => toggleServiceActive(service.id)}
                              />
                            )}
                          </div>
                          <p className="mb-2 text-sm text-muted-foreground">
                            {service.description}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="text-sm font-medium">
                            ${service.baseRate}/hr
                          </div>
                          <Badge
                            variant="outline"
                            className={cn(service.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800")}
                          >
                            {service.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="rounded-md border border-dashed p-8 text-center">
              <Wrench className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
              <h3 className="mb-1 text-lg font-medium">No Services Found</h3>
              <p className="mb-4 text-muted-foreground">
                {searchQuery 
                  ? "No services match your search criteria" 
                  : "No services have been added yet"}
              </p>
              {isAdmin && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" /> Add Service
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    {/* Same content as above */}
                  </DialogContent>
                </Dialog>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ServicesPage;
