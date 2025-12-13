import { useAuth } from '../context/AuthContext';

export function useApiFetch() {
    const { accessToken, setAccessToken } = useAuth();

    return async function apiFetch(url, options = {}) {
        options.headers = options.headers || {};
        options.headers.Authorization = `Bearer ${accessToken}`;
        options.credentials = 'include';

        let res = await fetch(url, options);

        if (res.status === 401) {
            // Attempt refresh
            const r = await fetch('http://localhost:4000/api/auth/refresh', {
                method: 'POST',
                credentials: 'include'
            });

            if (!r.ok) return res;

            const data = await r.json();
            setAccessToken(data.accessToken);

            options.headers.Authorization = `Bearer ${data.accessToken}`;
            res = await fetch(url, options);
        }

        return res;
    };
}
