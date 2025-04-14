
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useData, ServiceCategory } from "@/contexts/DataContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Check, Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
  location: z.string().min(5, "Please enter a valid location"),
  serviceType: z.string().refine(
    (val) =>
      [
        "electrical",
        "plumbing",
        "hvac",
        "roofing",
        "solar",
        "maintenance",
        "emergency",
      ].includes(val),
    "Please select a valid service type"
  ),
  budget: z
    .number()
    .min(1, "Budget must be greater than 0")
    .max(1000000, "Budget is too high"),
  deadline: z.date().refine(
    (date) => date > new Date(),
    "Deadline must be in the future"
  ),
});

type FormValues = z.infer<typeof formSchema>;

const CreateJobPage = () => {
  const { user } = useAuth();
  const { addJob, services } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Make sure user is client or admin
  if (user?.role !== "client" && user?.role !== "admin") {
    navigate("/");
    return null;
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      serviceType: "",
      budget: 0,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to 7 days from now
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // Add the job to the context
      addJob({
        title: data.title,
        description: data.description,
        location: data.location,
        serviceType: data.serviceType as ServiceCategory,
        budget: data.budget,
        deadline: data.deadline.toISOString(),
        clientId: user?.id || "", // Current user is the client
      });

      // Show success toast
      toast({
        title: "Job Created",
        description: "Your job has been successfully created",
        variant: "default",
      });

      // Redirect to jobs page
      navigate("/jobs");
    } catch (error) {
      console.error("Error creating job:", error);
      
      toast({
        title: "Error",
        description: "Failed to create job. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter active services
  const activeServices = services.filter((service) => service.isActive);

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Create New Job</h2>
          <p className="text-muted-foreground">
            Submit a new maintenance or installation request
          </p>
        </div>

        <Card className="mx-auto max-w-3xl">
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
            <CardDescription>
              Provide the details for your maintenance or installation job
            </CardDescription>
          </CardHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Kitchen Electrical Wiring Fix"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        A clear, concise title for your job
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the job in detail, including specific requirements..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide detailed information about the job requirements
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., 123 Main St, Anytown, USA"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Full address where the job will be performed
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="serviceType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Type</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select service type" />
                            </SelectTrigger>
                            <SelectContent>
                              {activeServices.map((service) => (
                                <SelectItem
                                  key={service.id}
                                  value={service.category}
                                >
                                  {service.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription>
                          Select the type of service you need
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Budget ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g., 500"
                            {...field}
                            onChange={(e) => {
                              field.onChange(parseFloat(e.target.value) || 0);
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Your estimated budget for this job
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="deadline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deadline</FormLabel>
                        <FormControl>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? (
                                  format(field.value, "MMMM d, yyyy")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date()
                                }
                                initialFocus
                                className="p-3 pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormDescription>
                          When do you need this job completed by?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/jobs")}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" /> Create Job
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CreateJobPage;
