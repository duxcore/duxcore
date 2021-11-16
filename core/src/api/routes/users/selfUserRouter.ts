import { manifestation } from "@duxcore/manifestation";
import { apiError, errorConstructor } from "../../../helpers/apiError";
import { fetchTokenData } from "../../../helpers/fetchTokenData";
import { users } from "../../../lib/users";
import { authorizeRequest } from "../../middleware/authorizeRequest";
import validator from "email-validator";
import { sendApiErrors } from "../../../helpers/sendApiErrors";
import UserManager from "../../../classes/UserManager";


export const selfUserRouter = manifestation.newRouter({
  route: "/@me",
  middleware: [authorizeRequest],
  routes: [
    manifestation.newRoute({
      route: "/",
      method: "get",
      middleware: [],
      executor: async (req, res) => {
        let tokenData = fetchTokenData(res.locals)

        return manifestation.sendApiResponse(res, manifestation.newApiResponse({
          status: 200,
          message: "Successfully fetched user profile.",
          data: await (async () => {
            (tokenData as any).iat = undefined;
            const user = await users.fetch(tokenData.userId);

            return {
              raw: tokenData,
              user: user?.toJson()
            }
          })(),
          successful: true
        }))
      }
    }),
    manifestation.newRoute({
      route: "/",
      method: "post",
      middleware: [],
      async executor(req, res) {
        let tokenData = fetchTokenData(res.locals);
        let errorStack = apiError.createErrorStack();
        let modifiers = [
          "email",
          "password"
        ];

        const requestedModifiers = Object.keys(req.body)
        requestedModifiers.map(m => {
          if (!modifiers.includes(m))
            return errorStack.append(errorConstructor.invalidUserModifier(m));
        });

        if (requestedModifiers.length == 0) errorStack.append("missingUserModifiers");

        const processedModifiers = await Promise.all(requestedModifiers.map(async modifier => {
          if (errorStack.stack.length > 0) return false;
          if (modifier == "email") {
            let newEmail = req.body['email'];

            if (!validator.validate(newEmail)) return errorStack.append(errorConstructor.invalidEmail(newEmail));

            return await users.generateEmailResetToken(tokenData['userId'], newEmail)
              .then(() => true)
              .catch(err => {
                let msg = err.message;

                if (msg === "INVALID_USER_ID") return errorStack.append({
                  code: "INVALID_USER_ID",
                  message: "The user ID used to change user email is invalid!"
                });

                if (msg === "EMAIL_EXISTS") return errorStack.append("userEmailExists");
              });
          }
        }));

        if (errorStack.stack.length > 0) return sendApiErrors(res, ...errorStack.stack);

        return manifestation.sendApiResponse(res, manifestation.newApiResponse({
          status: 200,
          message: "Modifiers executed successfully!",
          successful: true
        }))
      }
    }),
    manifestation.newRoute({
      route: '/updatePassword',
      method: "post",
      middleware: [],
      executor: async (req, res) => {
        let errors = apiError.createErrorStack();
        let tokenData = fetchTokenData(res.locals);

        let user = ((await users.fetch(tokenData.userId)) ?? errors.append("unknownUser")) as UserManager;
        let oldPassword = req.body['oldPassword'] ?? errors.append(errorConstructor.missingValue("oldPassword"));
        let newPassword = req.body['newPassword'] ?? errors.append(errorConstructor.missingValue("newPassword"));

        if (!user.validatePassowrd(oldPassword)) errors.append("invalidPassword");

        if (errors.stack.length === 0) {
          await user.updatePassword(newPassword).catch(e => {
            return errors.append({
              code: "UPDATE_PASSWORD_FAILURE",
              message: "Failed to update your password"
            });
          });
        }

        if (errors.stack.length > 0) return sendApiErrors(res, ...errors.stack);

        return manifestation.sendApiResponse(res, {
          status: 200,
          message: "Successfully updated user password",
          successful: true
        })
      }
    }),
    manifestation.newRoute({
      route: "/revokeAllRefreshTokens",
      method: 'delete',
      middleware: [],
      executor: async (req, res) => {
        let tokenData = fetchTokenData(res.locals);

        const user = await users.fetch(tokenData.userId);

        if (!user) return manifestation.sendApiResponse(res, manifestation.newApiResponse({
          status: 404,
          message: "Unknown user...",
          data: {
            errors: apiError.createErrorStack("unknownUser")
          },
          successful: false
        }));

        await user.revokeAllRefreshTokens();

        return manifestation.sendApiResponse(res, manifestation.newApiResponse({
          status: 200,
          message: `Successfully deleted all refresh tokens associated with user ID '${user.id}'`,
          data: {
            userId: user.id
          },
          successful: true
        }))
      }
    })
  ],
})