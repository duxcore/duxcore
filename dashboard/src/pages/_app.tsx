import type { AppProps } from "next/app";
import { AxiosProvider } from "../context/AxiosProvider";
import { AuthProvider } from "../modules/auth/AuthProvider";
import { PageComponent } from "../types/PageComponent";
import "../styles/globals.css";
import "../styles/utils.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AxiosProvider>
      <AuthProvider
        requiresAuth={!!(Component as PageComponent<unknown>).requiresAuth}
      >
        <Component {...pageProps} />
      </AuthProvider>
    </AxiosProvider>
  );
}

export default MyApp;
