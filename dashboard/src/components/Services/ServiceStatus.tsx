import { ServiceStatus as Status } from "wrapper/lib/types/service";
import { GoPrimitiveDot } from "react-icons/go";
import { IoWarning } from "react-icons/io5";
type ServiceStatusProps = {
    status: Status
};

export const ServiceStatus = ({ status }: ServiceStatusProps) => {
    console.log(status);
    return (
        <p className="inline-flex text-sm items-center text-gray-30">
            {status === "ONLINE" && <GoPrimitiveDot />}
            {status === "OFFLINE" && <GoPrimitiveDot />}
            {status === "SETTING_UP" && <IoWarning />}
        </p>
    );
};
