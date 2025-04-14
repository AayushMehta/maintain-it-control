
import React from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useData, JobStatus, ServiceCategory } from "@/contexts/DataContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  Briefcase,
  CheckCircle,
  Clock,
  CreditCard,
  PlusCircle,
  Truck,
  FileText,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import { StatusCard } from "@/components/Dashboard/StatusCard";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const DashboardPage = () => {
  const { user } = useAuth();
  const { jobs, payments, vendors } = useData();
  const navigate = useNavigate();
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  // Dashboard metrics calculation
  const getMetrics = () => {
    // Total jobs
    const totalJobs = jobs.length;
    
    // Active jobs
    const activeJobs = jobs.filter(
      (job) => job.status === "assigned" || job.status === "in_progress"
    ).length;
    
    // Completed jobs
    const completedJobs = jobs.filter((job) => job.status === "completed").length;
    
    // Pending payments
    const pendingPayments = payments.filter(
      (payment) => payment.status === "pending"
    ).length;
    
    // Total vendors
    const totalVendors = vendors.length;
    
    return {
      totalJobs,
      activeJobs,
      completedJobs,
      pendingPayments,
      totalVendors,
    };
  };

  const metrics = getMetrics();

  // Calendar dates with jobs
  const getJobsForDate = (date: Date) => {
    return jobs.filter((job) => {
      const jobDate = new Date(job.deadline);
      return (
        jobDate.getDate() === date.getDate() &&
        jobDate.getMonth() === date.getMonth() &&
        jobDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const selectedDateJobs = date ? getJobsForDate(date) : [];

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          {user?.role === "client" && (
            <Button onClick={() => navigate("/jobs/create")}>
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Job
            </Button>
          )}
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatusCard
            title="Total Jobs"
            value={metrics.totalJobs}
            description="All time jobs"
            icon={<Briefcase className="h-4 w-4" />}
            color="bg-dashboard-blue"
          />
          <StatusCard
            title="Active Jobs"
            value={metrics.activeJobs}
            description="Currently in progress"
            icon={<Clock className="h-4 w-4" />}
            color="bg-dashboard-yellow"
          />
          <StatusCard
            title="Completed Jobs"
            value={metrics.completedJobs}
            description="Successfully finished"
            icon={<CheckCircle className="h-4 w-4" />}
            color="bg-dashboard-green"
          />
          <StatusCard
            title="Pending Payments"
            value={metrics.pendingPayments}
            description="Awaiting processing"
            icon={<CreditCard className="h-4 w-4" />}
            color="bg-dashboard-red"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="grid gap-4 lg:col-span-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Frequently used functions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {user?.role === "client" && (
                    <Button
                      variant="outline"
                      className="flex h-full justify-start gap-2"
                      onClick={() => navigate("/jobs/create")}
                    >
                      <Briefcase className="h-4 w-4" />
                      <div className="flex flex-col items-start text-left">
                        <span>Create Job</span>
                        <span className="text-xs text-muted-foreground">
                          Submit new work request
                        </span>
                      </div>
                    </Button>
                  )}
                  
                  {user?.role === "admin" && (
                    <Button
                      variant="outline"
                      className="flex h-full justify-start gap-2"
                      onClick={() => navigate("/users")}
                    >
                      <Truck className="h-4 w-4" />
                      <div className="flex flex-col items-start text-left">
                        <span>Manage Users</span>
                        <span className="text-xs text-muted-foreground">
                          View and edit users
                        </span>
                      </div>
                    </Button>
                  )}
                  
                  {(user?.role === "admin" || user?.role === "client") && (
                    <Button
                      variant="outline"
                      className="flex h-full justify-start gap-2"
                      onClick={() => navigate("/invoices")}
                    >
                      <FileText className="h-4 w-4" />
                      <div className="flex flex-col items-start text-left">
                        <span>View Invoices</span>
                        <span className="text-xs text-muted-foreground">
                          Check billing documents
                        </span>
                      </div>
                    </Button>
                  )}
                  
                  {user?.role === "admin" && (
                    <Button
                      variant="outline"
                      className="flex h-full justify-start gap-2"
                      onClick={() => navigate("/vendors")}
                    >
                      <Truck className="h-4 w-4" />
                      <div className="flex flex-col items-start text-left">
                        <span>Add Vendor</span>
                        <span className="text-xs text-muted-foreground">
                          Create new supplier
                        </span>
                      </div>
                    </Button>
                  )}
                  
                  {(user?.role === "admin" || user?.role === "service_provider") && (
                    <Button
                      variant="outline"
                      className="flex h-full justify-start gap-2"
                      onClick={() => navigate("/jobs")}
                    >
                      <Briefcase className="h-4 w-4" />
                      <div className="flex flex-col items-start text-left">
                        <span>Manage Jobs</span>
                        <span className="text-xs text-muted-foreground">
                          View and update jobs
                        </span>
                      </div>
                    </Button>
                  )}
                  
                  {user?.role === "admin" && (
                    <Button
                      variant="outline"
                      className="flex h-full justify-start gap-2"
                      onClick={() => navigate("/invoices")}
                    >
                      <BarChart3 className="h-4 w-4" />
                      <div className="flex flex-col items-start text-left">
                        <span>Reports</span>
                        <span className="text-xs text-muted-foreground">
                          View business metrics
                        </span>
                      </div>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Jobs</CardTitle>
                    <CardDescription>Latest maintenance requests</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-xs"
                    onClick={() => navigate("/jobs")}
                  >
                    View All <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {jobs.slice(0, 5).map((job) => (
                    <div
                      key={job.id}
                      className="flex items-center rounded-md border p-3 text-sm"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{job.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {job.location.split(",")[0]} • {job.serviceType.replace("_", " ")}
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={cn(
                            "inline-block rounded-full px-2 py-1 text-xs font-medium",
                            job.status === "pending" && "bg-yellow-100 text-yellow-800",
                            job.status === "assigned" && "bg-blue-100 text-blue-800",
                            job.status === "in_progress" && "bg-purple-100 text-purple-800",
                            job.status === "completed" && "bg-green-100 text-green-800",
                            job.status === "cancelled" && "bg-red-100 text-red-800"
                          )}
                        >
                          {job.status.replace("_", " ")}
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          Due: {format(new Date(job.deadline), "MMM d, yyyy")}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {jobs.length === 0 && (
                    <div className="text-center py-6 text-muted-foreground">
                      No jobs found. Create a new job to get started.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <CalendarIcon className="mr-2 h-4 w-4" /> Calendar
                </CardTitle>
                <CardDescription>Upcoming job deadlines</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="mx-auto"
                  classNames={{
                    day_today: "bg-primary/10 text-primary font-bold",
                    day_selected: "bg-primary text-primary-foreground",
                    day: ({ date: calendarDate }) => {
                      const jobs = getJobsForDate(calendarDate);
                      if (jobs.length > 0) {
                        return "relative before:absolute before:bottom-0 before:left-1/2 before:h-1 before:w-1 before:-translate-x-1/2 before:rounded-full before:bg-primary";
                      }
                      return "";
                    },
                  }}
                />
                
                <div className="mt-6">
                  <h3 className="mb-2 font-medium">
                    {date ? format(date, "MMMM d, yyyy") : "No date selected"}
                  </h3>
                  <div className="space-y-2">
                    {selectedDateJobs.length > 0 ? (
                      selectedDateJobs.map((job) => (
                        <div
                          key={job.id}
                          className="rounded-md border p-2 text-xs"
                        >
                          <div className="font-medium">{job.title}</div>
                          <div className="text-muted-foreground">{job.serviceType}</div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        No jobs scheduled for this date
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Top Vendors</CardTitle>
                <CardDescription>Most active suppliers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {vendors.slice(0, 4).map((vendor) => (
                    <div key={vendor.id} className="flex items-center gap-2 rounded-md border p-2">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-full"
                        style={{ backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}80` }}
                      >
                        <span className="text-xs font-bold text-white">
                          {vendor.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{vendor.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {vendor.materials.slice(0, 2).join(", ")}
                          {vendor.materials.length > 2 ? "..." : ""}
                        </div>
                      </div>
                      <div
                        className={cn(
                          "rounded-full px-2 py-1 text-xs font-medium",
                          vendor.paymentStatus === "paid" && "bg-green-100 text-green-800",
                          vendor.paymentStatus === "pending" && "bg-yellow-100 text-yellow-800"
                        )}
                      >
                        {vendor.paymentStatus}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
