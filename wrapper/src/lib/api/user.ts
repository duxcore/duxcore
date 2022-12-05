import { NewUser, TokenPair, User, UserEdit } from "../../types/user";
import { API_BASEURL } from "../../util/constants";
import axiosInstance, { setAxiosHeader } from "../axiosInstance";
import type { AxiosError } from "axios";
import { invalidApiResponseStack } from "../../util/invalidApiResponseStack";
import { useTokenStore } from "../useTokenStore";

export const createUserController = () => {
  return {
    me(): Promise<User> {
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
            return reject(err.response?.data);
          })
      });
    },

    create(user: NewUser): Promise<void> {
      return new Promise(async (resolve, reject) => {
        await axiosInstance.post(`${API_BASEURL}/users`, user)
          .then(() => {
            return resolve();
          }).catch((err: AxiosError) => {
            let timestamp = err.response?.data.meta.timestamp;

            if (!timestamp) return reject([invalidApiResponseStack]);
            return reject(err.response);
          })
      });
    },

    edit(user: UserEdit): Promise<void> {
      return new Promise(async (resolve, reject) => {
        await axiosInstance.post(`${API_BASEURL}/users/@me`, user)
          .then(() => {
            return resolve();
          }).catch((err: AxiosError) => {
            let timestamp = err.response?.data.meta.timestamp;

            if (!timestamp) return reject([invalidApiResponseStack]);
            return reject(err.response);
          })
      });
    },

    verifyEmailReset(token: string, email: string, password: string): Promise<void> {
      return new Promise(async (resolve, reject) => {
        await axiosInstance.post(`${API_BASEURL}/resetEmail`, {
          token,
          email,
          password
        })
          .then(r => resolve())
          .catch((err: AxiosError) => {
            let timestamp = err.response?.data.meta.timestamp;

            if (!timestamp) return reject([invalidApiResponseStack]);
            return reject(err.response);
          })
      })
    },

    login(email: string, password: string): Promise<TokenPair> {
      return new Promise(async (resolve, reject) => {
        await axiosInstance.post(`${API_BASEURL}/users/auth`, {
          email,
          password
        }).then((res) => {
          useTokenStore.getState().setTokens({ ...res.data.data.authorization });
          setAxiosHeader(res.data.data.authorization.authToken);

          return resolve(res.data.data.authorization);
        }).catch((err: AxiosError) => {
          let timestamp = err.response?.data.meta.timestamp;

          if (!timestamp) return reject([invalidApiResponseStack]);
          return reject(err.response);
        })
      });
    },

    revokeAllTokens(): Promise<void> {
      return new Promise(async (resolve, reject) => {
        await axiosInstance.delete(`${API_BASEURL}/users/@me/revokeAllRefreshTokens`)
          .then(() => {
            return resolve();
          }).catch((err: AxiosError) => {
            let timestamp = err.response?.data.meta.timestamp;

            if (!timestamp) return reject([invalidApiResponseStack]);
            return reject(err.response?.data.errors);
          })
      });
    },

    resetPassword(oldPassword: string, newPassword: string): Promise<void> {
      return new Promise(async (resolve, reject) => {
        await axiosInstance.post(`${API_BASEURL}/users/@me/updatePassword`, {
          oldPassword,
          newPassword
        }).then((res) => {
          if (!res.data.successful) return reject(res.data.errors);

          return resolve();
        }).catch((err: AxiosError) => {
          let timestamp = err.response?.data.meta.timestamp;

          if (!timestamp) return reject([invalidApiResponseStack]);
        })
      });
    }
  }
}
