import { GetServerSidePropsContext } from "next";
import { RegistrationPage } from "../modules/registration-page/RegistrationPage";
import wrapper from "@duxcore/wrapper";

export default RegistrationPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req, res, query } = context;

  const unKey = query.unKey;
  const captchaKey =
    !process.env.NODE_ENV || process.env.NODE_ENV === "production"
      ? "417cace0-0163-4200-bc3f-b8f4c3887b45"
      : "30000000-ffff-ffff-ffff-000000000003";

  const reservedUsername = await wrapper.rest.user
    .getReservedUsername(unKey as string)
    .then((re) => {
      if (!re || !re.successful) return null;
      return re.data;
    });

  return {
    props: {
      reservedUsername,
      captchaKey,
    },
  };
}
