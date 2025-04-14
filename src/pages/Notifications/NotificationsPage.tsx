
import React from "react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, CheckCircle, AlertCircle, Clock, Trash2 } from "lucide-react";

const NotificationsPage = () => {
  // Mock notifications data
  const notifications = [
    { 
      id: "1", 
      title: "New Job Assigned", 
      description: "You have been assigned to 'Electrical Wiring Fix'", 
      date: "2025-04-14 10:30 AM", 
      read: false, 
      type: "assignment" 
    },
    { 
      id: "2", 
      title: "Payment Received", 
      description: "Payment of $500 received for 'Electrical Wiring Fix'", 
      date: "2025-04-13 02:15 PM", 
      read: true, 
      type: "payment" 
    },
    { 
      id: "3", 
      title: "Job Status Updated", 
      description: "Job 'HVAC Installation' status changed to 'In Progress'", 
      date: "2025-04-12 11:45 AM", 
      read: false, 
      type: "status" 
    },
    { 
      id: "4", 
      title: "Deadline Approaching", 
      description: "Job 'Roof Repair' is due in 2 days", 
      date: "2025-04-11 09:20 AM", 
      read: false, 
      type: "reminder" 
    },
    { 
      id: "5", 
      title: "New Bid Received", 
      description: "New bid received for 'Solar Panel Installation'", 
      date: "2025-04-10 03:40 PM", 
      read: true, 
      type: "bid" 
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "assignment":
        return <Bell className="h-5 w-5 text-blue-500" />;
      case "payment":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "status":
        return <AlertCircle className="h-5 w-5 text-purple-500" />;
      case "reminder":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "bid":
        return <Bell className="h-5 w-5 text-orange-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
          <div className="space-x-2">
            <Button variant="outline">Mark All Read</Button>
            <Button variant="outline">
              <Trash2 className="mr-2 h-4 w-4" /> Clear All
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>All Notifications</CardTitle>
            <CardDescription>Your recent activity and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`flex rounded-lg border p-4 ${notification.read ? 'bg-white' : 'bg-blue-50'}`}
                >
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                    {getTypeIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-semibold">
                          {notification.title}
                          {!notification.read && (
                            <span className="ml-2 rounded-full bg-blue-500 px-1.5 py-0.5 text-[10px] text-white">New</span>
                          )}
                        </h4>
                        <p className="mt-1 text-sm text-gray-600">{notification.description}</p>
                      </div>
                      <span className="text-xs text-gray-500">{notification.date}</span>
                    </div>
                  </div>
                </div>
              ))}
              
              {notifications.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Bell className="mb-2 h-12 w-12 text-gray-400" />
                  <h3 className="text-lg font-medium">No notifications</h3>
                  <p className="text-sm text-gray-500">You're all caught up! Check back later for updates.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage;
