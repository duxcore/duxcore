import { API_BASEURL } from "../../util/constants";
import axiosInstance from "../axiosInstance";
import type { AxiosError } from "axios";
import { invalidApiResponseStack } from "../../util/invalidApiResponseStack";
import { NewService, Service, ServiceOpCode } from "../../types/service";

export const createServiceController = () => {
  return {
    create(request: NewService): Promise<Service> {
      return new Promise(async (resolve, reject) => {
        await axiosInstance.post(`${API_BASEURL}/services`, request)
          .then(res => {
            let data = res.data.data;

            return resolve({
              id: data.id,
              name: data.name,
              projectId: data.project,
              daemonId: data.daemon,
              params: data.params,
              cpu: data.cpu,
              mem: data.memory,
              disk: data.disk,
              status: data.status,
              createdAt: new Date(data.createdAt),
              updatedAt: new Date(data.updatedAt),
            });
          }).catch((err: AxiosError) => {
            let timestamp = err.response?.data.meta.timestamp;

            if (!timestamp) return reject([invalidApiResponseStack]);
            return reject(err.response?.data);
          })
      });
    },

    ctl(id: string, opCode: ServiceOpCode): Promise<void> {
      return new Promise(async (resolve, reject) => {
        await axiosInstance.post(`${API_BASEURL}/services/${id}/ctl`, { opCode })
          .then(res => {
            return resolve();
          }).catch((err: AxiosError) => {
            let timestamp = err.response?.data.meta.timestamp;

            if (!timestamp) return reject([invalidApiResponseStack]);
            return reject(err.response?.data);
          })
      });
    }
  }
}
