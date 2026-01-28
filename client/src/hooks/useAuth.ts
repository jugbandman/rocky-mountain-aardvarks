import { useState, useEffect } from "react";
import { useLocation } from "wouter";

interface AuthState {
    isAuthenticated: boolean;
    isLoading: boolean;
}

export function useAuth(): AuthState {
    const [, setLocation] = useLocation();
    const [state, setState] = useState<AuthState>({
        isAuthenticated: false,
        isLoading: true,
    });

    useEffect(() => {
        async function checkAuth() {
            try {
                const response = await fetch("/api/auth/status");
                const data = await response.json();
                if (!data.authenticated) {
                    setLocation("/admin/login");
                } else {
                    setState({ isAuthenticated: true, isLoading: false });
                }
            } catch {
                setLocation("/admin/login");
            }
        }
        checkAuth();
    }, [setLocation]);

    return state;
}
