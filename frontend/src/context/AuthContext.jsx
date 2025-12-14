// // import {
// //     createContext,
// //     useContext,
// //     useEffect,
// //     useState,
// //     useCallback,
// // } from "react";
// // import axios from "../api/axios"; // your axios instance

// // const AuthContext = createContext(null);

// // export function AuthProvider({ children }) {
// //     const [accessToken, setAccessToken] = useState(null);
// //     const [user, setUser] = useState(null); // user info + roles
// //     const [loading, setLoading] = useState(true);

// //     const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// //     // ======================
// //     // LOGOUT
// //     // ======================
// //     const logout = useCallback(async () => {
// //         try {
// //             await axios.post("/auth/logout", {}, { withCredentials: true });
// //         } catch (err) {
// //             console.error("Logout failed", err);
// //         } finally {
// //             setAccessToken(null);
// //             setUser(null);
// //         }
// //     }, []);

// //     // ======================
// //     // REFRESH TOKEN
// //     // ======================
// //     const refreshToken = useCallback(async () => {
// //         try {
// //             const res = await fetch(`${BASE_URL}/auth/refresh`, {
// //                 method: "POST",
// //                 credentials: "include", // important to send cookies
// //             });

// //             if (!res.ok) return null;

// //             const data = await res.json();

// //             setAccessToken(data.accessToken);
// //             setUser(data.user); // must come from backend
// //             return data.accessToken;
// //         } catch (err) {
// //             console.error("Refresh token error:", err);
// //             return null;
// //         }
// //     }, [BASE_URL]);

// //     // ======================
// //     // INITIAL SILENT REFRESH
// //     // ======================
// //     useEffect(() => {
// //         (async () => {
// //             await refreshToken();
// //             setLoading(false);
// //         })();
// //     }, [refreshToken]);

// //     // ======================
// //     // AXIOS PRIVATE INSTANCE
// //     // ======================
// //     const axiosPrivate = useCallback(() => {
// //         const instance = axios;

// //         // Request interceptor: attach access token
// //         instance.interceptors.request.use(
// //             (config) => {
// //                 if (accessToken) {
// //                     config.headers["Authorization"] = `Bearer ${accessToken}`;
// //                 }
// //                 config.withCredentials = true;
// //                 return config;
// //             },
// //             (error) => Promise.reject(error)
// //         );

// //         // Response interceptor: handle 401 automatically
// //         instance.interceptors.response.use(
// //             (res) => res,
// //             async (error) => {
// //                 const prevRequest = error.config;
// //                 if (error.response?.status === 401 && !prevRequest._retry) {
// //                     prevRequest._retry = true;
// //                     const newToken = await refreshToken();

// //                     if (newToken) {
// //                         prevRequest.headers["Authorization"] = `Bearer ${newToken}`;
// //                         return instance(prevRequest);
// //                     }

// //                     await logout();
// //                 }
// //                 return Promise.reject(error);
// //             }
// //         );

// //         return instance;
// //     }, [accessToken, refreshToken, logout]);

// //     return (
// //         <AuthContext.Provider
// //             value={{
// //                 accessToken,
// //                 setAccessToken,
// //                 user,
// //                 isAuthenticated: !!accessToken,
// //                 logout,
// //                 axiosPrivate,
// //                 loading,
// //             }}
// //         >
// //             {!loading && children}
// //         </AuthContext.Provider>
// //     );
// // }

// // export const useAuth = () => useContext(AuthContext);



// //AuthContext
// import { createContext, useContext, useEffect, useState, useCallback } from "react";
// import axios from "../api/axios";

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//     const [accessToken, setAccessToken] = useState(null);
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);

//     const BASE_URL = import.meta.env.VITE_API_BASE_URL;

//     const logout = useCallback(async () => {
//         try {
//             await axios.post("/auth/logout", {}, { withCredentials: true });
//         } catch (err) {
//             console.error("Logout failed", err);
//         } finally {
//             setAccessToken(null);
//             setUser(null);
//         }
//     }, []);

//     const refreshToken = useCallback(async () => {
//         try {
//             const res = await fetch(`${BASE_URL}/auth/refresh`, {
//                 method: "POST",
//                 credentials: "include",
//             });

//             if (!res.ok) return null;

//             const data = await res.json();
//             setAccessToken(data.accessToken);

//             // setUser(data.user); 
//             // return data.accessToken;
//              return data.accessToken;
//         } catch (err) {
//             console.error("Refresh token error:", err);
//             return null;
//         }
//     }, [BASE_URL]);

//     // Silent refresh on app load
//     useEffect(() => {
//         (async () => {
//             await refreshToken();
//             setLoading(false);
//         })();
//     }, [refreshToken]);

//     // Axios interceptors
//     const axiosPrivate = useCallback(() => {
//         const instance = axios;

//         // attach access token
//         instance.interceptors.request.use(
//             (config) => {
//                 if (accessToken) {
//                     config.headers["Authorization"] = `Bearer ${accessToken}`;
//                 }
//                 config.withCredentials = true;
//                 return config;
//             },
//             (error) => Promise.reject(error)
//         );

//         // handle 401
//         instance.interceptors.response.use(
//             (res) => res,
//             async (error) => {
//                 const prevRequest = error.config;
//                 if (error.response?.status === 401 && !prevRequest._retry) {
//                     prevRequest._retry = true;
//                     const newToken = await refreshToken();
//                     if (newToken) {
//                         prevRequest.headers["Authorization"] = `Bearer ${newToken}`;
//                         return instance(prevRequest);
//                     }
//                     await logout();
//                 }
//                 return Promise.reject(error);
//             }
//         );

//         return instance;
//     }, [accessToken, refreshToken, logout]);

//     return (
//         <AuthContext.Provider
//             value={{
//                 accessToken,
//                 setAccessToken,
//                 user,
//                 setUser,    
//                 isAuthenticated: !!accessToken,
//                 logout,
//                 axiosPrivate,
//                 loading,
//             }}
//         >
//             {!loading && children}
//         </AuthContext.Provider>
//     );
// }

// export const useAuth = () => useContext(AuthContext);



import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [accessToken, setAccessToken] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    // ========== LOGOUT ==========
    const logout = useCallback(async () => {
        try {
            await axios.post(`${BASE_URL}/auth/logout`, {}, { withCredentials: true });
        } catch (err) {
            console.error("Logout failed:", err);
        } finally {
            setAccessToken(null);
            setUser(null);
        }
    }, [BASE_URL]);

    // ========== REFRESH TOKEN ==========
    const refreshToken = useCallback(async () => {
        try {
            const res = await fetch(`${BASE_URL}/auth/refresh`, {
                method: "POST",
                credentials: "include",
            });

            if (!res.ok) return null;

            const data = await res.json();
            setAccessToken(data.accessToken);
            setUser(data.user);

            return data.accessToken;
        } catch (err) {
            console.error("Refresh token error:", err);
            return null;
        }
    }, [BASE_URL]);

    // ========== SILENT REFRESH ==========
    useEffect(() => {
        (async () => {
            await refreshToken();
            setLoading(false);
        })();
    }, [refreshToken]);

    // ========== AXIOS PRIVATE INSTANCE ==========
    const axiosPrivate = useCallback(() => {
        const instance = axios.create();

        instance.interceptors.request.use(
            (config) => {
                if (accessToken) config.headers["Authorization"] = `Bearer ${accessToken}`;
                config.withCredentials = true;
                return config;
            },
            (error) => Promise.reject(error)
        );

        instance.interceptors.response.use(
            (res) => res,
            async (error) => {
                const prevRequest = error.config;
                if (error.response?.status === 401 && !prevRequest._retry) {
                    prevRequest._retry = true;
                    const newToken = await refreshToken();
                    if (newToken) {
                        prevRequest.headers["Authorization"] = `Bearer ${newToken}`;
                        return instance(prevRequest);
                    }
                    await logout();
                }
                return Promise.reject(error);
            }
        );

        return instance;
    }, [accessToken, refreshToken, logout]);

    return (
        <AuthContext.Provider value={{ accessToken, setAccessToken, user, setUser, isAuthenticated: !!accessToken, logout, axiosPrivate, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
