
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

// Types
export type JobStatus = 
  | "pending" 
  | "assigned" 
  | "in_progress" 
  | "completed" 
  | "cancelled";

export type PaymentStatus = 
  | "pending" 
  | "paid" 
  | "failed" 
  | "refunded";

export type ServiceCategory = 
  | "electrical" 
  | "plumbing" 
  | "hvac" 
  | "roofing" 
  | "solar" 
  | "maintenance" 
  | "emergency";

export interface Job {
  id: string;
  title: string;
  description: string;
  clientId: string;
  providerId?: string;
  location: string;
  serviceType: ServiceCategory;
  budget: number;
  deadline: string; // ISO date string
  status: JobStatus;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface Bid {
  id: string;
  jobId: string;
  providerId: string;
  amount: number;
  estimatedDuration: number; // in days
  notes: string;
  createdAt: string; // ISO date string
}

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  isActive: boolean;
  baseRate: number; // hourly or per job
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  materials: string[];
  paymentStatus: PaymentStatus;
}

export interface Payment {
  id: string;
  jobId?: string;
  vendorId?: string;
  amount: number;
  status: PaymentStatus;
  paymentDate?: string; // ISO date string
  paymentMethod: string;
}

interface DataContextType {
  jobs: Job[];
  bids: Bid[];
  services: Service[];
  vendors: Vendor[];
  payments: Payment[];
  
  // Jobs
  addJob: (job: Omit<Job, "id" | "createdAt" | "updatedAt" | "status">) => void;
  updateJobStatus: (jobId: string, status: JobStatus) => void;
  assignJob: (jobId: string, providerId: string) => void;
  
  // Bids
  addBid: (bid: Omit<Bid, "id" | "createdAt">) => void;
  
  // Services
  toggleServiceActive: (serviceId: string) => void;
  
  // Vendors
  addVendor: (vendor: Omit<Vendor, "id">) => void;
  
  // Filters
  filterJobs: (status?: JobStatus, serviceType?: ServiceCategory) => Job[];
  getJobsForUser: () => Job[];
  getAvailableJobs: () => Job[];
}

// Mock data
const MOCK_JOBS: Job[] = [
  {
    id: "1",
    title: "Electrical Wiring Fix",
    description: "Fix faulty wiring in the kitchen and living room",
    clientId: "2", // Sarah Client
    providerId: "3", // Mike Provider
    location: "123 Main St, Anytown, USA",
    serviceType: "electrical",
    budget: 500,
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    status: "in_progress",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "HVAC Installation",
    description: "Install new HVAC system in a residential property",
    clientId: "2", // Sarah Client
    location: "456 Oak Ave, Sometown, USA",
    serviceType: "hvac",
    budget: 2500,
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Roof Repair",
    description: "Fix leaking roof and replace damaged shingles",
    clientId: "2", // Sarah Client
    location: "789 Pine Rd, Othertown, USA",
    serviceType: "roofing",
    budget: 1200,
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Solar Panel Installation",
    description: "Install solar panels on residential property",
    clientId: "2", // Sarah Client
    providerId: "3", // Mike Provider
    location: "101 Elm St, Newtown, USA",
    serviceType: "solar",
    budget: 8000,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    status: "assigned",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    title: "Emergency Plumbing Fix",
    description: "Fix burst pipe in bathroom",
    clientId: "2", // Sarah Client
    providerId: "3", // Mike Provider
    location: "202 Maple Dr, Oldtown, USA",
    serviceType: "emergency",
    budget: 350,
    deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
    status: "completed",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const MOCK_BIDS: Bid[] = [
  {
    id: "1",
    jobId: "2",
    providerId: "3", // Mike Provider
    amount: 2300,
    estimatedDuration: 3,
    notes: "Can complete faster than estimated timeline",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    jobId: "3",
    providerId: "3", // Mike Provider
    amount: 1100,
    estimatedDuration: 2,
    notes: "Have all materials ready to go",
    createdAt: new Date().toISOString(),
  }
];

const MOCK_SERVICES: Service[] = [
  {
    id: "1",
    name: "Electrical Wiring",
    category: "electrical",
    description: "Installation and repair of electrical wiring",
    isActive: true,
    baseRate: 75, // per hour
  },
  {
    id: "2",
    name: "HVAC Installation",
    category: "hvac",
    description: "Installation of heating, ventilation, and air conditioning systems",
    isActive: true,
    baseRate: 95, // per hour
  },
  {
    id: "3",
    name: "Roof Repair",
    category: "roofing",
    description: "Repair of damaged roofing",
    isActive: true,
    baseRate: 85, // per hour
  },
  {
    id: "4",
    name: "Solar Panel Installation",
    category: "solar",
    description: "Installation of solar panels for residential and commercial properties",
    isActive: true,
    baseRate: 110, // per hour
  },
  {
    id: "5",
    name: "Emergency Plumbing",
    category: "emergency",
    description: "Emergency plumbing services",
    isActive: true,
    baseRate: 120, // per hour
  },
  {
    id: "6",
    name: "Preventive Maintenance",
    category: "maintenance",
    description: "Regular maintenance to prevent major issues",
    isActive: true,
    baseRate: 65, // per hour
  },
  {
    id: "7",
    name: "Plumbing Installation",
    category: "plumbing",
    description: "Installation of plumbing systems",
    isActive: true,
    baseRate: 80, // per hour
  }
];

const MOCK_VENDORS: Vendor[] = [
  {
    id: "1",
    name: "ElectriSupply Co.",
    email: "contact@electrisupply.com",
    phone: "555-123-4567",
    address: "123 Voltage Ave, Circuit City, USA",
    materials: ["Wiring", "Circuit Breakers", "Electrical Panels"],
    paymentStatus: "paid",
  },
  {
    id: "2",
    name: "Plumbing Warehouse",
    email: "info@plumbingwarehouse.com",
    phone: "555-987-6543",
    address: "456 Pipe St, Watertown, USA",
    materials: ["Pipes", "Fixtures", "Water Heaters"],
    paymentStatus: "pending",
  },
  {
    id: "3",
    name: "HVAC Supply Center",
    email: "orders@hvacsupply.com",
    phone: "555-456-7890",
    address: "789 Cool Ave, Airville, USA",
    materials: ["AC Units", "Furnaces", "Ductwork"],
    paymentStatus: "paid",
  },
  {
    id: "4",
    name: "Roofing Materials Inc.",
    email: "sales@roofingmaterials.com",
    phone: "555-321-0987",
    address: "101 Shingle Dr, Rooftown, USA",
    materials: ["Shingles", "Roofing Tiles", "Underlayment"],
    paymentStatus: "pending",
  }
];

const MOCK_PAYMENTS: Payment[] = [
  {
    id: "1",
    jobId: "1",
    amount: 500,
    status: "paid",
    paymentDate: new Date().toISOString(),
    paymentMethod: "credit_card",
  },
  {
    id: "2",
    jobId: "5",
    amount: 350,
    status: "paid",
    paymentDate: new Date().toISOString(),
    paymentMethod: "bank_transfer",
  },
  {
    id: "3",
    vendorId: "1",
    amount: 1200,
    status: "paid",
    paymentDate: new Date().toISOString(),
    paymentMethod: "bank_transfer",
  },
  {
    id: "4",
    vendorId: "3",
    amount: 2500,
    status: "paid",
    paymentDate: new Date().toISOString(),
    paymentMethod: "check",
  },
  {
    id: "5",
    vendorId: "2",
    amount: 800,
    status: "pending",
    paymentMethod: "bank_transfer",
  },
  {
    id: "6",
    vendorId: "4",
    amount: 1500,
    status: "pending",
    paymentMethod: "check",
  }
];

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  // State
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [bids, setBids] = useState<Bid[]>(MOCK_BIDS);
  const [services, setServices] = useState<Service[]>(MOCK_SERVICES);
  const [vendors, setVendors] = useState<Vendor[]>(MOCK_VENDORS);
  const [payments, setPayments] = useState<Payment[]>(MOCK_PAYMENTS);

  // Jobs
  const addJob = (jobData: Omit<Job, "id" | "createdAt" | "updatedAt" | "status">) => {
    const now = new Date().toISOString();
    const newJob: Job = {
      id: `job_${Date.now()}`,
      ...jobData,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    };
    setJobs((prevJobs) => [...prevJobs, newJob]);
  };

  const updateJobStatus = (jobId: string, status: JobStatus) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.id === jobId
          ? { ...job, status, updatedAt: new Date().toISOString() }
          : job
      )
    );
  };

  const assignJob = (jobId: string, providerId: string) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.id === jobId
          ? {
              ...job,
              providerId,
              status: "assigned",
              updatedAt: new Date().toISOString(),
            }
          : job
      )
    );
  };

  // Bids
  const addBid = (bidData: Omit<Bid, "id" | "createdAt">) => {
    const newBid: Bid = {
      id: `bid_${Date.now()}`,
      ...bidData,
      createdAt: new Date().toISOString(),
    };
    setBids((prevBids) => [...prevBids, newBid]);
  };

  // Services
  const toggleServiceActive = (serviceId: string) => {
    setServices((prevServices) =>
      prevServices.map((service) =>
        service.id === serviceId
          ? { ...service, isActive: !service.isActive }
          : service
      )
    );
  };

  // Vendors
  const addVendor = (vendorData: Omit<Vendor, "id">) => {
    const newVendor: Vendor = {
      id: `vendor_${Date.now()}`,
      ...vendorData,
    };
    setVendors((prevVendors) => [...prevVendors, newVendor]);
  };

  // Filters
  const filterJobs = (status?: JobStatus, serviceType?: ServiceCategory) => {
    return jobs.filter((job) => {
      const statusMatch = status ? job.status === status : true;
      const serviceMatch = serviceType ? job.serviceType === serviceType : true;
      return statusMatch && serviceMatch;
    });
  };

  const getJobsForUser = () => {
    if (!user) return [];
    
    switch (user.role) {
      case "admin":
        return jobs;
      case "client":
        return jobs.filter((job) => job.clientId === user.id);
      case "service_provider":
        return jobs.filter(
          (job) => job.providerId === user.id || job.status === "pending"
        );
      default:
        return [];
    }
  };

  const getAvailableJobs = () => {
    return jobs.filter((job) => job.status === "pending");
  };

  return (
    <DataContext.Provider
      value={{
        jobs,
        bids,
        services,
        vendors,
        payments,
        addJob,
        updateJobStatus,
        assignJob,
        addBid,
        toggleServiceActive,
        addVendor,
        filterJobs,
        getJobsForUser,
        getAvailableJobs,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
