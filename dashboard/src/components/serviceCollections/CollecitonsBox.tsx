import { Collection } from "@duxcore/wrapper";

interface CollectionBoxProps {
  data: Collection;
}

export const CollectionBox: React.FC<CollectionBoxProps> = ({ children, data }) => {

  return (
    <div className="flex-none p-1 truncate transition border border-gray-700 cursor-pointer rounded-5 hover:border-white" style={{
      width: "32%"
    }}>
      <p>{data.name}</p>
      <p className="text-gray-600" style={{
        fontSize: "8px"
      }}>{data.id}</p>
    </div>
  );
}