
import React, { useState } from "react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Building, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard, 
  Bell, 
  Shield, 
  Lock, 
  Save,
  Loader2 
} from "lucide-react";

const SettingsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  
  // Profile form state
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "(555) 123-4567", // Mock data
    address: "123 Main St, Anytown, USA", // Mock data
  });
  
  // Company form state (for business users)
  const [company, setCompany] = useState({
    name: "My Business", // Mock data
    email: "contact@mybusiness.com", // Mock data
    phone: "(555) 987-6543", // Mock data
    address: "456 Business Ave, Commerce City, USA", // Mock data
    taxId: "12-3456789", // Mock data
  });
  
  // Notification settings
  const [notifications, setNotifications] = useState({
    email: true,
    jobUpdates: true,
    marketing: false,
    newJobs: true,
  });
  
  // Security settings
  const [security, setSecurity] = useState({
    twoFactor: false,
  });
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompany({
      ...company,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications({
      ...notifications,
      [key]: value,
    });
  };
  
  const handleSaveProfile = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully",
      });
    }, 1000);
  };
  
  const handleSaveCompany = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      toast({
        title: "Company Updated",
        description: "Your company information has been updated successfully",
      });
    }, 1000);
  };
  
  const handleSaveNotifications = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      toast({
        title: "Notifications Updated",
        description: "Your notification preferences have been updated",
      });
    }, 1000);
  };
  
  const handleSaveSecurity = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      toast({
        title: "Security Settings Updated",
        description: "Your security settings have been updated",
      });
    }, 1000);
  };
  
  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "Administrator";
      case "client":
        return "Client";
      case "service_provider":
        return "Service Provider";
      case "vendor":
        return "Vendor";
    }
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
        
        <Tabs
          defaultValue="profile"
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="profile">
              <User className="mr-2 h-4 w-4" /> Profile
            </TabsTrigger>
            {(user?.role === "admin" || user?.role === "client" || user?.role === "vendor") && (
              <TabsTrigger value="company">
                <Building className="mr-2 h-4 w-4" /> Company
              </TabsTrigger>
            )}
            <TabsTrigger value="notifications">
              <Bell className="mr-2 h-4 w-4" /> Notifications
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="mr-2 h-4 w-4" /> Security
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and contact details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center space-y-3 sm:flex-row sm:space-x-6 sm:space-y-0">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user?.avatar} alt={profile.name} />
                    <AvatarFallback className="text-xl">
                      {profile.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-2">
                    <div>
                      <h3 className="text-lg font-medium">{profile.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {getRoleLabel(user?.role || "client")}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        Change Picture
                      </Button>
                      <Button size="sm" variant="ghost">
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          name="name"
                          placeholder="John Doe"
                          className="pl-9"
                          value={profile.name}
                          onChange={handleProfileChange}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          className="pl-9"
                          value={profile.email}
                          onChange={handleProfileChange}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          name="phone"
                          placeholder="(555) 123-4567"
                          className="pl-9"
                          value={profile.phone}
                          onChange={handleProfileChange}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="address"
                          name="address"
                          placeholder="123 Main St, Anytown, USA"
                          className="pl-9"
                          value={profile.address}
                          onChange={handleProfileChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSaveProfile} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" /> Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="company" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>
                  Update your business details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="companyName"
                        name="name"
                        placeholder="Your Business Name"
                        className="pl-9"
                        value={company.name}
                        onChange={handleCompanyChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="taxId">Tax ID / EIN</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="taxId"
                        name="taxId"
                        placeholder="12-3456789"
                        className="pl-9"
                        value={company.taxId}
                        onChange={handleCompanyChange}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="companyEmail">Business Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="companyEmail"
                        name="email"
                        type="email"
                        placeholder="contact@yourbusiness.com"
                        className="pl-9"
                        value={company.email}
                        onChange={handleCompanyChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="companyPhone">Business Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="companyPhone"
                        name="phone"
                        placeholder="(555) 987-6543"
                        className="pl-9"
                        value={company.phone}
                        onChange={handleCompanyChange}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="companyAddress">Business Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="companyAddress"
                      name="address"
                      placeholder="123 Business Ave, Commerce City, USA"
                      className="pl-9"
                      value={company.address}
                      onChange={handleCompanyChange}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSaveCompany} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" /> Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure how you receive notifications and alerts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">Email Notifications</div>
                      <div className="text-sm text-muted-foreground">
                        Receive email notifications for important updates
                      </div>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(value) => handleNotificationChange("email", value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">Job Status Updates</div>
                      <div className="text-sm text-muted-foreground">
                        Get notified when job status changes
                      </div>
                    </div>
                    <Switch
                      checked={notifications.jobUpdates}
                      onCheckedChange={(value) => handleNotificationChange("jobUpdates", value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">New Jobs Available</div>
                      <div className="text-sm text-muted-foreground">
                        Receive notifications about new job postings
                      </div>
                    </div>
                    <Switch
                      checked={notifications.newJobs}
                      onCheckedChange={(value) => handleNotificationChange("newJobs", value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">Marketing & Promotions</div>
                      <div className="text-sm text-muted-foreground">
                        Receive newsletters and promotional content
                      </div>
                    </div>
                    <Switch
                      checked={notifications.marketing}
                      onCheckedChange={(value) => handleNotificationChange("marketing", value)}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSaveNotifications} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" /> Save Preferences
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your account security and authentication options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">Two-Factor Authentication</div>
                      <div className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </div>
                    </div>
                    <Switch
                      checked={security.twoFactor}
                      onCheckedChange={(value) => setSecurity({ ...security, twoFactor: value })}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="currentPassword"
                        type="password"
                        placeholder="Enter your current password"
                        className="pl-9"
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="newPassword"
                          type="password"
                          placeholder="Enter new password"
                          className="pl-9"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Confirm new password"
                          className="pl-9"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSaveSecurity} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" /> Update Security
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
