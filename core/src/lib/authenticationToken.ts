import jwt from "jsonwebtoken";
import fs from "fs";
import { prismaInstance } from "../../prisma/instance";

const jwtPrivateKey = fs.readFileSync(`${__dirname}/${__filename.endsWith('.js') ? "../" : ""}../../jwt.key`)

export const authenticationToken = {
  async validateToken(token: string) {
    return new Promise((res, rej) => {
      const validation = jwt.verify(token, jwtPrivateKey, async (err, decoded) => {
        if (err) return rej(err);
        if (!decoded) return rej({ message: "JWT No Value..." })

        const token = await prismaInstance.userAuthToken.findFirst({ where: { token: decoded.token } })

        if (!token) return rej({ message: "Invalid authorization token..." });
        if (token.revoked) {
          await prismaInstance.userAuthToken.delete({ where: { id: token.id } })
          return rej({ message: "Authorization token has been revoked." });
        }

        return res(decoded);
      });
    })
  },

  async generateToken(id: string): Promise<string | null> {
    const user = await prismaInstance.user.findFirst({
      where: {
        id
      }
    });

    if (!user) return null;

    const token = prismaInstance.userAuthToken.create({
      data: {
        userId: user.id
      }
    });

    return jwt.sign({
      id,
      token: (await token).token,
      timestamp: new Date().getTime()
    }, jwtPrivateKey)
  },
}