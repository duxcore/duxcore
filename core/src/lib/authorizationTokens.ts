import { prismaInstance } from "../../prisma/instance";
import fs from 'fs';
import jwt from "jsonwebtoken"

const jwtPrivateKey = fs.readFileSync(`${__dirname}/${__filename.endsWith('.js') ? "../" : ""}../../jwt.key`)
const tokenDuration = (60 * 5);

export interface AuthTokenPayload {
  userId: string;
}

export type ModifedTokenPayload = AuthTokenPayload & { timestamp: number }

export interface TokenPair {
  authToken: string;
  refreshToken: string,
}

export const authorizationToken = {
  async generateTokenPair(payload: AuthTokenPayload): Promise<TokenPair | null> {
    const user = await prismaInstance.user.findFirst({
      where: {
        id: payload.userId
      }
    });

    if (!user) return null;

    const token = await prismaInstance.userRefreshToken.create({
      data: {
        userId: user.id
      }
    });

    return {
      authToken: jwt.sign({
        ...payload,
        timestamp: new Date().getTime()
      }, jwtPrivateKey, { expiresIn: tokenDuration }),
      refreshToken: token.token
    }
  },
  validateToken(token: string): AuthTokenPayload & { timestamp: number } | null {
    let valTkn;
    try {
      valTkn = jwt.verify(token, jwtPrivateKey);
    } catch { }
    if (!valTkn) return null;

    return valTkn as ModifedTokenPayload
  },
  async refreshAuthToken(refreshToken) {
    return new Promise(async (resolve, reject) => {
      let refTkn = await prismaInstance.userRefreshToken.findFirst({
        where: {
          token: refreshToken
        }
      });

      if (!refTkn) {
        return reject({
          code: "INVALID_REFRESH_TOKEN",
          message: "Refresh Token Invalid"
        })
      }

      if (refTkn?.revoked) {
        await prismaInstance.userRefreshToken.delete({
          where: {
            id: refTkn.id
          }
        });
        return reject({
          code: "TOKEN_REVOKED",
          message: "This refresh token has been revoked."
        });
      }

      const newRefreshToken = await prismaInstance.userRefreshToken.create({
        data: {
          userId: refTkn.userId
        }
      });

      await prismaInstance.userRefreshToken.delete({
        where: {
          id: refTkn.id
        }
      })

      return resolve({
        authToken: jwt.sign({
          userId: refTkn.userId,
          timestamp: new Date().getTime()
        }, jwtPrivateKey, {
          expiresIn: tokenDuration
        }),
        refreshToken: newRefreshToken.token
      })
    });
  },
}