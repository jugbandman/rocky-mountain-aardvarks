import { useState, useEffect, useCallback } from "react";

interface AuthState {
  authenticated: boolean;
  loading: boolean;
}

interface AuthStatusResponse {
  authenticated: boolean;
}

interface LoginResponse {
  success?: boolean;
  error?: string;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    authenticated: false,
    loading: true,
  });

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/status");
      const data: AuthStatusResponse = await response.json();
      setState({ authenticated: data.authenticated, loading: false });
    } catch {
      setState({ authenticated: false, loading: false });
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data: LoginResponse = await response.json();

      if (response.ok && data.success) {
        setState({ authenticated: true, loading: false });
        return { success: true };
      }

      return { success: false, error: data.error || "Login failed" };
    } catch {
      return { success: false, error: "Network error" };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      setState({ authenticated: false, loading: false });
    }
  };

  return {
    authenticated: state.authenticated,
    loading: state.loading,
    login,
    logout,
    checkAuth,
  };
}
