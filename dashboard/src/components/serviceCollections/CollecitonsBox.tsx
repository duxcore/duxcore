import { Collection } from "@duxcore/wrapper";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

interface CollectionBoxProps {
  data: Collection;
}

export const CollectionBox: React.FC<CollectionBoxProps> = ({
  children,
  data,
}) => {
  const { replace, push } = useRouter();

  return (
    <Link href={`/collection/${data.id}`} passHref={true}>
    <a
      className="flex-none p-1 truncate transition border border-gray-700 rounded-5 hover:border-white text-left"
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
