import React, { useEffect, useRef, useState } from "react";
import { Layout } from "../../components/Layout";
import { PageComponent } from "../../types/PageComponent";
import { Button } from "../../components/forms/Button";
import { useRouter } from "next/router";
import { Formik, Form } from "formik";
import { IoAppsOutline, IoCheckmarkCircle, IoCodeOutline, IoPencilOutline } from "react-icons/io5";
import { HiOutlineChip } from "react-icons/hi";
import { MdOutlineStorage } from "react-icons/md";
import { FaMemory } from "react-icons/fa";
import { ContentBox } from "../../components/ContentBox";
import { Input } from "../../components/forms/Input";
import { useWrapper } from "../../context/WrapperProvider";
import createProjectSchema from "./CreateServiceSchema";
import { Select } from "../../components/forms/Select";
import { Project } from "wrapper";

interface CreateServicePageProps { }

const testParams = JSON.stringify({
    "image": "itzg/minecraft-server:latest",
    "bind_dir": "/data",
    "port_map": {
        "25565/tcp": [
            {
                "HostPort": "25565"
            }
        ]
    }
});

export const CreateServicePage: PageComponent<CreateServicePageProps> = () => {
    const [schema] = useState(createProjectSchema());
    const { back } = useRouter();
    const wrapper = useWrapper();
    const [formError, setFormError] = useState("");
    const [createSuccess, setCreateSuccess] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        wrapper.api.projects.list().then(setProjects);
    }, []);

    return (
        <ContentBox
            centered
            heading={{
                title: "Create Service",
            }}
            className="min-w-40"
            error={formError}
        >
            <Formik
                initialValues={{
                    name: "",
                    projectId: "",
                    daemonId: "",
                    params: testParams,
                    cpu: 1,
                    mem: 1024,
                    disk: 1024,
                }}
                validationSchema={schema.CreateServiceSchema}
                onSubmit={async (formData) => {
                    setLoading(true);
                    // Register user
                    try {
                        await wrapper.api.services.create({ ...formData, params: JSON.parse(formData.params) });

                        // Successful response
                        setCreateSuccess(true);
                        setLoading(false);

                        setTimeout(back, 500);
                    } catch (error: any) {
                        let errorMessage = "";

                        if (
                            error && error.message
                        ) {
                            errorMessage = error.message;
                        } else {
                            errorMessage = "An error occurred";
                        }
                        setLoading(false);
                        setFormError(errorMessage);
                    }
                }}
            >
                {({ errors, touched }) => {
                    return (
                        <Form>
                            <div className="flex flex-col space-y-1.5">
                                <Input
                                    loading={loading}
                                    placeholder="Service Name"
                                    error={errors.name}
                                    withIcon={<IoPencilOutline />}
                                    name="name"
                                    type="text"
                                    touched={touched.name}
                                />

                                <Select
                                    loading={loading}
                                    placeholder="Project"
                                    error={errors.projectId}
                                    withIcon={<IoAppsOutline />}
                                    name="projectId"
                                    type="text"
                                    value={projects.length !== 0 ? projects[0].id : ""}
                                    touched={touched.projectId}>
                                    {projects && projects.map((proj) => <option key={proj.id} value={proj.id}>{proj.name}</option>)}
                                </Select>

                                <Input
                                    loading={loading}
                                    placeholder="Daemon ID"
                                    error={errors.daemonId}
                                    withIcon={<IoAppsOutline />}
                                    name="daemonId"
                                    type="text"
                                    touched={touched.daemonId}
                                />

                                <Input
                                    loading={loading}
                                    placeholder="Params"
                                    error={errors.params}
                                    withIcon={<IoCodeOutline />}
                                    name="params"
                                    type="text"
                                    touched={touched.params}
                                />

                                <Input
                                    loading={loading}
                                    placeholder="CPU"
                                    error={errors.cpu}
                                    withIcon={<HiOutlineChip />}
                                    name="cpu"
                                    type="number"
                                    touched={touched.cpu}
                                />

                                <Input
                                    loading={loading}
                                    placeholder="Mem"
                                    error={errors.mem}
                                    withIcon={<FaMemory />}
                                    name="mem"
                                    type="number"
                                    touched={touched.mem}
                                />

                                <Input
                                    loading={loading}
                                    placeholder="Disk"
                                    error={errors.disk}
                                    withIcon={<MdOutlineStorage />}
                                    name="disk"
                                    type="number"
                                    touched={touched.disk}
                                />
                            </div>
                            <div className="mt-2">
                                <Button loading={loading} type="submit">
                                    {createSuccess ? (
                                        <IoCheckmarkCircle size="20" />
                                    ) : (
                                        "Create Service"
                                    )}
                                </Button>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        </ContentBox>
    );
};

CreateServicePage.requiresAuth = true;

CreateServicePage.getLayout = (page) => {
    return <Layout>{page}</Layout>;
};
