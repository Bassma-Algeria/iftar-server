import type { NonFunctionProperties } from "../../@types/helperTypes";
import type { IIdGenerator } from "../../Ports/DrivenPorts/IdGenerator/IdGenerator.interface";

export interface IRestaurantOwner {
  ownerId: string;
  email: string;
  password: string;
  phoneNumber: string;
  createdAt: Date;
  info(): NonFunctionProperties<IRestaurantOwner>;
}

type ConstructurParams = Partial<NonFunctionProperties<IRestaurantOwner>> & {
  email: string;
  password: string;
};

const makeRestaurantOwner = (idGenerator: IIdGenerator) => {
  return class RestaurantOwner implements IRestaurantOwner {
    private _ownerId?: string;
    private _email?: string;
    private _password?: string;
    private _createdAt?: Date;
    private _phoneNumber?: string;

    constructor(params: ConstructurParams) {
      this.email = params.email;
      this.password = params.password;
      this.phoneNumber = params.phoneNumber;
      this.ownerId = params.ownerId || idGenerator.generate();
      this.createdAt = params.createdAt || new Date();
    }

    public get ownerId(): string {
      if (!this._ownerId) this.IdNotSetException();
      return this._ownerId;
    }

    public set ownerId(id: string) {
      if (!id) this.InvalidIdException();
      this._ownerId = id;
    }

    public get email(): string {
      if (!this._email) this.EmailNotSetException();
      return this._email;
    }

    public set email(email: string) {
      email = email.trim().toLowerCase();
      if (!this.isValidEmail(email)) this.InvalidEmailException();

      this._email = email;
    }

    public get password(): string {
      if (!this._password) this.PasswordNotSetException();
      return this._password;
    }

    public set password(password: string) {
      password = password.trim();
      if (!this.isValidPassword(password)) this.InvalidPasswordException();

      this._password = password;
    }

    public get createdAt(): Date {
      if (!this._createdAt) this.CreatedAtNotSetException();
      return this._createdAt;
    }

    public set createdAt(date: Date) {
      this._createdAt = date;
    }

    public get phoneNumber(): string {
      if (!this._phoneNumber) this.NumberNotSetException();
      return this._phoneNumber;
    }

    public set phoneNumber(number: string | undefined) {
      number = number?.replace(/ /g, "");

      if (number && !this.isValidPhoneNumber(number)) this.InvalidPhoneNumberException();

      this._phoneNumber = number;
    }

    info(): NonFunctionProperties<IRestaurantOwner> {
      return {
        email: this.email,
        ownerId: this.ownerId,
        password: this.password,
        createdAt: this.createdAt,
        phoneNumber: this.phoneNumber,
      };
    }

    private isValidEmail(email: string): boolean {
      return EMAIL_PATTERN.test(email);
    }

    private isValidPassword(password: string): boolean {
      return !!password;
    }

    private isValidPhoneNumber(number: string): boolean {
      return PHONE_NUMBER_PATTERN.test(number);
    }

    private InvalidEmailException(): never {
      throw { email: "invalid email" };
    }

    private InvalidPasswordException(): never {
      throw { password: "invalid password" };
    }

    private InvalidIdException(): never {
      throw new Error("invalid ownerId");
    }

    private InvalidPhoneNumberException(): never {
      throw { phoneNumber: "invalid phone number" };
    }

    private NumberNotSetException(): never {
      throw new Error("phone number not set");
    }

    private IdNotSetException(): never {
      throw new Error("id not set");
    }

    private EmailNotSetException(): never {
      throw new Error("email not set");
    }

    private PasswordNotSetException(): never {
      throw new Error("password not set");
    }

    private CreatedAtNotSetException(): never {
      throw new Error("createdAt not set");
    }
  };
};

const PHONE_NUMBER_PATTERN = /^(00213|\+213|0)(5|6|7)[0-9]{8}$/;
const EMAIL_PATTERN =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export { makeRestaurantOwner };
