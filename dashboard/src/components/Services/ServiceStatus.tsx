import { ServiceStatus as Status } from "wrapper/lib/types/service";
import { GoPrimitiveDot } from "react-icons/go";
import { IoBuild, IoDownload, IoWarning } from "react-icons/io5";
type ServiceStatusProps = {
    status: Status
};

export const ServiceStatus = ({ status }: ServiceStatusProps) => {
    switch (status) {
        case "ONLINE":
            return <GoPrimitiveDot title={`Service is ${status}`} className="text-green-500" />;
        case "OFFLINE":
            return <GoPrimitiveDot title={`Service is ${status}`} className="text-gray-500" />;
        case "SETTING_UP":
            return <IoWarning title={`Service is ${status}`} className="text-blue-500" />;
        case "BUILDING":
            return <IoBuild title={`Service is ${status}`} className="text-green-500" />;
        case "INSTALLING":
            return <IoDownload title={`Service is ${status}`} className="text-green-500" />;
        default:
            return <IoWarning title={`Service is ${status}`} className="text-yellow-500" />;
    }
};
