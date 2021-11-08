import type { AppProps } from "next/app";
import { AxiosProvider } from "../context/AxiosProvider";
import { AuthProvider } from "../modules/auth/AuthProvider";
import { PageComponent } from "../types/PageComponent";
import { createWrapper } from "@duxcore/wrapper";
import "../styles/globals.css";
import "../styles/utils.css";
import { WrapperProvider } from "../context/WrapperProvider";
import { useEffect } from "react";

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <div suppressHydrationWarning={true}>
      <AxiosProvider>
        <WrapperProvider>
          <AuthProvider
            requiresAuth={(Component as PageComponent<unknown>).requiresAuth ?? true}
          >
            <Component {...pageProps} />
          </AuthProvider>
        </WrapperProvider>
      </AxiosProvider>
    </div>
  );
}

export default MyApp;
