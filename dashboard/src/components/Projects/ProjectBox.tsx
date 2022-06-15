import { Service } from "wrapper";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

interface ProjectBoxProps {
  data: Service;
}

export const ProjectBox: React.FC<ProjectBoxProps> = ({
  children,
  data,
}) => {
  const { replace, push } = useRouter();

  function typeToString(type: number): string {
    switch (type) {
      case 0: return "Node.js App"
      default: return "Unknown Service"
    }
  }

  return (
    <Link href={`/project/${data.id}`} passHref={true}>
    <a
      className="bg-duxdark-800 flex-none p-2 pb-8 text-left truncate transition border border-duxdark-900 rounded-5 hover:border-white"
    >
      <h4 className="text-xl font-bold"><span style={{color: "lightgreen"}}>•</span> {typeToString(data.type)}</h4>
      <p className="text-gray-600 text-sm">
        &nbsp; &nbsp; {data.id}
      </p>
    </a>
    </Link>
  );
};
