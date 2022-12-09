import { Project } from "wrapper";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Layout } from "../../components/Layout";
import { useWrapper } from "../../context/WrapperProvider";
import { PageComponent } from "../../types/PageComponent";
import { Preloader } from "../../components/PreLoader";
import Head from "next/head";
import { Button } from "../../components/forms/Button";
import { Service } from "wrapper/lib/types/service";
import { ServiceBox } from "../../components/Services/ServiceBox";

interface ViewProjectPageProps { }

export const ViewProjectPage: PageComponent<ViewProjectPageProps> =
  ({ }) => {
    const { query, push, back } = useRouter();
    console.log(query);
    const wrapper = useWrapper();
    const projectId = query.id as string;

    const [projectData, setProjectData] = useState<Project | null>(
      null
    );
    const [isLoading, setLoading] = useState(true);
    const [services, setServices] = useState<Service[]>();

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
        wrapper.api.services.fetchAllByProject(projectId).then(setServices);
        if (!projectId) push("/");
      }
    }, [projectId, push, wrapper.api.projects, wrapper.api.services]);

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
          <div className="flex flex-col gap-4">
            <div className="flex flex-row-reverse w-full">
              <div className="flex flex-row-reverse w-full gap-2">
                <Button className="w-fit p-4" color="outline" onClick={() => {
                  wrapper.api.projects.delete(projectId).then(back);
                }}>Delete Project</Button>
                <Button className="w-fit p-4" onClick={() => push('/services/create')}>Create Service</Button>
              </div>
              <div className="w-full">
                <h1 className="pl-1 text-3xl border-l border-gray-700">
                  {projectData?.name}
                </h1>
                <p
                  className="text-gray-600"
                >
                  {projectData?.id}
                </p>
              </div>
            </div>
            <div
              className="grid gap-1"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(20rem, 1fr))" }}
            >
              {services && services.map((service) => (
                <ServiceBox key={service.id} data={service} />
              ))}
            </div>
          </div>
        </Preloader>
      </>
    );
  };

ViewProjectPage.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};
