import { ServerMonitor, NewServerMonitor } from '../../types/serverMonitors'
import { API_BASEURL } from "../../util/constants"
import axiosInstance from "../axiosInstance"
import type { AxiosError } from "axios"
import { invalidApiResponseStack } from "../../util/invalidApiResponseStack"

export const createServerMonitorController = () => {
  return {
    create(serverMonitor: NewServerMonitor): Promise<void> {
      return new Promise(async (resolve, reject) => {
        await axiosInstance.post(`${API_BASEURL}/monitors/servers`, serverMonitor)
          .then(() => {
            return resolve();
          }).catch((err: AxiosError) => {
            let timestamp = err.response?.data.meta.timestamp;

            if (!timestamp) return reject([invalidApiResponseStack]);
            return reject(err.response);
          })
      });
    },

    list(): Promise<ServerMonitor[]> {
      return new Promise(async (resolve, reject) => {
        await axiosInstance.get(`${API_BASEURL}/monitors/servers`)
          .then((res) => {
            return resolve(res.data.data)
          }).catch((err: AxiosError) => {
            let timestamp = err.response?.data.meta.timestamp

            if (!timestamp) return reject([invalidApiResponseStack])
            return reject(err.response)
          })
      })
    }
  }
}
