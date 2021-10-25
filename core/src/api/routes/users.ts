import { ApiRoute, manifestation } from "@duxcore/manifestation";
import Password from "../../classes/Password";
import { users } from "../../lib/users";
import jwt from 'jsonwebtoken';
import { authenticationToken } from "../../lib/authenticationToken";

const missingValue = (valueName) => {
  return manifestation.newApiResponse({
    status: 400,
    message: `Missing value '${valueName}'`,
    data: {
      error: `MISSING_FORM_VALUE`
    },
    successful: false
  });
}

export const apiUsers: ApiRoute[] = [
  manifestation.newRoute({
    route: "/users",
    method: "post",
    executor: async (req, res) => {

      if (!req.body.password) return manifestation.sendApiResponse(res, missingValue("password"));
      if (!req.body.email) return manifestation.sendApiResponse(res, missingValue("email"));

      if (!req.body.name || !req.body.name.firstName) return manifestation.sendApiResponse(res, missingValue("name.firstName"));
      if (!req.body.name || !req.body.name.lastName) return manifestation.sendApiResponse(res, missingValue("name.lastName"));

      if (await users.emailExists(req.body.email)) return manifestation.sendApiResponse(res, {
        status: 400,
        message: "An error has occured",
        successful: false,
        data: {
          error: "User Already Exists!"
        }
      });

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
      const email = req.body.email;
      const password = req.body.password;
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

      if (!req.body.email) manifestation.sendApiResponse(res, missingValue("email"));
      if (!req.body.email) manifestation.sendApiResponse(res, missingValue("password"));

      users.login(email, password, ip as string).then((after) => {
        const response = manifestation.newApiResponse({
          status: after.passwordValid == true ? 200 : 400,
          message: after.passwordValid ? "Authentication Successful." : "Authentication Failed.",
          data: after,
          successful: after.passwordValid
        });

        manifestation.sendApiResponse(res, response)
      })
    }
  }),
  manifestation.newRoute({
    route: "/users/@me",
    method: "get",
    executor: async (req, res) => {
      const authorizationToken = req.headers['authorization'];

      if (!authorizationToken) return manifestation.sendApiResponse(res, manifestation.newApiResponse({
        status: 400,
        message: "Missing authorization token...",
        data: {
          error: "MISSING_AUTH_TOKEN"
        },
        successful: false
      }));

      authenticationToken.validateToken(authorizationToken).then(async (value: any) => {
        return manifestation.sendApiResponse(res, manifestation.newApiResponse({
          status: 200,
          message: "Successfully fetched user profile.",
          data: await (async () => {
            value.iat = undefined;
            const user = await users.fetch(value.id);

            return {
              raw: value,
              user: user?.toJson()
            }
          })(),
          successful: true
        }))
      }).catch((err: jwt.JsonWebTokenError) => {
        return manifestation.sendApiResponse(res, manifestation.newApiResponse({
          status: 401,
          message: err.message,
          successful: false
        }));
      })
    }
  })
]