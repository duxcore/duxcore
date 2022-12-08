import { Project } from "wrapper";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Layout } from "../../components/Layout";
import { useWrapper } from "../../context/WrapperProvider";
import { PageComponent } from "../../types/PageComponent";
import { Preloader } from "../../components/PreLoader";
import Head from "next/head";

interface ViewProjectPageProps { }

export const ViewProjectPage: PageComponent<ViewProjectPageProps> =
  ({ }) => {
    const { query, push } = useRouter();
    console.log(query);
    const wrapper = useWrapper();
    const projectId = query.id as string;

    const [projectData, setProjectData] = useState<Project | null>(
      null
    );
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
      if (projectId) {
        wrapper.api.projects
          .fetch(projectId)
          .then((data) => {
            setProjectData(data);
            setLoading(false);
          })
          .catch((_err) => {
            setLoading(false);
          });
        if (!projectId) push("/");
      }
    }, [projectId, push, wrapper.api.projects]);

    if (!projectData && !isLoading) return <h2>Failed to retrieve Project...</h2>;
    return (
      <>
        <Head>
          {projectData ? (
            <title>Duxcore | {projectData?.name}</title>
          ) : (
            ""
          )}
        </Head>
        <Preloader active={isLoading}>
          <h1 className="pl-1 text-3xl border-l border-gray-700">
            {projectData?.name}
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

ViewProjectPage.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};
