import { GetServerSidePropsContext } from "next";
import Wrapper from "@duxcore/wrapper";
import { getSession, getSessionAuthToken } from "../modules/sessions";
import { useState } from "react";
import { log } from "../modules/logger";

export default function Home(props) {
  const wrapper = new Wrapper(props.wsUrl);
  wrapper.auth.request(props.auth_token).catch(console.log)

  return (
    <>
      <p>WS URL: {props.wsUrl}</p>
      <p>Session ID: {props.session.session_id}</p>
      <p>x_csrf: {props.session.x_csrf}</p>
      <p>User Agent: {props.session.client}</p>
      <p>IP Address: {props.session.ip}</p><br/>
      <p>Auth Token: {props.auth_token}</p>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const wsUrl = process.env.SOCKET_SERVER_ADDRESS
  const wrap = new Wrapper(wsUrl);

  const session = await getSession(wrap, context);
  const authToken = await getSessionAuthToken(wrap, context, session.session_id);

  wrap.close();

  return {
    props: {
      wsUrl,
      session,
      auth_token: authToken
    }
  }
}   