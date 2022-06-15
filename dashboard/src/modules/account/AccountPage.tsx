import { Layout } from "../../components/Layout";
import { useWrapper } from "../../context/WrapperProvider";
import { PageComponent } from "../../types/PageComponent";
import { useAuth } from "../auth/useAuth";
import { Button } from "../../components/forms/Button";

interface AccountPageProps {}

export const AccountPage: PageComponent<AccountPageProps> = () => {
  const { user } = useAuth();

  const wrapper = useWrapper()

  function revoke() {
    wrapper.api.user.revokeAllTokens().then(() => {
      alert("All tokens revoked")
    }).catch(() => {
      alert("Failed to revoke tokens")
    })
  }

  return (
    <>
      <h1 className="text-3xl font-bold">{user?.firstName} {user?.lastName}</h1>
      <h4 className="text-sm font-bold text-gray-400">{user?.id}</h4>

      <Button onClick={revoke}>Revoke All Session Tokens</Button>
    </>
  );
};

AccountPage.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};
