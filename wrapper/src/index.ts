import { API_BASEURL, AUTH_TOKEN_KEY, INTENDED_PATH_KEY, isProd, REFRESH_EXCLUDE_LIST, REFRESH_TOKEN_KEY } from './util/constants';
import axiosInstance, { setAxiosHeader } from './lib/axiosInstance';
import { CreateWrapperOptions } from './types/options';
import { createUserController } from './lib/api/user';
import { useTokenStore } from './lib/useTokenStore';
import { isServer } from './util/isServer';
import { createServiceCollectionsController } from './lib/api/serviceCollections';

export const createWrapper = (options: CreateWrapperOptions) => {
  return {
    api: {
      user: createUserController(),
      serviceCollections: createServiceCollectionsController(),
    },

    axios: {
      instance: axiosInstance,
      setHeader: setAxiosHeader
    },

    useTokenStore,
    isServer,

    constants: {
      API_BASEURL,

      isProd,
      REFRESH_EXCLUDE_LIST,

      AUTH_TOKEN_KEY,
      REFRESH_TOKEN_KEY,
      INTENDED_PATH_KEY
    }
  }
}

export type { TokenPair, NewUser, User, UserEdit } from './types/user'
export type { CreateWrapperOptions } from './types/options'
export type { APIError } from './types/api'
