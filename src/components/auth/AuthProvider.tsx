import { createContext, useContext, type ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/types/types";
import { ErrorBoundary } from "./ErrorBoundary";

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();

  return (
    <ErrorBoundary>
      <AuthContext.Provider value={auth}>
        {children}
      </AuthContext.Provider>
    </ErrorBoundary>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
