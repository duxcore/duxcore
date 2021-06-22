import axios from "axios";
import { UsernameAPIResponse } from "../../types/restUser";
import { apiUrl } from "../../util/constraints";

export const restUser = {
  async getUsername(username: string): Promise<UsernameAPIResponse> {
    return await axios.get(`${apiUrl.v1}/user/username/${username}`)
    .then(res => res.data)
    .catch(err => err.response?.data);
  }
}