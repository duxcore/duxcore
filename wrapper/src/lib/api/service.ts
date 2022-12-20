import { API_BASEURL } from "../../util/constants";
import axiosInstance from "../axiosInstance";
import type { AxiosError } from "axios";
import { invalidApiResponseStack } from "../../util/invalidApiResponseStack";
import { NewService, Service, ServiceOpCode } from "../../types/service";
import { useTokenStore } from '../useTokenStore'

export const createServiceController = () => {
  return {
    create(request: NewService): Promise<Service> {
      return new Promise(async (resolve, reject) => {
        await axiosInstance.post(`${API_BASEURL}/services`, { ...request, project: request.projectId, daemon: request.daemonId, memory: request.mem })
          .then(res => {
            const data = res.data.data;

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
            const timestamp = err.response?.data.meta.timestamp;

            if (!timestamp) return reject([invalidApiResponseStack]);
            return reject(err.response?.data);
          })
      });
    },

    fetch(id: string): Promise<Service> {
      return new Promise(async (resolve, reject) => {
        await axiosInstance.get(`${API_BASEURL}/services/${id}`)
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

    fetchAllByUser(userId: string): Promise<Service[]> {
      return new Promise(async (resolve, reject) => {
        await axiosInstance.get(`${API_BASEURL}/services`)
          .then(res => {
            const data = res.data.data;

            return resolve(data.map((service: any) => ({
              id: service.id,
              name: service.name,
              projectId: service.project,
              daemonId: service.daemon,
              params: service.params,
              cpu: service.cpu,
              mem: service.memory,
              disk: service.disk,
              status: service.status,
              createdAt: new Date(service.createdAt),
              updatedAt: new Date(service.updatedAt),
            })));
          }).catch((err: AxiosError) => {
            const timestamp = err.response?.data.meta.timestamp;

            if (!timestamp) return reject([invalidApiResponseStack]);
            return reject(err.response?.data);
          })
      });
    },

    fetchAllByProject(projectId: string): Promise<Service[]> {
      return new Promise(async (resolve, reject) => {
        await axiosInstance.get(`${API_BASEURL}/projects/${projectId}/services`)
          .then(res => {
            const data = res.data.data;

            return resolve(data.map((service: any) => ({
              id: service.id,
              name: service.name,
              projectId: service.project,
              daemonId: service.daemon,
              params: service.params,
              cpu: service.cpu,
              mem: service.memory,
              disk: service.disk,
              status: service.status,
              createdAt: new Date(service.createdAt),
              updatedAt: new Date(service.updatedAt),
            })));
          }).catch((err: AxiosError) => {
            const timestamp = err.response?.data.meta.timestamp;

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
            const timestamp = err.response?.data.meta.timestamp;

            if (!timestamp) return reject([invalidApiResponseStack]);
            return reject(err.response?.data);
          })
      });
    },

    console(id: string): WebSocket {
      let { authToken } = useTokenStore();
      // @ts-ignore WebSocket does not have a 3rd parameter officially, but it does work
      return new WebSocket(`ws${API_BASEURL.startsWith('https') ? 's' : ''}://${API_BASEURL.replace(/(https?:\/\/)/, '')}/services/${id}/console`, authToken);
    }
  }
}
