import React, { useEffect, useRef, useState } from "react";
import { Layout } from "../../components/Layout";
import { PageComponent } from "../../types/PageComponent";
import { Button } from "../../components/forms/Button";
import { useRouter } from "next/router";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { Formik, Form } from "formik";
import { IoCheckmarkCircle, IoPencilOutline } from "react-icons/io5";
import { ContentBox } from "../../components/ContentBox";
import { Input } from "../../components/forms/Input";
import { useWrapper } from "../../context/WrapperProvider";
import createProjectSchema from "./CreateProjectSchema";

interface CreateProjectPageProps { }

export const CreateProjectPage: PageComponent<CreateProjectPageProps> = () => {
    const [schema] = useState(createProjectSchema());
    const { replace, push } = useRouter();
    const wrapper = useWrapper();
    const [formError, setFormError] = useState("");
    const [createSuccess, setCreateSuccess] = useState(false);


    return (
        <ContentBox
            centered
            heading={{
                title: "Create Project",
            }}
            className="min-w-40"
            error={formError}
        >
            <Formik
                initialValues={{
                    name: "",
                }}
                validationSchema={schema.CreateProjectSchema}
                onSubmit={async (formData) => {
                    // Register user
                    try {
                        await wrapper.api.projects.create({
                            name: formData.name
                        });

                        // Successful response
                        setCreateSuccess(true);

                        setTimeout(() => {
                            replace("/projects");
                        }, 500);
                    } catch (error: any) {
                        let errorMessage = "";

                        if (
                            error && error.message
                        ) {
                            errorMessage = error.message;
                        } else {
                            errorMessage = "An error occurred";
                        }

                        setFormError(errorMessage);
                    }
                }}
            >
                {({ errors, touched }) => {
                    return (
                        <Form>
                            <div className="flex flex-col space-y-1.5">
                                <Input
                                    placeholder="Project Name"
                                    error={errors.name}
                                    withIcon={<IoPencilOutline />}
                                    name="name"
                                    type="text"
                                    touched={touched.name}
                                />
                            </div>
                            <div className="mt-2">
                                <Button type="submit">
                                    {createSuccess ? (
                                        <IoCheckmarkCircle size="20" />
                                    ) : (
                                        "Create Project"
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

CreateProjectPage.requiresAuth = true;

CreateProjectPage.getLayout = (page) => {
    return <Layout>{page}</Layout>;
};
