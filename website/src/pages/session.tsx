import { GetServerSidePropsContext } from "next";
import Wrapper from "@duxcore/wrapper";
import { getSession } from "../modules/sessions";

export default function Home(props) {
  console.log(props)
  
  return (
    <>
      <p>WS URL: {props.wsUrl}</p>
      <p>Session ID: {props.session.session_id}</p>
      <p>x_csrf: {props.session.x_csrf}</p>
      <p>User Agent: {props.session.client}</p>
      <p>IP Address: {props.session.ip}</p>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const req = context.req;
  const res = context.res;

  const wsUrl = process.env.SOCKET_SERVER_ADDRESS
  const wrap = new Wrapper(wsUrl);
  const session = await getSession(wrap, context);
  wrap.close();

  return {
    props: {
      wsUrl,
      session
    }
  }
}   