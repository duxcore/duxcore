import { Collection } from "@duxcore/wrapper";
import React, { useEffect, useState } from "react";
import { useWrapper } from "../../context/WrapperProvider";
import { CollectionBox } from "./CollecitonsBox";

interface CollectionsArrayProps {}

export const CollectionsArray: React.FC<CollectionsArrayProps> = ({
  children,
}) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const wrapper = useWrapper();

  useEffect(() => {
    wrapper.api.serviceCollections.list().then(setCollections);
  }, []);

  return (
    <div
      className="grid gap-1"
      style={{ gridTemplateColumns: "repeat(auto-fill, minmax(20rem, 1fr))" }}
    >
      {collections.map((collection) => (
        <CollectionBox key={collection.id} data={collection} />
      ))}
    </div>
  );
};
