import { GetServerSidePropsContext } from "next";
import { RegistrationPage } from "../modules/registration-page/RegistrationPage";
import wrapper from '@duxcore/wrapper';

export default RegistrationPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req, res, query } = context;

  const unKey = query.unKey;

  const reservedUsername = await wrapper.rest.user.getReservedUsername(unKey as string).then((re) => {
    if (!re.successful) return null;
    return re.data;
  });

  return {
    props: {
      reservedUsername
    },
  };
}
