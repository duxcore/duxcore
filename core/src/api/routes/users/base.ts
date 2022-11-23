import { apiError, errorConstructor } from "../../../modules/apiError";
import { manifestation } from "@duxcore/manifestation";
import Password from "../../../classes/Password";
import { users } from "../../../interfaces/users";
import emailValidator from "email-validator";
import { sendApiErrors } from "../../../helpers/sendApiErrors";
import { dataValidator } from "../../../util/dataValidator";

export const apiUserBaseRoutes = [
  manifestation.newRoute({
    route: "/",
    method: "post",
    executor: async (req, res) => {
      let errors = apiError.createErrorStack();
      let responseData;

      await dataValidator<{
        name: {
          firstName: string;
          lastName: string;
        };
        password: string;
        email: string;
      }>(req.body, {
        name: {
          validators: [
            {
              validator: (v) => !!v.firstName,
              onFail: (mv) =>
                errors.append(errorConstructor.missingValue("name.firstName")),
            },
            {
              validator: (v) => !!v.lastName,
              onFail: (mv) =>
                errors.append(errorConstructor.missingValue("name.lastName")),
            },
          ],
          validator: (v) => typeof v == "object",
          onFail: (reason, value) =>
            errors.append({
              code: "INVALID_NAME_TYPE",
              message:
                "Name must be an instance of an object with a firstName and lastName value.",
            }),
          onMissing: () => errors.append(errorConstructor.missingValue("name")),
        },
        password: {
          onMissing: () =>
            errors.append(errorConstructor.missingValue("password")),
        },
        email: {
          validator: async (v) => {
            if (!emailValidator.validate(v))
              return errorConstructor.invalidEmail(v);
            if (await users.emailExists(req.body.email))
              return "userEmailExists";
            return true;
          },
          onFail: (r) => errors.append(r),
          onMissing: () =>
            errors.append(errorConstructor.missingValue("email")),
        },
      });

      if (errors.stack.length === 0)
        await users
          .create({
            email: req.body.email,
            password: Password.hash(req.body.password),
            firstName: req.body.name.firstName,
            lastName: req.body.name.lastName,
            role: "USER",
          })
          .then((newUser) => {
            responseData = newUser.toJson();
          })
          .catch((e) => {
            errors.append({
              code: "INTERNAL_SERVER_ERROR",
              message: e.message,
            });
          });

      if (errors.stack.length > 0) return sendApiErrors(res, ...errors.stack);

      return manifestation.sendApiResponse(res, {
        status: 200,
        message: "User registration successful!",
        data: responseData,
        successful: true,
      });
    },
  }),
  manifestation.newRoute({
    route: "/auth",
    method: "post",
    executor: async (req, res) => {
      let errors = apiError.createErrorStack();

      const email = req.body.email;
      const password = req.body.password;
      const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

      if (!req.body.email)
        errors.append(errorConstructor.missingValue("email"));
      if (!req.body.email)
        errors.append(errorConstructor.missingValue("password"));

      if (!(await users.emailExists(email))) errors.append("unknownUser");

      if (errors.stack.length === 0)
        await users.login(email, password, ip as string).then((after) => {
          if (!after.passwordValid) return errors.append("invalidPassword");

          const response = manifestation.newApiResponse({
            status: after.passwordValid == true ? 200 : 400,
            message: after.passwordValid
              ? "Authentication Successful."
              : "Authentication Failed.",
            data: {
              ...after,
            },
            successful: after.passwordValid,
          });

          manifestation.sendApiResponse(res, response);
        });

      if (errors.stack.length > 0) return sendApiErrors(res, ...errors.stack);
    },
  }),
];
