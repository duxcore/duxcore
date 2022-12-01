import { apiError, errorConstructor } from "../../../modules/apiError";
import { manifestation } from "@duxcore/manifestation";
import Password from "../../../classes/Password";
import { users } from "../../../interfaces/users";
import emailValidator from "email-validator";
import { sendApiErrors } from "../../../modules/sendApiErrors";
import { dataValidator } from "../../../modules/dataValidator";
import { z } from "zod";

export const apiUserBaseRoutes = [
  manifestation.newRoute({
    route: "/",
    method: "post",
    executor: async (req, res) => {
      let errors = apiError.createErrorStack();
      let responseData;

      let input = z.object({
        name: z.object({
          firstName: z.string().min(1).max(32),
          lastName: z.string().min(1).max(32),
        }),
        email: z.string().email(),
        password: z.string()
      }).safeParse(req.body);

      if (!input.success)
        return sendApiErrors(res, ...input.error.issues);

      let { name, email, password } = input.data;

      if (await users.emailExists(email)) {
        errors.append("userEmailExists");
        return sendApiErrors(res, ...errors.stack);
      }

      if (errors.stack.length === 0)
        await users
          .create({
            email,
            password: Password.hash(password),
            firstName: name.firstName,
            lastName: name.lastName,
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

      let input = z.object({
        email: z.string().email(),
        password: z.string()
      }).safeParse(req.body);

      if (!input.success)
        return sendApiErrors(res, ...input.error.issues);
      
      let { email, password } = input.data;

      const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

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
