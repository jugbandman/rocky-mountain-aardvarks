import { useState, useEffect } from "react";

export function useApi<T>(path: string) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(`/api${path}`);
                if (!response.ok) {
                    throw new Error(`API Error: ${response.statusText}`);
                }
                const json = await response.json() as T;
                setData(json);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [path]);

    return { data, loading, error };
}
