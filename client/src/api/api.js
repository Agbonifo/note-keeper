// client/src/api/api.js
// import axios from "axios";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL + "/api/v1", 
// });

// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) config.headers.Authorization = `Bearer ${token}`;
//     return config;
//   },
//   (err) => Promise.reject(err)
// );

// export default api;



import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api/v1",
  withCredentials: true, 
});

let csrfToken = null;

export const fetchCsrfToken = async () => {
  const response = await axios.get(import.meta.env.VITE_API_URL + "/api/v1/csrf-token", {
    withCredentials: true,
  });
  csrfToken = response.data.csrfToken;
  return csrfToken;
};

api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const method = config.method?.toUpperCase();
    if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
      if (!csrfToken) {
        await fetchCsrfToken();
      }
      config.headers["X-CSRF-Token"] = csrfToken;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
