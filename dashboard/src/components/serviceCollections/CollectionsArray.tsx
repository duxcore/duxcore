import { Collection } from "@duxcore/wrapper"
import { useEffect, useState } from "react"
import { useWrapper } from "../../context/WrapperProvider"
import { CollectionBox } from "./CollecitonsBox"

interface CollectionsArrayProps { }

export const CollectionsArray: React.FC<CollectionsArrayProps> = ({ children }) => {
  const [collections, setCollections] = useState<Collection[]>([])
  const wrapper = useWrapper()

  useEffect(() => {
    wrapper.api.serviceCollections.list().then(setCollections);
  }, []);



  return (
    <div className="flex flex-wrap gap-1">
      {collections.map(collection => <CollectionBox key={collection.id} data={collection} />)}
    </div>
  )

}