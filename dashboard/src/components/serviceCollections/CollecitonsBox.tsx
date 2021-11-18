import { Collection } from "@duxcore/wrapper";
import { useRouter } from "next/router";

interface CollectionBoxProps {
  data: Collection;
}

export const CollectionBox: React.FC<CollectionBoxProps> = ({ children, data }) => {
  const { replace, push } = useRouter()

  return (
    <div className="flex-none p-1 truncate transition border border-gray-700 cursor-pointer rounded-5 hover:border-white" onClick={
      (e) => {
        return push(`/collection/${data.id}`)
      }
    } style={{
      width: "32%"
    }}>
      <p>{data.name}</p>
      <p className="text-gray-600" style={{
        fontSize: "8px"
      }}>{data.id}</p>
    </div>
  );
}