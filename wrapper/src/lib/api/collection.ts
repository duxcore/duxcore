import { Collection, NewCollection } from "../../types/collection";
import { API_BASEURL } from "../../util/constants";
import axiosInstance from "../axiosInstance";
import type { AxiosError } from "axios";
import { invalidApiResponseStack } from "../../util/invalidApiResponseStack";

export const createCollectionController = () => {
  return {
    create(collection: NewCollection): Promise<void> {
      return new Promise(async (resolve, reject) => {
        await axiosInstance.post(`${API_BASEURL}/services/collections`, collection)
          .then(() => {
            return resolve();
          }).catch((err: AxiosError) => {
            let timestamp = err.response?.data.meta.timestamp;

            if (!timestamp) return reject([invalidApiResponseStack]);
            return reject(err.response);
          })
      });
    },

    list(): Promise<Collection[]> {
      return new Promise(async (resolve, reject) => {
        await axiosInstance.get(`${API_BASEURL}/services/collections`)
          .then((res) => {
            return resolve(res.data);
          }).catch((err: AxiosError) => {
            let timestamp = err.response?.data.meta.timestamp;

            if (!timestamp) return reject([invalidApiResponseStack]);
            return reject(err.response);
          })
      });
    }
  }
}
