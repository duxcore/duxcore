import { GetServerSidePropsContext } from "next";
import { AppInitialProps } from "next/dist/next-server/lib/utils";
import Wrapper from "../../../../wrapper/lib/wrapper";
import Cookies from 'cookies';

export async function getSession(wrapper: Wrapper, context: GetServerSidePropsContext) {
  const req = context.req;
  const res = context.res;

  const cookies = new Cookies(req, res);

  const sid = req.cookies.session_id;
  const sessionData = await wrapper.session.fetch(sid).then(res => res).catch(async err => {
    const newSession = await wrapper.session.new({
      client: req.headers['user-agent'],
      ip: req.socket.remoteAddress
    });

    await cookies.set('session_id', newSession.session_id);

    return newSession;
  });

  return await sessionData;
}

export function getSessionAuthToken(wrapper: Wrapper, context: GetServerSidePropsContext, session_id: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const authTokenData = await wrapper.session.requestAuthToken(session_id).catch(err => null);

    return resolve(authTokenData.auth_token);
  });
}