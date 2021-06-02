import Head from "next/head";
import { DuxcoreIcon, DuxcoreLogo, SolidDiscord, SolidGitHub } from "../icons";

export default function Home() {
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
          </a>
          <a href="https://discord.gg/vZTbxBNSVA">
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
