import { User } from "../auth/AuthProvider";

export const createUserObject = (meObject: User['data']['user']) => {
  return {
    ...meObject,
  }
}