import type { AppProps } from "next/app";
import { AuthProvider } from "../modules/auth/AuthProvider";
import { PageComponent } from "../types/PageComponent";
import "../styles/globals.css";
import "../styles/utils.css";
import { WrapperProvider } from "../context/WrapperProvider";

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <div suppressHydrationWarning={true}>
      <WrapperProvider>
        <AuthProvider
          requiresAuth={(Component as PageComponent<unknown>).requiresAuth ?? true}
        >
          <Component {...pageProps} />
        </AuthProvider>
      </WrapperProvider>
    </div>
  );
}

export default MyApp;
