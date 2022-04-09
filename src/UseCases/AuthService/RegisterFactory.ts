import type { IRestaurantOwnersGateway } from "../../Ports/DrivenPorts/Persistence/RestaurantOwnersGateway/RestaurantOwnersGateway.interface";
import type { IPasswordManager } from "../../Ports/DrivenPorts/PasswordManager/PasswordManager.interface";
import type { ITokenManager } from "../../Ports/DrivenPorts/TokenManager/TokenManager.interface";

import { RestaurantOwner } from "../../Domain/RestaurantOwner/RestaurantOwner";
import type { IRestaurantOwner } from "../../Domain/RestaurantOwner/RestaurantOwnerFactory";

export interface RegistrationBody {
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
}

class RegisterFactory {
  constructor(
    private readonly restaurantOwnersGateway: IRestaurantOwnersGateway,
    private readonly passwordManager: IPasswordManager,
    private readonly tokenManager: ITokenManager
  ) {}

  async register(registrationBody: RegistrationBody) {
    const { email, password, confirmPassword, phoneNumber } = registrationBody;
    const owner = new RestaurantOwner({ email, password, phoneNumber });

    if (owner.password !== confirmPassword.trim()) this.WrongConfirmPasswordException();

    const ownerWithSameEmail = await this.findOwnerByEmail(owner.email);
    if (ownerWithSameEmail) this.EmailExistException();

    const ownerWithSamePhone = await this.findOwnerByPhone(owner.phoneNumber);
    if (ownerWithSamePhone) this.PhoneExistException();

    owner.password = await this.hashPassword(owner.password);

    await this.saveOwner(owner);

    return this.generateToken(owner.ownerId);
  }

  private findOwnerByEmail(email: string) {
    return this.restaurantOwnersGateway.getByEmail(email);
  }

  private findOwnerByPhone(phoneNumber: string) {
    return this.restaurantOwnersGateway.getByPhone(phoneNumber);
  }

  private async saveOwner(owner: IRestaurantOwner) {
    await this.restaurantOwnersGateway.save(owner);
  }

  private hashPassword(password: string) {
    return this.passwordManager.hash(password);
  }

  private generateToken(ownerId: string) {
    return this.tokenManager.generateToken(ownerId);
  }

  private WrongConfirmPasswordException(): never {
    throw { confirmPassword: "Confirm Password didn't match the password" };
  }

  private EmailExistException(): never {
    throw { email: "email already used" };
  }

  private PhoneExistException(): never {
    throw { phoneNumber: "phone number already used" };
  }
}

export { RegisterFactory };
