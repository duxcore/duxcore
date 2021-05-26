import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { DuxcoreIcon, DuxcoreLogo, SolidDiscord, SolidGitHub } from "../icons";
import Wrapper from "@duxcore/wrapper";
import { useEffect } from "react";

const wsUrl = 'ws://localhost:7418';

export default function Home() {
  
  useEffect(() => {
    const wrap = new Wrapper(wsUrl);
    console.log(wrap.socket.url);
  })
  
  return (
    <>
      <Head>
        <title>Duxcore</title>
        <meta name="description" content="Duxcore" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-screen h-screen bg-black flex flex-col items-center justify-center">
        <DuxcoreIcon />
        <div className="text-white opacity-30 my-5">
          A new hosting platform?
        </div>
        <div className="flex space-x-4">
          <a href="https://github.com/HoloPanio/duxcore">
            <SolidGitHub
              width="20"
              height="20"
              className="text-white opacity-30 hover:opacity-100 transition"
            />
          </a>e\
          <a href="https://discord.gg/WDTGx7QK">
            <SolidDiscord
              width="20"
              height="20"
              className="text-white opacity-30 hover:opacity-100 transition"
            />
          </a>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const req = context.req;
  const res = context.res;

  return {
    props: {}
  }
}   