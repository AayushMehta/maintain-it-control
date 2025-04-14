
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Wrench,
  CreditCard,
  FileText,
  Truck,
  Bell,
  Settings,
  ChevronRight,
  X,
} from "lucide-react";

interface SidebarProps {
  onClose: () => void;
}

interface SidebarItem {
  name: string;
  to: string;
  icon: React.ReactElement;
  roles: UserRole[];
}

export const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const sidebarItems: SidebarItem[] = [
    {
      name: "Dashboard",
      to: "/",
      icon: <LayoutDashboard size={20} />,
      roles: ["admin", "client", "service_provider", "vendor"],
    },
    {
      name: "Jobs",
      to: "/jobs",
      icon: <Briefcase size={20} />,
      roles: ["admin", "client", "service_provider"],
    },
    {
      name: "Users",
      to: "/users",
      icon: <Users size={20} />,
      roles: ["admin"],
    },
    {
      name: "Services",
      to: "/services",
      icon: <Wrench size={20} />,
      roles: ["admin", "client", "service_provider"],
    },
    {
      name: "Payments",
      to: "/payments",
      icon: <CreditCard size={20} />,
      roles: ["admin", "client", "service_provider", "vendor"],
    },
    {
      name: "Invoices",
      to: "/invoices",
      icon: <FileText size={20} />,
      roles: ["admin", "client"],
    },
    {
      name: "Vendors",
      to: "/vendors",
      icon: <Truck size={20} />,
      roles: ["admin", "vendor"],
    },
    {
      name: "Notifications",
      to: "/notifications",
      icon: <Bell size={20} />,
      roles: ["admin", "client", "service_provider", "vendor"],
    },
    {
      name: "Settings",
      to: "/settings",
      icon: <Settings size={20} />,
      roles: ["admin", "client", "service_provider", "vendor"],
    },
  ];

  const filteredItems = sidebarItems.filter((item) =>
    item.roles.includes(user.role)
  );

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <div className="mr-2 rounded-md bg-sidebar-primary p-1">
            <Wrench className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-lg font-bold text-sidebar-foreground">Maintain-IT</h1>
        </div>
        <button
          onClick={onClose}
          className="rounded p-1 text-gray-400 hover:bg-sidebar-accent hover:text-gray-100 md:hidden"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {filteredItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "nav-link group flex items-center rounded-md px-3 py-2 text-sm font-medium",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-primary-foreground"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span className="mr-3">{item.icon}</span>
                  <span className="flex-1">{item.name}</span>
                  {isActive && <ChevronRight size={16} />}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center">
          <div className="text-xs text-slate-400">
            Maintain-IT &copy; {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </div>
  );
};
