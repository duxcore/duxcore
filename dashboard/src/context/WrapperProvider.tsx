import { createWrapper } from "@duxcore/wrapper";
import React, { useContext, useMemo } from "react";

const wrapper = createWrapper({})
const WrapperContext = React.createContext<typeof wrapper>(wrapper);

interface WrapperProviderProps { }

export const WrapperProvider: React.FC<WrapperProviderProps> = ({ children }) => {
  const wrapperInstance = useMemo(() => {
    const instance = wrapper;
    return wrapper;
  }, []);

  return (
    <WrapperContext.Provider value={wrapperInstance}>
      {children}
    </WrapperContext.Provider>
  );
};

export const useWrapper = () => useContext(WrapperContext);
