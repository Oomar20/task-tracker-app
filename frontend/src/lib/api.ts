import axios from "axios";


const api = axios.create({
    baseURL: '/',
})

// attaching the token 
api.interceptors.request.use(config => {
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// catching 401 errors and redirecting the users to the login page
api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            // kick the user back to login
            window.location.href = '/login';
            // or use your router navigate if you import it here
        }
        return Promise.reject(err);
    }
);


export default api;