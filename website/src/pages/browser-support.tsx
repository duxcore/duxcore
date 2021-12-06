import Head from "next/head";
import wrapper from "wrapper";
import { DuxcoreIcon, DuxcoreLogo, SolidDiscord, SolidGitHub } from "../icons";

export default function Home() {
  const wrap = wrapper("test");

  return (
    <>
      <Head>
        <title>Duxcore | Browser-support</title>
        <meta name="description" content="Duxcore" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-screen h-screen bg-black flex flex-col items-center justify-center">
          <h1>If you have to check then it's probably too old</h1>

        {/** Somebody insert logic to actually check and verify... */}
      </div>
    </>
  );
}
