import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { useData, useAuth, JobStatus, Bid } from "@/contexts/DataContext";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  User, 
  Send, 
  Tool, 
  Building2, 
  AlertCircle,
  Edit,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

const JobDetailPage = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { jobs, bids, addBid, assignJob, updateJobStatus } = useData();
  
  const [bidAmount, setBidAmount] = useState("");
  const [bidDuration, setBidDuration] = useState("");
  const [bidNotes, setBidNotes] = useState("");
  const [bidLoading, setBidLoading] = useState(false);
  
  // Find current job
  const job = jobs.find((j) => j.id === jobId);
  
  if (!job) {
    return (
      <DashboardLayout>
        <div className="flex h-full flex-col items-center justify-center">
          <AlertCircle className="mb-4 h-12 w-12 text-yellow-500" />
          <h2 className="text-2xl font-bold">Job Not Found</h2>
          <p className="mb-4 text-muted-foreground">
            The job you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/jobs")}>Back to Jobs</Button>
        </div>
      </DashboardLayout>
    );
  }
  
  // Get bids for this job
  const jobBids = bids.filter((bid) => bid.jobId === job.id);
  
  // Check if current user has already bid on this job
  const userHasBid = user?.role === "service_provider" && 
    jobBids.some((bid) => bid.providerId === user.id);
  
  // Handle bid submission
  const handleSubmitBid = () => {
    if (!user) return;
    
    setBidLoading(true);
    
    try {
      const amount = parseFloat(bidAmount);
      const estimatedDuration = parseInt(bidDuration);
      
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Please enter a valid amount");
      }
      
      if (isNaN(estimatedDuration) || estimatedDuration <= 0) {
        throw new Error("Please enter valid duration");
      }
      
      addBid({
        jobId: job.id,
        providerId: user.id,
        amount,
        estimatedDuration,
        notes: bidNotes,
      });
      
      toast({
        title: "Bid Submitted",
        description: "Your bid has been successfully submitted",
      });
      
      // Reset form
      setBidAmount("");
      setBidDuration("");
      setBidNotes("");
      
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit bid",
        variant: "destructive",
      });
    } finally {
      setBidLoading(false);
    }
  };
  
  // Handle job assignment
  const handleAssignJob = (providerId: string) => {
    try {
      assignJob(job.id, providerId);
      
      toast({
        title: "Job Assigned",
        description: "The job has been assigned successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign job",
        variant: "destructive",
      });
    }
  };
  
  // Handle status change
  const handleStatusChange = (newStatus: JobStatus) => {
    try {
      updateJobStatus(job.id, newStatus);
      
      toast({
        title: "Status Updated",
        description: `Job status changed to ${newStatus.replace("_", " ")}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };
  
  // Determine available actions based on user role and job status
  const canBid = user?.role === "service_provider" && job.status === "pending" && !userHasBid;
  const canAssign = (user?.role === "admin" || user?.id === job.clientId) && job.status === "pending" && jobBids.length > 0;
  const canEdit = (user?.role === "admin" || user?.id === job.clientId) && 
    (job.status === "pending" || job.status === "assigned");
  const canUpdateStatus = (user?.role === "admin" || user?.id === job.providerId) && 
    (job.status === "assigned" || job.status === "in_progress");
  
  // Job status badge
  const getStatusBadge = (status: JobStatus) => {
    const statusStyles = {
      pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80",
      assigned: "bg-blue-100 text-blue-800 hover:bg-blue-100/80",
      in_progress: "bg-purple-100 text-purple-800 hover:bg-purple-100/80",
      completed: "bg-green-100 text-green-800 hover:bg-green-100/80",
      cancelled: "bg-red-100 text-red-800 hover:bg-red-100/80",
    };
    
    return (
      <Badge variant="outline" className={cn("px-2 py-1", statusStyles[status])}>
        {status.replace("_", " ")}
      </Badge>
    );
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold tracking-tight">{job.title}</h2>
              {getStatusBadge(job.status)}
            </div>
            <p className="text-muted-foreground">
              Job ID: {job.id} • Created on {format(new Date(job.createdAt), "MMMM d, yyyy")}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {canEdit && (
              <Button variant="outline" onClick={() => navigate(`/jobs/edit/${job.id}`)}>
                <Edit className="mr-2 h-4 w-4" /> Edit Job
              </Button>
            )}
            
            {canUpdateStatus && job.status === "assigned" && (
              <Button onClick={() => handleStatusChange("in_progress")}>
                <Clock className="mr-2 h-4 w-4" /> Start Job
              </Button>
            )}
            
            {canUpdateStatus && job.status === "in_progress" && (
              <Button onClick={() => handleStatusChange("completed")}>
                <CheckCircle2 className="mr-2 h-4 w-4" /> Mark as Completed
              </Button>
            )}
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose max-w-none">
                  <p>{job.description}</p>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                      <MapPin className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Location</div>
                      <div className="text-sm text-muted-foreground">{job.location}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                      <Tool className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Service Type</div>
                      <div className="text-sm capitalize text-muted-foreground">
                        {job.serviceType.replace("_", " ")}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                      <DollarSign className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Budget</div>
                      <div className="text-sm text-muted-foreground">
                        ${job.budget.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
                      <Calendar className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Deadline</div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(job.deadline), "MMMM d, yyyy")}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                      <Building2 className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Client</div>
                      <div className="text-sm text-muted-foreground">
                        {job.clientId === user?.id ? "You" : "Client #" + job.clientId}
                      </div>
                    </div>
                  </div>
                  
                  {job.providerId && (
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100">
                        <User className="h-4 w-4 text-teal-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">Service Provider</div>
                        <div className="text-sm text-muted-foreground">
                          {job.providerId === user?.id ? "You" : "Provider #" + job.providerId}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Bid section - Only show to client or if user has bid */}
            {(user?.role === "admin" || user?.id === job.clientId || userHasBid) && (
              <Card>
                <CardHeader>
                  <CardTitle>Bids</CardTitle>
                  <CardDescription>
                    {jobBids.length === 0
                      ? "No bids have been submitted yet"
                      : `${jobBids.length} bid(s) submitted for this job`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {jobBids.length === 0 ? (
                    <div className="rounded-md border border-dashed p-6 text-center">
                      <p className="text-muted-foreground">
                        No bids have been submitted yet for this job. Service providers can submit bids below.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {jobBids.map((bid) => (
                        <div
                          key={bid.id}
                          className={cn(
                            "rounded-md border p-4",
                            bid.providerId === user?.id && "border-primary/50 bg-primary/5"
                          )}
                        >
                          <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                              <div className="font-medium">
                                {bid.providerId === user?.id
                                  ? "Your Bid"
                                  : `Provider #${bid.providerId}`}
                              </div>
                              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                                <span className="flex items-center">
                                  <DollarSign className="mr-1 h-3 w-3" /> Bid: ${bid.amount.toLocaleString()}
                                </span>
                                <span className="flex items-center">
                                  <Clock className="mr-1 h-3 w-3" /> Duration: {bid.estimatedDuration} day(s)
                                </span>
                              </div>
                              {bid.notes && (
                                <div className="mt-2 rounded-md bg-muted p-2 text-sm">
                                  {bid.notes}
                                </div>
                              )}
                            </div>
                            {canAssign && (
                              <Button
                                size="sm"
                                onClick={() => handleAssignJob(bid.providerId)}
                              >
                                Assign Job
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
          
          <div className="space-y-6">
            {/* Bid form for service providers */}
            {canBid && (
              <Card>
                <CardHeader>
                  <CardTitle>Submit a Bid</CardTitle>
                  <CardDescription>
                    Offer your services for this job
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Bid Amount ($)</label>
                    <Input
                      type="number"
                      placeholder="Enter your bid amount"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Estimated Duration (days)</label>
                    <Input
                      type="number"
                      placeholder="Number of days to complete"
                      value={bidDuration}
                      onChange={(e) => setBidDuration(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Notes (Optional)</label>
                    <Textarea
                      placeholder="Any additional information about your bid..."
                      value={bidNotes}
                      onChange={(e) => setBidNotes(e.target.value)}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={handleSubmitBid}
                    disabled={bidLoading}
                  >
                    {bidLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" /> Submit Bid
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            )}
            
            {/* Job Status History Card */}
            <Card>
              <CardHeader>
                <CardTitle>Status History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative space-y-4 pl-6">
                  <div className="absolute left-0 top-0 bottom-0 w-px bg-muted"></div>
                  
                  {/* Created status */}
                  <div className="relative">
                    <div className="absolute -left-[13px] top-0 h-6 w-6 rounded-full border-4 border-background bg-primary"></div>
                    <div className="pl-4">
                      <p className="font-medium">Job Created</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(job.createdAt), "MMMM d, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                  </div>
                  
                  {/* Other statuses */}
                  {job.status !== "pending" && (
                    <div className="relative">
                      <div className="absolute -left-[13px] top-0 h-6 w-6 rounded-full border-4 border-background bg-blue-500"></div>
                      <div className="pl-4">
                        <p className="font-medium">Job Assigned</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(job.updatedAt), "MMMM d, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {job.status === "in_progress" || job.status === "completed" ? (
                    <div className="relative">
                      <div className="absolute -left-[13px] top-0 h-6 w-6 rounded-full border-4 border-background bg-purple-500"></div>
                      <div className="pl-4">
                        <p className="font-medium">In Progress</p>
                        <p className="text-sm text-muted-foreground">
                          Work started by service provider
                        </p>
                      </div>
                    </div>
                  ) : null}
                  
                  {job.status === "completed" ? (
                    <div className="relative">
                      <div className="absolute -left-[13px] top-0 h-6 w-6 rounded-full border-4 border-background bg-green-500"></div>
                      <div className="pl-4">
                        <p className="font-medium">Job Completed</p>
                        <p className="text-sm text-muted-foreground">
                          Successfully completed by service provider
                        </p>
                      </div>
                    </div>
                  ) : null}
                  
                  {job.status === "cancelled" ? (
                    <div className="relative">
                      <div className="absolute -left-[13px] top-0 h-6 w-6 rounded-full border-4 border-background bg-red-500"></div>
                      <div className="pl-4">
                        <p className="font-medium">Job Cancelled</p>
                        <p className="text-sm text-muted-foreground">
                          Job was cancelled
                        </p>
                      </div>
                    </div>
                  ) : null}
                  
                  {/* Future status */}
                  {job.status !== "completed" && job.status !== "cancelled" && (
                    <div className="relative">
                      <div className="absolute -left-[13px] top-0 h-6 w-6 rounded-full border-4 border-background bg-muted"></div>
                      <div className="pl-4">
                        <p className="font-medium text-muted-foreground">
                          {job.status === "in_progress" ? "Pending Completion" : "Pending Progress"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default JobDetailPage;
