import { Layout } from "../../components/Layout";
import { PageComponent } from "../../types/PageComponent";
import { useAuth } from "../auth/useAuth";

interface AccountPageProps { }

export const AccountPage: PageComponent<AccountPageProps> = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="">hello world</div>
    </Layout>
  );
};
