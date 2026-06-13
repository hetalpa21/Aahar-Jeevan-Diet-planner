import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { verifyPassword } from "./api/auth.functions";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AUTH_KEY = "aahar_jeevan_auth";

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored === "true") {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (password: string) => {
    const result = await verifyPassword({ data: password });
    if (result.success) {
      localStorage.setItem(AUTH_KEY, "true");
      setIsAuthenticated(true);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
