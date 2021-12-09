import { Collection } from "@duxcore/wrapper";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Layout } from "../../components/Layout";
import { useWrapper } from "../../context/WrapperProvider";
import { PageComponent } from "../../types/PageComponent";
import { Preloader } from "../../components/PreLoader";
import Head from "next/head";

interface ViewCollectionPageProps {}

export const ViewCollectionPage: PageComponent<ViewCollectionPageProps> =
  ({}) => {
    const { query, push } = useRouter();
    const wrapper = useWrapper();
    const collectionId = query.collection as string;

    const [collectionData, setCollectionData] = useState<Collection | null>(
      null
    );
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
      if (collectionId) {
        wrapper.api.serviceCollections
          .fetch(collectionId)
          .then((data) => {
            setCollectionData(data);
            setLoading(false);
          })
          .catch((_err) => {
            setLoading(false);
          });
        if (!collectionId) push("/");
      }
    }, [collectionId, push, wrapper.api.serviceCollections]);

    if (!collectionData && !isLoading) return <h2>Failed to retrieve Collection...</h2>;
    return (
      <>
        <Head>
          {collectionData ? (
            <title>Duxcore | {collectionData?.name}</title>
          ) : (
            ""
          )}
        </Head>
        <Preloader active={isLoading}>
          <h1 className="pl-1 text-3xl border-l border-gray-700">
            {collectionData?.name}
          </h1>
          <p>
            {
              "There is something that is supposed to go here, but I haven't decided yet"
            }
          </p>
        </Preloader>
      </>
    );
  };

ViewCollectionPage.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};
