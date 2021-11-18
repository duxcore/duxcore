import { Collection } from "@duxcore/wrapper";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Layout } from "../../components/Layout";
import { useWrapper } from "../../context/WrapperProvider";
import { PageComponent } from "../../types/PageComponent";
import { Preloader } from "../../components/PreLoader";

interface ViewCollectionPageProps {
}

export const ViewCollectionPage: PageComponent<ViewCollectionPageProps> = ({ }) => {
  const { query, push } = useRouter();
  const wrapper = useWrapper();
  const collectionId = query.collection as string;

  const [collectionData, setCollectionData] = useState<Collection | null>(null);
  const [isLoading, setLoading] = useState(true);

  if (!collectionId) return <>{push("/")}</>

  useEffect(() => {
    wrapper.api.serviceCollections.fetch(collectionId)
      .then(data => {
        setCollectionData(data);
        setLoading(false)
      }).catch((err) => {
        setLoading(false);
      })
  }, [])


  if (!collectionData) return <Layout>Failed to retrieve Collection...</Layout>
  return (
    <>
      <Preloader active={isLoading}>
        <Layout title={collectionData.name}>
          <h1 className="pl-1 text-3xl border-l border-gray-700">{collectionData.name}</h1>
          <p>There is something that is supposed to go here, but I haven't decided yet</p>
        </Layout>
      </Preloader>
    </>
  )
}