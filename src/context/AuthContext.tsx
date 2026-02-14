import React, { createContext, useContext, useEffect, useState } from "react";

// Types
export interface User {
  id: string;
  email: string;
  role: string;
  user_metadata: {
    full_name?: string;
    avatar_url?: string;
  };
}

interface AuthContextType {
  user: User | null;
  role: string | null;
  isLoading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (
    email: string,
    password: string,
    name: string,
  ) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current user on mount (Session Persistence)
  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  const checkUserLoggedIn = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.success) {
        // Map backend user to frontend detailed object
        const userData: User = {
          id: data.data._id,
          email: data.data.email,
          role: data.data.role,
          user_metadata: {
            full_name: data.data.name,
            avatar_url: data.data.avatar,
          },
        };
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!data.success) {
      throw new Error(data.message || "Login failed");
    }

    const userData: User = {
      id: data.user.id,
      email: data.user.email,
      role: data.user.role,
      user_metadata: {
        full_name: data.user.name,
        avatar_url: data.user.avatar,
      },
    };
    setUser(userData);
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    name: string,
  ) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await res.json();
    if (!data.success) {
      // Check for array of errors from express-validator
      if (data.errors && Array.isArray(data.errors)) {
        throw new Error(data.errors.map((e: any) => e.msg).join(", "));
      }
      throw new Error(data.message || "Registration failed");
    }

    const userData: User = {
      id: data.user.id,
      email: data.user.email,
      role: data.user.role,
      user_metadata: {
        full_name: data.user.name,
        avatar_url: data.user.avatar,
      },
    };
    setUser(userData);
  };

  const signOut = async () => {
    try {
      await fetch("/api/auth/logout");
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const signInWithGoogle = async () => {
    // Placeholder for future passport.js implementation
    alert(
      "Google Login requires Passport.js setup on backend. Please use Email/Password for now.",
    );
  };

  const signInWithGithub = async () => {
    // Placeholder for future passport.js implementation
    alert(
      "GitHub Login requires Passport.js setup on backend. Please use Email/Password for now.",
    );
  };

  const value = {
    user,
    role: user?.role || null,
    isLoading,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signInWithGithub,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
