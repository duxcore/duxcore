import { GetStaticProps } from "next";
import { isProd } from "../lib/constants";
import { RegisterPage } from "../modules/auth/register/RegisterPage";

export default RegisterPage;

// eslint-disable-next-line require-await
export const getStaticProps: GetStaticProps = async () => {
  const captchaKey = isProd
    ? "417cace0-0163-4200-bc3f-b8f4c3887b45"
    : "10000000-ffff-ffff-ffff-000000000001";

  return {
    props: {
      captchaKey,
    },
  };
};
