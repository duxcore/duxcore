import { manifestation } from '@duxcore/manifestation';
import { ApiError } from './apiError';

export function sendApiErrors(res, ...errors: ApiError[]): void {
  return manifestation.sendApiResponse(res, {
    status: 400,
    message: "Error(s) have occured",
    data: {
      errors
    },
    successful: false
  })
}