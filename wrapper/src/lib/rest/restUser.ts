import axios from "axios";
import {
  ReservedUsernameAPIResponse,
  UsernameAPIResponse,
} from "../../types/restUser";
import { apiUrl } from "../../util/constraints";

export const restUser = {
  async getUsername(
    username: string,
    token?: string
  ): Promise<UsernameAPIResponse> {
    return await axios
      .get(
        `${apiUrl.v1}/users/username/${username}${token ? `?key=${token}` : ""}`
      )
      .then((res) => {
        const data = res.data;
        return data;
      })
      .catch((err) => err.response?.data);
  },
  async getReservedUsername(key: string): Promise<ReservedUsernameAPIResponse> {
    return await axios
      .get(`${apiUrl.v1}/users/username/reserved/${key}`)
      .then((res) => {
        const data = res.data;
        return data;
      })
      .catch((err) => err.response?.data);
  },
  async register(
    username: string,
    name: string,
    email: string,
    password: string,
    captchaToken: string,
    unKey?: string
  ) {
    return await axios
      .post(
        `${apiUrl.v1}/users/`,
        {
          username,
          name,
          email,
          password,
          unKey,
        },
        { headers: { CaptchaToken: captchaToken } }
      )
      .then((res) => res.data)
      .catch((err) => err.response?.data);
  },
};
