import { NewUser, User } from "../../types/user";
import { API_BASEURL } from "../../util/constants";
import axiosInstance, { setAxiosHeader } from "../axiosInstance";
import type { AxiosError } from "axios";
import { invalidApiResponseStack } from "../../util/invalidApiResponseStack";
import { useTokenStore } from "../useTokenStore";

export const createUserController = () => {
  return {
    me: (): Promise<User> => {
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
    },

    create: (user: NewUser): Promise<void> => {
      return new Promise(async (resolve, reject) => {
        await axiosInstance.post(`${API_BASEURL}/users`, user)
          .then(() => {
            return resolve();
          }).catch((err: AxiosError) => {
            let timestamp = err.response?.data.meta.timestamp;

            if (!timestamp) return reject([invalidApiResponseStack]);
            return reject(err.response?.data.errors);
          })
      });
    },

    login: (email: string, password: string): Promise<void> => {
      return new Promise(async (resolve, reject) => {
        await axiosInstance.post(`${API_BASEURL}/users/auth`, {
          email,
          password
        }).then((res) => {
          useTokenStore.getState().setTokens({ ...res.data.authorization });
          setAxiosHeader(res.data.authorization.authToken);

          return resolve();
        }).catch((err: AxiosError) => {
          let timestamp = err.response?.data.meta.timestamp;

          if (!timestamp) return reject([invalidApiResponseStack]);
          return reject(err.response?.data.errors);
        })
      });
    },

    revokeAllTokens: (): Promise<void> => {
      return new Promise(async (resolve, reject) => {
        await axiosInstance.delete(`${API_BASEURL}/users/@me/revokeAllRefreshTokens`)
          .then(() => {
            useTokenStore.getState().setTokens({
              authToken: "",
              refreshToken: ""
            });
            setAxiosHeader("");

            return resolve();
          }).catch((err: AxiosError) => {
            let timestamp = err.response?.data.meta.timestamp;

            if (!timestamp) return reject([invalidApiResponseStack]);
            return reject(err.response?.data.errors);
          })
      });
    }
  }
}