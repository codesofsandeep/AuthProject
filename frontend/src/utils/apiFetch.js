// import { useAuth } from '../context/AuthContext';

// export function useApiFetch() {
//   const { accessToken, setAccessToken } = useAuth();

//   return async function apiFetch(url, options = {}) {
//     options.headers = options.headers || {};
//     options.headers.Authorization = `Bearer ${accessToken}`;
//     options.credentials = 'include';

//     let res = await fetch(url, options);

//     if (res.status === 401) {
//       // Attempt refresh
//       const r = await fetch('http://localhost:4000/api/auth/refresh', {
//         method: 'POST',
//         credentials: 'include'
//       });

//       if (!r.ok) return res;

//       const data = await r.json();
//       setAccessToken(data.accessToken);

//       options.headers.Authorization = `Bearer ${data.accessToken}`;
//       res = await fetch(url, options);
//     }

//     return res;
//   };
// }


import { useAuth } from '../context/AuthContext';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function useApiFetch() {
    const { accessToken, setAccessToken } = useAuth();

    return async function apiFetch(endpoint, options = {}) {
        options.headers = options.headers || {};
        options.headers.Authorization = `Bearer ${accessToken}`;
        options.credentials = 'include';

        // 1️⃣ First request
        let res = await fetch(`${BASE_URL}${endpoint}`, options);

        // 2️⃣ If access token expired
        if (res.status === 401) {
            const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
                method: 'POST',
                credentials: 'include',
            });

            if (!refreshRes.ok) {
                return res; // refresh failed → logout handled elsewhere
            }

            const data = await refreshRes.json();
            setAccessToken(data.accessToken);

            // 3️⃣ Retry original request with new token
            options.headers.Authorization = `Bearer ${data.accessToken}`;
            res = await fetch(`${BASE_URL}${endpoint}`, options);
        }

        return res;
    };
}
