import { useRouter } from "next/router";
import React from "react";
import { BiErrorCircle } from "react-icons/bi";
import { ContentBox } from "../../components/ContentBox";
import { useNextRedirection } from "../../hooks/useNextRedirection";
import { PageComponent } from "../../types/PageComponent";
import { ResetEmailForm } from "./ResetEmailForm";

interface ResetEmailPageProps { }

export const ResetEmailPage: PageComponent<ResetEmailPageProps> = () => {
  const { query } = useRouter()
  const execRedirection = useNextRedirection();

  const onSubmit = () => {
    return execRedirection();
  };

  if (!query.token || !query.email) return (
    <ContentBox
      centered
      heading={{
        title: "Invalid Email Reset URL",
        subtitle: "The requested url is no longer valid to use"
      }}
      className="flex justify-center align-middle max-w-x-lg"
    />
  )

  return <ResetEmailForm onSubmit={onSubmit} />;
};