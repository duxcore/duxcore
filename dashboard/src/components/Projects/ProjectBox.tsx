import { Project } from "wrapper";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

interface ProjectBoxProps {
  data: Project;
}

export const ProjectBox: React.FC<ProjectBoxProps> = ({
  children,
  data,
}) => {
  const { replace, push } = useRouter();

  return (
    <Link href={`/project/${data.id}`} passHref={true}>
    <a
      className="flex-none p-1 text-left truncate transition border border-gray-700 rounded-5 hover:border-white"
    >
      <h4>{data.name}</h4>
      <p
        className="text-gray-600"
        style={{
          fontSize: "8px",
        }}
      >
        {data.id}
      </p>
    </a>
    </Link>
  );
};
