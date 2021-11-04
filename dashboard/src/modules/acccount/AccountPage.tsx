import { Layout } from "../../components/Layout";
import { useAuth } from "../auth/useAuth"

export const AccountPage = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="">hello world</div>
    </Layout>
  )
}