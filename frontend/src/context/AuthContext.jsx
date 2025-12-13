// // import { createContext, useContext, useEffect, useState } from 'react';

// // const AuthContext = createContext(null);

// // export function AuthProvider({ children }) {
// //     const [accessToken, setAccessToken] = useState(null);
// //     const [loading, setLoading] = useState(true);

// //     const logout = async () => {
// //         try {
// //             await api.post("/auth/logout", {}, { withCredentials: true });
// //         } catch (err) {
// //             console.error("Logout request failed", err);
// //         } finally {

// //             setAccessToken(null);
// //         }
// //     };


// //     // Silent refresh on app load
// //     useEffect(() => {
// //         async function refresh() {
// //             try {
// //                 const res = await fetch('http://localhost:4000/api/auth/refresh', {
// //                     method: 'POST',
// //                     credentials: 'include', // important!
// //                 });

// //                 if (res.ok) {
// //                     const data = await res.json();
// //                     setAccessToken(data.accessToken);
// //                 } else {
// //                     console.log('Refresh failed:', res.status);
// //                 }
// //             } catch (err) {
// //                 console.error('Refresh error:', err);
// //             } finally {
// //                 setLoading(false);
// //             }
// //         }

// //         refresh();
// //     }, []);

// //     return (
// //         <AuthContext.Provider value={{ accessToken, setAccessToken }}>
// //             {!loading && children}
// //         </AuthContext.Provider>
// //     );
// // }

// // export const useAuth = () => useContext(AuthContext);


// import { createContext, useContext, useEffect, useState } from 'react';
// import api from "../api/axios";

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//     const [accessToken, setAccessToken] = useState(null);
//     const [loading, setLoading] = useState(true);

//     const logout = async () => {
//         try {
//             await api.post("/auth/logout", {}, { withCredentials: true });
//         } catch (err) {
//             console.error("Logout request failed", err);
//         } finally {
//             setAccessToken(null); //  client-side logout
//         }
//     };

//     // Silent refresh on app load
//     useEffect(() => {
//         async function refresh() {
//             try {
//                 const res = await fetch(
//                     'http://localhost:4000/api/auth/refresh',
//                     {
//                         method: 'POST',
//                         credentials: 'include',
//                     }
//                 );

//                 if (res.ok) {
//                     const data = await res.json();
//                     setAccessToken(data.accessToken);
//                 }
//             } catch (err) {
//                 console.error('Refresh error:', err);
//             } finally {
//                 setLoading(false);
//             }
//         }

//         refresh();
//     }, []);

//     return (
//         <AuthContext.Provider
//             value={{ accessToken, setAccessToken, logout }}  // ✅ FIX
//         >
//             {!loading && children}
//         </AuthContext.Provider>
//     );
// }

// export const useAuth = () => useContext(AuthContext);


import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // =====================
    // Logout Function
    // =====================
    const logout = useCallback(async () => {
        try {
            await api.post('/auth/logout', {}, { withCredentials: true });
        } catch (err) {
            console.error('Logout failed:', err);
        } finally {
            setAccessToken(null);
        }
    }, []);

    // =====================
    // Silent Refresh Function
    // =====================
    const refreshToken = useCallback(async () => {
        try {
            const res = await fetch("https://authproject-2.onrender.com/api/auth/refresh", {
                method: "POST",
                credentials: "include",
            });

            if (!res.ok) {
                console.log('Refresh failed:', res.status);
                return null;
            }

            const data = await res.json();
            setAccessToken(data.accessToken);
            return data.accessToken;
        } catch (err) {
            console.error('Refresh error:', err);
            return null;
        }
    }, []);

    // =====================
    // On App Load: Try Silent Refresh
    // =====================
    useEffect(() => {
        async function init() {
            await refreshToken();
            setLoading(false);
        }
        init();
    }, [refreshToken]);

    // =====================
    // Axios Private Instance
    // =====================
    const axiosPrivate = useCallback(() => {
        const instance = api;

        // Request interceptor: attach access token
        instance.interceptors.request.use(
            config => {
                if (accessToken) {
                    config.headers['Authorization'] = `Bearer ${accessToken}`;
                }
                return config;
            },
            error => Promise.reject(error)
        );

        // Response interceptor: handle 401 automatically
        instance.interceptors.response.use(
            response => response,
            async error => {
                const originalRequest = error.config;

                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    const newToken = await refreshToken();

                    if (newToken) {
                        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                        return instance(originalRequest);
                    } else {
                        await logout();
                        return Promise.reject(error);
                    }
                }
                return Promise.reject(error);
            }
        );

        return instance;
    }, [accessToken, refreshToken, logout]);

    return (
        <AuthContext.Provider value={{ accessToken, setAccessToken, logout, axiosPrivate }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
