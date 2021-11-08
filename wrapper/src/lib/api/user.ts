import { User } from "../../types/user";
import { API_BASEURL } from "../../util/constants";
import axiosInstance from "../axiosInstance";
import express from "express"
import { AxiosError } from "axios";
import { invalidApiResponseStack } from "../../util/invalidApiResponseStack";

export const createUserController = () => {
  return {
    fetchSelf: (): Promise<User> => {
      return new Promise(async (resolve, reject) => {
        await axiosInstance.get(`${API_BASEURL}/users/@me`)
          .then(res => {
            let data = res.data.data.user;

            return resolve({
              id: data.id,
              email: data.email,
              created: new Date(data.created),
              firstName: data.firstName,
              lastName: data.lastName
            });
          }).catch((err: AxiosError) => {
            let timestamp = err.response?.data.meta.timestamp;

            if (!timestamp) return reject([invalidApiResponseStack]);
            return reject(err.response?.data.errors);
          })
      });
    }
  }
}