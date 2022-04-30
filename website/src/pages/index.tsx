import Head from "next/head";
// import wrapper from "wrapper";
import { DuxcoreIcon, DuxcoreLogo, SolidDiscord, SolidGitHub } from "../icons";

export default function Home() {
  return (
    <>
      <Head>
        <title>Duxcore</title>
        <meta name="description" content="Duxcore" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col items-center justify-center w-screen h-screen bg-black">
        <DuxcoreIcon />
        <div className="my-5 text-white opacity-30">
          A new hosting platform?
        </div>
        <div className="flex space-x-4">
          <a href="/github">
            <SolidGitHub
              width="20"
              height="20"
              className="text-white transition opacity-30 hover:opacity-100"
            />
          </a>
          <a href="/discord">
            <SolidDiscord
              width="20"
              height="20"
              className="text-white transition opacity-30 hover:opacity-100"
            />
          </a>
        </div>
      </div>
    </>
  );
}
