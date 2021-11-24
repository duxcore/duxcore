import { useRouter } from "next/dist/client/router";
import { useEffect } from "react";


export default function Discord() {
  let { replace } = useRouter();

  useEffect(() => { replace("https://discord.gg/dTGJ5Bchnq") }, []);

  return (<>Discord Broski</>)
}