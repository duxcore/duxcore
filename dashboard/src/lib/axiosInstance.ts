import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { useTokenStore } from "../modules/auth/useTokenStore";
import { API_BASEURL } from "./constants";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASEURL,
  headers: {
    "Content-Type": "application/json",
  },
  // withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const { accessToken } = useTokenStore.getState();

    if (accessToken) {
      config.headers = {
        ...config.headers,
        Authorization: accessToken,
      };
    }

    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

export default axiosInstance;

export const setAxiosHeader = (accessToken: string) => {
  axiosInstance.defaults.headers.common.Authorization = accessToken;
};
