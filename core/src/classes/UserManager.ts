import { User } from ".prisma/client";

export default class UserManager {

  private _raw: User;

  constructor(raw: User) {
    this._raw = raw;
  }

  get id(): string { return this._raw.id; }
  get email(): string { return this._raw.email; }
  get password(): string | null { return this._raw.password }

  get created(): Date { return this._raw.created }

  get firstName(): string { return this._raw.firstName; }
  get lastName(): string { return this._raw.lastName; }

  toJson() {
    return {
      id: this.id,
      email: this.email,
      created: this.created,
      firstName: this.firstName,
      lastName: this.lastName
    }
  }
}