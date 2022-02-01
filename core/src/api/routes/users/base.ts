import { apiError, errorConstructor } from "../../../helpers/apiError";
import { manifestation } from "@duxcore/manifestation";
import Password from "../../../classes/Password";
import { users } from "../../../lib/users";
import validator from "email-validator";
import { sendApiErrors } from "../../../helpers/sendApiErrors";

export const apiUserBaseRoutes = [
  manifestation.newRoute({
    route: "/",
    method: "post",
    executor: async (req, res) => {
      let errors = apiError.createErrorStack();
      let responseData;

      if (!req.body.password) errors.append(errorConstructor.missingValue("password"))
      if (!req.body.email) errors.append(errorConstructor.missingValue("email"));
      if (!validator.validate(req.body.email)) errors.append(errorConstructor.invalidEmail(req.body.email))

      if (!req.body.name || !req.body.name.firstName) errors.append(errorConstructor.missingValue("name.firstName"));
      if (!req.body.name || !req.body.name.lastName) errors.append(errorConstructor.missingValue("name.lastName"));

      if (!!req.body.email && await users.emailExists(req.body.email)) errors.append("userEmailExists");

      if (errors.stack.length === 0) await users.create({
        email: req.body.email,
        password: Password.hash(req.body.password),
        firstName: req.body.name.firstName,
        lastName: req.body.name.lastName,
        role: "USER"
      }).then((newUser) => {
        responseData = newUser.toJson()
      }).catch((e) => {
        errors.append({
          code: "INTERNAL_SERVER_ERROR",
          message: e.message
        })
      });

      if (errors.stack.length > 0) return sendApiErrors(res, ...errors.stack);

      return manifestation.sendApiResponse(res, {
        status: 200,
        message: "User registration successful!",
        data: responseData,
        successful: true
      })
    }
  }),
  manifestation.newRoute({
    route: "/auth",
    method: "post",
    executor: async (req, res) => {
      let errors = apiError.createErrorStack();

      const email = req.body.email;
      const password = req.body.password;
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

      if (!req.body.email) errors.append(errorConstructor.missingValue("email"));
      if (!req.body.email) errors.append(errorConstructor.missingValue("password"));

      if (!(await users.emailExists(email))) errors.append("unknownUser");

      if (errors.stack.length === 0) await users.login(email, password, ip as string).then((after) => {
        if (!after.passwordValid) return errors.append("invalidPassword");

        const response = manifestation.newApiResponse({
          status: after.passwordValid == true ? 200 : 400,
          message: after.passwordValid ? "Authentication Successful." : "Authentication Failed.",
          data: {
            ...after
          },
          successful: after.passwordValid
        });

        manifestation.sendApiResponse(res, response)
      });

      if (errors.stack.length > 0) return sendApiErrors(res, ...errors.stack);

    }
  })
]