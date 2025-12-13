import axios from "./axios";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};

export const axiosPrivate = (getAccessToken, setAccessToken) => {
    const instance = axios;

    instance.interceptors.request.use(
        (config) => {
            const token = getAccessToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        Promise.reject
    );

    instance.interceptors.response.use(
        res => res,
        async error => {
            const originalRequest = error.config;

            if (
                error.response?.status === 401 &&
                !originalRequest._retry
            ) {
                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    }).then(token => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return instance(originalRequest);
                    });
                }

                originalRequest._retry = true;
                isRefreshing = true;

                try {
                    const res = await axios.post(
                        "/auth/refresh",
                        {},
                        { withCredentials: true }
                    );

                    const newToken = res.data.accessToken;
                    setAccessToken(newToken);
                    processQueue(null, newToken);

                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return instance(originalRequest);

                } catch (err) {
                    processQueue(err, null);
                    setAccessToken(null);
                    return Promise.reject(err);

                } finally {
                    isRefreshing = false;
                }
            }

            return Promise.reject(error);
        }
    );

    return instance;
};
