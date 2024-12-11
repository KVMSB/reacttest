import axios from "axios";


const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASEURL, // Replace with your API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the bearer token
axiosInstance.interceptors.request.use(
  async (config) => {
   
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
