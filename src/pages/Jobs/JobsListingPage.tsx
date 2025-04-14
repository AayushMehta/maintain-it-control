
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useData, JobStatus, ServiceCategory } from "@/contexts/DataContext";
import { format } from "date-fns";
import { Search, Filter, PlusCircle, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Job status badge component
const JobStatusBadge = ({ status }: { status: JobStatus }) => {
  const getStatusColor = (status: JobStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80";
      case "assigned":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100/80";
      case "in_progress":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100/80";
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-100/80";
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-100/80";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100/80";
    }
  };

  return (
    <Badge
      variant="outline"
      className={cn("font-normal", getStatusColor(status))}
    >
      {status.replace("_", " ")}
    </Badge>
  );
};

const JobsListingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { jobs, getJobsForUser } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<JobStatus | "all">("all");
  const [serviceFilter, setServiceFilter] = useState<ServiceCategory | "all">("all");
  const [sortBy, setSortBy] = useState<"deadline" | "budget">("deadline");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  if (!user) return null;

  const userJobs = getJobsForUser();

  // Filter and sort jobs
  const filteredJobs = userJobs.filter((job) => {
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    const matchesService =
      serviceFilter === "all" || job.serviceType === serviceFilter;
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesService && matchesSearch;
  });

  // Sort jobs
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === "deadline") {
      const dateA = new Date(a.deadline).getTime();
      const dateB = new Date(b.deadline).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    } else {
      return sortOrder === "asc" ? a.budget - b.budget : b.budget - a.budget;
    }
  });

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleRowClick = (jobId: string) => {
    navigate(`/jobs/${jobId}`);
  };

  const jobStatusOptions: { value: JobStatus | "all"; label: string }[] = [
    { value: "all", label: "All Statuses" },
    { value: "pending", label: "Pending" },
    { value: "assigned", label: "Assigned" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const serviceTypeOptions: { value: ServiceCategory | "all"; label: string }[] = [
    { value: "all", label: "All Services" },
    { value: "electrical", label: "Electrical" },
    { value: "plumbing", label: "Plumbing" },
    { value: "hvac", label: "HVAC" },
    { value: "roofing", label: "Roofing" },
    { value: "solar", label: "Solar Installation" },
    { value: "maintenance", label: "Preventive Maintenance" },
    { value: "emergency", label: "Emergency Services" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Jobs</h2>
            <p className="text-muted-foreground">
              Manage and track all your maintenance and installation jobs
            </p>
          </div>
          
          {(user.role === "admin" || user.role === "client") && (
            <Button onClick={() => navigate("/jobs/create")}>
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Job
            </Button>
          )}
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Jobs List</CardTitle>
            <CardDescription>
              View and manage all job requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search jobs..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Select
                  value={statusFilter}
                  onValueChange={(value) => setStatusFilter(value as JobStatus | "all")}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobStatusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select
                  value={serviceFilter}
                  onValueChange={(value) => setServiceFilter(value as ServiceCategory | "all")}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by service" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setSortBy("deadline");
                        toggleSortOrder();
                      }}
                    >
                      Sort by Deadline {sortBy === "deadline" && (sortOrder === "asc" ? "↑" : "↓")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSortBy("budget");
                        toggleSortOrder();
                      }}
                    >
                      Sort by Budget {sortBy === "budget" && (sortOrder === "asc" ? "↑" : "↓")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Service Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedJobs.length > 0 ? (
                    sortedJobs.map((job) => (
                      <TableRow
                        key={job.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleRowClick(job.id)}
                      >
                        <TableCell className="font-medium">{job.title}</TableCell>
                        <TableCell>
                          <span className="capitalize">{job.serviceType.replace("_", " ")}</span>
                        </TableCell>
                        <TableCell>
                          {job.location.split(",")[0].trim()}
                        </TableCell>
                        <TableCell>${job.budget.toLocaleString()}</TableCell>
                        <TableCell>
                          {format(new Date(job.deadline), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          <JobStatusBadge status={job.status} />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No jobs found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default JobsListingPage;
