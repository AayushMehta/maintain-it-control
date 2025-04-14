
import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "admin" | "client" | "service_provider" | "vendor";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demonstration
const MOCK_USERS = [
  {
    id: "1",
    name: "John Admin",
    email: "admin@example.com",
    password: "password",
    role: "admin" as UserRole,
    avatar: "https://ui-avatars.com/api/?name=John+Admin&background=0284c7&color=fff"
  },
  {
    id: "2",
    name: "Sarah Client",
    email: "client@example.com",
    password: "password",
    role: "client" as UserRole,
    avatar: "https://ui-avatars.com/api/?name=Sarah+Client&background=14b8a6&color=fff"
  },
  {
    id: "3",
    name: "Mike Provider",
    email: "provider@example.com",
    password: "password",
    role: "service_provider" as UserRole,
    avatar: "https://ui-avatars.com/api/?name=Mike+Provider&background=6366f1&color=fff"
  },
  {
    id: "4",
    name: "Vendor Co.",
    email: "vendor@example.com",
    password: "password",
    role: "vendor" as UserRole,
    avatar: "https://ui-avatars.com/api/?name=Vendor+Co&background=f97316&color=fff"
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("maintainItUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulating API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const foundUser = MOCK_USERS.find(
        (u) => u.email === email && u.password === password
      );
      
      if (!foundUser) {
        throw new Error("Invalid credentials");
      }
      
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem("maintainItUser", JSON.stringify(userWithoutPassword));
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("maintainItUser");
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      // Simulating API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Check if email already exists
      if (MOCK_USERS.some((u) => u.email === email)) {
        throw new Error("Email already exists");
      }
      
      // In a real app, you would send this data to an API
      // For demo, we're just creating a new user object
      const newUser = {
        id: String(MOCK_USERS.length + 1),
        name,
        email,
        role,
        avatar: `https://ui-avatars.com/api/?name=${name.replace(/ /g, '+')}&background=0284c7&color=fff`
      };
      
      setUser(newUser);
      localStorage.setItem("maintainItUser", JSON.stringify(newUser));
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
