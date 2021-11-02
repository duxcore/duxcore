import { AxiosInstance } from "axios";
import React, { useContext, useMemo } from "react";
import axiosInstance from "../lib/axiosInstance";

const AxiosContext = React.createContext<AxiosInstance>(axiosInstance);

interface AxiosProviderProps {}

export const AxiosProvider: React.FC<AxiosProviderProps> = ({ children }) => {
  const axiosClient = useMemo(() => {
    const instance = axiosInstance;
    return instance;
  }, []);

  return (
    <AxiosContext.Provider value={axiosClient}>
      {children}
    </AxiosContext.Provider>
  );
};

export const useAxios = () => useContext(AxiosContext);
