import { User as DBUser } from '@prisma/client/index';
import { prisma } from '../util/prisma/instance';

export default class User {

  private _data: DBUser

  constructor(data: DBUser) {
    this._data = data;
  }

  get id(): string { return this._data.id; }


  get name(): string { return this._data.name; }
  get email(): string { return this._data.email; }
  get username(): string { return this._data.username; }
  get password(): string | null { return this._data.password }
  get created(): Date { return this._data.created; }

  get lastUpdated(): Promise<Date> {
    return new Promise(async (res, _r) => {
      const user = await prisma.user.findFirst({
        select:  {
          updatedAt: true
        },
        where: {
          id: this.id
        }
      });

      return res(user?.updatedAt ?? new Date("01/01/70"));
    });
  } 


}