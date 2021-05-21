import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;