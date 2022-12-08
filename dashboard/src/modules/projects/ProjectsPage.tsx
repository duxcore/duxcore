import React from "react";
import { Header } from "../../components/layout/Header";
import { Layout, useLayout } from "../../components/Layout";
import { ProjectsArray } from "../../components/Projects/ProjectsArray";
import { PageComponent } from "../../types/PageComponent";
import { useAuth } from "../auth/useAuth";
import Head from "next/head";
import { Button } from "../../components/forms/Button";
import { useRouter } from "next/router";

interface ProjectsPageProps { }

export const ProjectsPage: PageComponent<ProjectsPageProps> = () => {
    const { push } = useRouter();

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-row-reverse w-full">
                <Button className="w-fit p-4" onClick={() => push('/projects/create')}>Create Project</Button>
            </div>
            <ProjectsArray />
        </div>
    );
};

ProjectsPage.requiresAuth = true;

ProjectsPage.getLayout = (page) => {
    return <Layout>{page}</Layout>;
};
