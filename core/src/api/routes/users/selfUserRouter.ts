import { manifestation } from "@duxcore/manifestation";
import { apiError, errorConstructor } from "../../../modules/apiError";
import { fetchTokenData } from "../../../modules/fetchTokenData";
import { users } from "../../../interfaces/users";
import { authorizeRequest } from "../../middleware/authorizeRequest";
import validator from "email-validator";
import { sendApiErrors } from "../../../modules/sendApiErrors";
import UserManager from "../../../classes/UserManager";
import { dataValidator } from "../../../modules/dataValidator";
import { Prisma, User } from "@prisma/client";


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
      method: "patch",
      middleware: [],
      async executor(req, res) {
        let tokenData = fetchTokenData(res.locals);
        let errorStack = apiError.createErrorStack();

        let patchData: Partial<Prisma.UserUpdateInput> = {};

        await dataValidator<{
          email: string;
        }>(req.body, {
          email: {
            validator: async (v) => {
              if (!validator.validate(v)) return errorStack.append(errorConstructor.invalidEmail(v));
              if ((await users.emailExists(v))) return errorStack.append("userEmailExists");
              return true;
            },
            onSuccess(value) {
                patchData.email = value;
            },
          },
        })

        if (errorStack.stack.length > 0) return sendApiErrors(res, ...errorStack.stack);

        users.apiPatch(tokenData.userId, patchData);

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