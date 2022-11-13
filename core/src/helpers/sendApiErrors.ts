import { manifestation } from "@duxcore/manifestation";
import { ApiError } from "./apiError";

export function sendApiErrors(res, ...errors: ApiError[]): void {
  let statusCode = 400;

  let statusOverride = errors.map((v) => {
    if (v.status) return v.status;
  });

  if (statusOverride.length > 0) statusCode = statusOverride.sort()[0] ?? 400;

  return manifestation.sendApiResponse(res, {
    status: statusCode,
    message: "Error(s) have occured",
    data: {
      errors,
    },
    successful: false,
  });
}
