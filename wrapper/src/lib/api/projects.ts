import { Project, NewProject } from "../../types/projects";
import { API_BASEURL } from "../../util/constants";
import axiosInstance from "../axiosInstance";
import type { AxiosError } from "axios";
import { invalidApiResponseStack } from "../../util/invalidApiResponseStack";

export const createProjectController = () => {
  return {
    create(project: NewProject): Promise<void> {
      return new Promise(async (resolve, reject) => {
        await axiosInstance
          .post(`${API_BASEURL}/projects`, project)
          .then(() => {
            return resolve();
          })
          .catch((err: AxiosError) => {
            let timestamp = err.response?.data.meta.timestamp;

            if (!timestamp) return reject([invalidApiResponseStack]);
            return reject(err.response);
          });
      });
    },

    list(): Promise<Project[]> {
      return new Promise(async (resolve, reject) => {
        await axiosInstance
          .get(`${API_BASEURL}/projects`)
          .then((res) => {
            return resolve(res.data.data);
          })
          .catch((err: AxiosError) => {
            let timestamp = err.response?.data.meta.timestamp;

            if (!timestamp) return reject([invalidApiResponseStack]);
            return reject(err.response);
          });
      });
    },

    fetch(id: string): Promise<Project> {
      return new Promise(async (resolve, reject) => {
        await axiosInstance
          .get(`${API_BASEURL}/projects/${id}`)
          .then((res) => {
            return resolve(res.data.data);
          })
          .catch((err: AxiosError) => {
            let timestamp = err.response?.data.meta.timestamp;

            if (!timestamp) return reject([invalidApiResponseStack]);
            return reject(err.response);
          });
      });
    },
  };
};
