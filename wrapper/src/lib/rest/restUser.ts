import axios from "axios";
import { UsernameAPIResponse } from "../../types/restUser";
import { apiUrl } from "../../util/constraints";

export const restUser = {
  async getUsername(username: string): Promise<UsernameAPIResponse> {
    return await axios
      .get(`${apiUrl.v1}/user/username/${username}`)
      .then((res) => res.data)
      .catch((err) => err.response?.data);
  },
  async register(
    username: string,
    name: string,
    email: string,
    password: string,
    captchaToken: string
  ) {
    return await axios
      .post(
        `${apiUrl.v1}/user/`,
        {
          username,
          name,
          email,
          password,
        },
        { headers: { CaptchaToken: captchaToken } }
      )
      .then((res) => res.data)
      .catch((err) => err.response?.data);
  },
};
