import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { FaMemory } from "react-icons/fa";
import { HiOutlineChip } from "react-icons/hi";
import { MdOutlineStorage } from "react-icons/md";
import { Service } from "wrapper/lib/types/service";
import { ServiceStatus } from "./ServiceStatus";

interface ServiceBoxProps {
    data: Service;
}

export const ServiceBox: React.FC<ServiceBoxProps> = ({
    children,
    data,
}) => {
    const { replace, push } = useRouter();

    return (
        <Link href={`/services/${data.id}`} passHref={true}>
            <a
                className="flex-none p-1 text-left truncate transition border border-gray-700 rounded-5 hover:border-white"
            >
                <div className="flex flex-row gap-4 w-full">
                    <h4>{data.name}</h4>
                    <div className="flex flex-row-reverse w-full gap-1">
                        <p className="inline-flex text-sm items-center"> <ServiceStatus status={data.status} /></p>
                        <p className="inline-flex text-sm items-center text-gray-300"><FaMemory className="pr-0.25" /> {data.mem} </p>
                        <p className="inline-flex text-sm items-center text-gray-300"><MdOutlineStorage className="pr-0.25" /> {data.disk} </p>
                        <p className="inline-flex text-sm items-center text-gray-300"><HiOutlineChip className="pr-0.25" /> {data.cpu} </p>
                    </div>
                </div>
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
