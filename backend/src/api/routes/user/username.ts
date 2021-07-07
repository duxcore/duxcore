import { newApiResponse } from "../../../helpers/newApiResponse";
import { sendApiResponse } from "../../../helpers/sendApiResponse";
import reserveUsername from "../../../lib/reserveUsername";
import { testUsername, UsernameStatus } from "../../../lib/testUsername";
import { ApiRoute } from "../../../types/api";
import { prisma } from "../../../util/prisma/instance";

export const username: ApiRoute[] = [
  {
    route: "/users/username/:username",
    method: "get",
    middleware: [],
    executor: (req, res) => {
      const username = req.params.username;
      const key = req.query.key as string;

      testUsername(username, key).then((unStatus) => {
        const getMessage = (() => {
          if (unStatus == UsernameStatus.AVAILABLE)
            return "This username is currently available.";
          if (unStatus == UsernameStatus.TAKEN)
            return "This username has been taken.";
          if (unStatus == UsernameStatus.RESERVED)
            return "This username has been reserved.";
          if (unStatus == UsernameStatus.BANNED)
            return "This username has been banned.";
        })();

        const getStatus = (() => {
          if (unStatus == UsernameStatus.AVAILABLE) return "available";
          if (unStatus == UsernameStatus.TAKEN) return "taken";
          if (unStatus == UsernameStatus.RESERVED) return "reserved";
          if (unStatus == UsernameStatus.BANNED) return "banned";
          return "unknown";
        })();

        return sendApiResponse(
          res,
          newApiResponse({
            status: 200,
            message: getMessage,
            data: {
              status: getStatus,
              username,
              timestamp: new Date().getTime(),
            },
            successful: true,
          })
        );
      });
    },
  },
  {
    route: "/users/username/:username",
    method: "put",
    middleware: [],
    executor: (req, res) => {
      const username = req.params.username;

      testUsername(username).then((unStatus) => {
        const reservable = unStatus == UsernameStatus.AVAILABLE;

        if (reservable) {
          reserveUsername(username)
            .then((data) => {
              return sendApiResponse(
                res,
                newApiResponse({
                  status: 200,
                  message: "Successfully reserved Username",
                  data: {
                    username,
                    key: data.key,
                    timestamp: new Date().getTime(),
                  },
                  successful: true,
                })
              );
            })
            .catch((err) => {
              return sendApiResponse(
                res,
                newApiResponse({
                  status: 500,
                  message:
                    "An error occured whilst trying to reserve a username",
                  data: {
                    error: err.message,
                    username,
                    timestamp: new Date().getTime(),
                  },
                  successful: true,
                })
              );
            });
        } else {
          return sendApiResponse(
            res,
            newApiResponse({
              status: 401,
              message: "This username cannot be reserved.",
              data: {
                username,
                timestamp: new Date().getTime(),
              },
              successful: true,
            })
          );
        }
      });
    },
  },
  {
    route: "/users/username/reserved/:key",
    method: "get",
    middleware: [],
    executor: (req, res) => {
      const key = req.params.key;

      prisma.reservedUsername.findFirst({
        where: {
          key
        }
      }).then(reservedUsername => {
        if (!reservedUsername) return sendApiResponse(res, {
          status: 404,
          message: "This is not a valid reserved username key.",
          data: {
            timestamp: new Date().getTime()
          },
          successful: false
        });

        return sendApiResponse(res, {
          status: 200,
          message: "Fetched reserved username.",
          data: {
            index: reservedUsername.id,
            username: reservedUsername.username,
            key,
            timestamp: new Date().getTime()
          },
          successful: true
        });
      });
    },
  },
];
