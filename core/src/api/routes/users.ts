import { ApiRoute, manifestation } from "@duxcore/manifestation";
import { apiError, errorConstructor } from "../../helpers/apiError";
import Password from "../../classes/Password";
import validator from "email-validator";
import { users } from "../../lib/users";
import jwt from 'jsonwebtoken';
import { authorizationToken } from "../../lib/authorizationTokens";
import { authorizeRequest } from "../middleware/authorizeRequest";
import { fetchTokenData } from "../../helpers/fetchTokenData";

export const apiUsers: ApiRoute[] = [
  manifestation.newRoute({
    route: "/users",
    method: "post",
    executor: async (req, res) => {
      let errors = apiError.createErrorStack();

      if (!req.body.password) errors.append(errorConstructor.missingValue("password"))
      if (!req.body.email) errors.append(errorConstructor.missingValue("email"));
      if (!validator.validate(req.body.email)) errors.append(errorConstructor.invalidEmail(req.body.email))

      if (!req.body.name || !req.body.name.firstName) errors.append(errorConstructor.missingValue("name.firstName"));
      if (!req.body.name || !req.body.name.lastName) errors.append(errorConstructor.missingValue("name.lastName"));

      if (!!req.body.email && await users.emailExists(req.body.email)) return manifestation.sendApiResponse(res, manifestation.newApiResponse({
        status: 400,
        message: "An error has occured",
        successful: false,
        data: {
          stack: apiError.createErrorStack("userEmailExists").stack
        }
      }));

      if (errors.stack.length > 0) return manifestation.sendApiResponse(res, manifestation.newApiResponse({
        status: 400,
        message: "Error(s) have occured...",
        successful: false,
        data: {
          errors: errors.stack
        }
      }))

      users.create({
        email: req.body.email,
        password: Password.hash(req.body.password),
        firstName: req.body.name.firstName,
        lastName: req.body.name.lastName,
        role: "USER"
      }).then(() => {
        manifestation.sendApiResponse(res, manifestation.newApiResponse({
          status: 201,
          message: "User has been registered.",
          successful: true
        }))
      }).catch((e) => {
        manifestation.sendApiResponse(res, manifestation.newApiResponse({
          status: 500,
          message: "An internal error has occured.",
          data: {
            error: e.message
          },
          successful: false
        }))
      })
    }
  }),
  manifestation.newRoute({
    route: "/users/auth",
    method: "post",
    executor: async (req, res) => {
      let errors = apiError.createErrorStack();

      const email = req.body.email;
      const password = req.body.password;
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

      if (!req.body.email) errors.append(errorConstructor.missingValue("email"));
      if (!req.body.email) errors.append(errorConstructor.missingValue("password"));

      if (!(await users.emailExists(email))) return manifestation.sendApiResponse(res, manifestation.newApiResponse({
        status: 404,
        message: "An error has occured",
        data: {
          errors: apiError.createErrorStack("unknwonUser").stack
        },
        successful: false
      }));

      if (errors.stack.length > 0) return manifestation.sendApiResponse(res, manifestation.newApiResponse({
        status: 400,
        message: "Error(s) have occured",
        data: {
          errors: errors.stack
        }
      }));

      users.login(email, password, ip as string).then((after) => {
        const response = manifestation.newApiResponse({
          status: after.passwordValid == true ? 200 : 400,
          message: after.passwordValid ? "Authentication Successful." : "Authentication Failed.",
          data: {
            errors: !after.passwordValid ? apiError.createErrorStack("invalidPassword").stack : undefined,
            ...after
          },
          successful: after.passwordValid
        });

        manifestation.sendApiResponse(res, response)
      })
    }
  }),
  manifestation.newRoute({
    route: "/users/@me",
    method: "get",
    middleware: [authorizeRequest],
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
    route: "/users/@me/revokeAllRefreshTokens",
    method: 'delete',
    middleware: [authorizeRequest],
    executor: async (req, res) => {
      let tokenData = fetchTokenData(res.locals);

      const user = await users.fetch(tokenData.userId);

      if (!user) return manifestation.sendApiResponse(res, manifestation.newApiResponse({
        status: 404,
        message: "Unknown user...",
        data: {
          errors: apiError.createErrorStack("unknwonUser")
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
]