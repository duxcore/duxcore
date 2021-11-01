import { GetServerSidePropsContext } from "next";
import { RegistrationPage } from "../modules/RegistrationPage/RegistrationPage";

export default RegistrationPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req, res, query } = context;
  const captchaKey = !process.env.NODE_ENV || process.env.NODE_ENV === 'production' ? "417cace0-0163-4200-bc3f-b8f4c3887b45" : "10000000-ffff-ffff-ffff-000000000001";

  return {
    props: {
      captchaKey
    },
  };
}
