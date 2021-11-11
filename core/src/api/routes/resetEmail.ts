import { manifestation } from "@duxcore/manifestation";
import { apiError, errorConstructor } from "../../helpers/apiError";
import { fetchTokenData } from "../../helpers/fetchTokenData";
import { users } from "../../lib/users";
import { authorizeRequest } from "../middleware/authorizeRequest";

export const resetEmail = manifestation.newRoute({
  route: "/resetEmail",
  method: "post",
  middleware: [authorizeRequest],
  executor: async (req, res) => {
    let tokenData = fetchTokenData(res.locals);

    let token = req.body['token'];
    let email = req.body['email'];

    let errors = apiError.createErrorStack();

    if (!token) errors.append(errorConstructor.missingValue("token"));
    if (!email) errors.append(errorConstructor.missingValue("email"));

    if (errors.stack.length == 0) await users.validateEmailResetToken(token, email).catch(async err => {
      errors.append(...err);
      return;
    });

    if (errors.stack.length > 0) return manifestation.sendApiResponse(res, manifestation.newApiResponse({
      status: 400,
      message: "Error(s) have occured!",
      data: {
        errors: errors.stack
      },
      successful: false
    }));

    return manifestation.sendApiResponse(res, manifestation.newApiResponse({
      status: 200,
      message: "Successfully updated user email address!",
      successful: true
    }))
  }
})