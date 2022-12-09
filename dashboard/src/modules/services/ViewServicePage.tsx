import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Layout } from "../../components/Layout";
import { useWrapper } from "../../context/WrapperProvider";
import { PageComponent } from "../../types/PageComponent";
import { Preloader } from "../../components/PreLoader";
import Head from "next/head";
import { Button } from "../../components/forms/Button";
import { Service, ServiceOpCode } from "wrapper/lib/types/service";
import { ServiceBox } from "../../components/Services/ServiceBox";
import { Project } from "wrapper";
import { ServiceStatus } from "../../components/Services/ServiceStatus";
import moment from "moment";

interface ViewServicePageProps { }

export const ViewServicePage: PageComponent<ViewServicePageProps> =
  ({ }) => {
    const { query, push, reload } = useRouter();
    console.log(query);
    const wrapper = useWrapper();
    const serviceId = query.id as string;

    const [serviceData, setServiceData] = useState<Service | null>(
      null
    );
    const [projectData, setProjectData] = useState<Project>();
    const [isLoading, setLoading] = useState(true);
    const [command, setCommand] = useState<ServiceOpCode>("start");

    useEffect(() => {
      if (serviceId) {
        wrapper.api.services
          .fetch(serviceId)
          .then((data) => {
            setServiceData(data);
            setLoading(false);
            wrapper.api.projects.fetch(data.projectId).then(setProjectData);
          })
          .catch((_err) => {
            setLoading(false);
          });
        if (!serviceId) push("/");
      }
    }, [push, serviceId, wrapper.api.projects, wrapper.api.services]);

    if (!serviceData && !isLoading) return <h2>Failed to retrieve Service...</h2>;
    return (
      <>
        <Head>
          {serviceData ? (
            <title>Duxcore | {serviceData?.name}</title>
          ) : (
            ""
          )}
        </Head>
        <Preloader active={isLoading}>
          <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-row-reverse w-full">
              <div className="flex flex-row-reverse w-full gap-4">
                <Button className="w-fit p-4" onClick={() => {
                  if (!serviceData) return;
                  wrapper.api.services.ctl(serviceData.id, command).then(reload);
                }}>Send command</Button>
                <select className="h-fit" value={command} onChange={(e) => setCommand(e.target.value as ServiceOpCode)}>
                  <option value="start">Start</option>
                  <option value="stop">Stop</option>
                  <option value="restart">Restart</option>
                  <option value="kill">Kill</option>
                </select>
              </div>
              <div className="w-full">
                <h1 className="pl-1 text-3xl border-l border-gray-700">
                  {serviceData?.name}
                </h1>
                <p
                  className="text-gray-600"
                >
                  {serviceData?.id}
                </p>
              </div>

            </div>
            <div className="flex flex-col gap-4 p-4 w-full">
              <p>Name: {serviceData?.name}</p>
              <p>ID: {serviceData?.id}</p>
              <p>Created: {moment(serviceData?.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</p>
              <p>Updated: {moment(serviceData?.updatedAt).format('MMMM Do YYYY, h:mm:ss a')}</p>
              <p className="inline-flex items-center"><p className="pr-0.25">Status: </p><ServiceStatus status={serviceData ? serviceData.status : "UNKNOWN"} /> {serviceData?.status}</p>
              <p>Project Details: {projectData?.name} ({projectData?.id})</p>
              <p>DaemonId: {serviceData?.daemonId}</p>
              <p>CPU: {serviceData?.cpu}</p>
              <p>Mem: {serviceData?.mem}</p>
              <p>Disk: {serviceData?.disk}</p>
              <p>Params: {serviceData ? JSON.stringify(serviceData.params) : ""}</p>
            </div>
          </div>


        </Preloader>
      </>
    );
  };

ViewServicePage.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};
