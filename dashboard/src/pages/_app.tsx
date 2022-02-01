import type { AppProps } from "next/app";
import { AuthProvider } from "../modules/auth/AuthProvider";
import { PageComponent } from "../types/PageComponent";
import "../styles/globals.css";
import "../styles/utils.css";
import { WrapperProvider } from "../context/WrapperProvider";
import { useGetIntendedPath } from "../hooks/useGetIntendedPath";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  useGetIntendedPath();
  const ComponentPage = Component as PageComponent<unknown>;

  return (
    <div suppressHydrationWarning={true}>
      <Head>
        <title>Duxcore</title>
      </Head>
      <WrapperProvider>
        <AuthProvider requiresAuth={ComponentPage.requiresAuth ?? true}>
          {ComponentPage.getLayout ? (
            ComponentPage.getLayout(<Component {...pageProps} />)
          ) : (
            <Component {...pageProps} />
          )}
        </AuthProvider>
      </WrapperProvider>
    </div>
  );
}

export default MyApp;
