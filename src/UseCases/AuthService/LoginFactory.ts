import type { IRestaurantOwnersGateway } from "../../Ports/DrivenPorts/Persistence/RestaurantOwnersGateway/RestaurantOwnersGateway.interface";
import type { ITokenManager } from "../../Ports/DrivenPorts/TokenManager/TokenManager.interface";
import type { IPasswordManager } from "../../Ports/DrivenPorts/PasswordManager/PasswordManager.interface";

import { RestaurantOwner } from "../../Domain/RestaurantOwner/RestaurantOwner";

export interface LoginBody {
  email: string;
  password: string;
}

class LoginFactory {
  constructor(
    private readonly ownersGateway: IRestaurantOwnersGateway,
    private readonly tokenManager: ITokenManager,
    private readonly passwordManager: IPasswordManager
  ) {}

  async login(loginBody: LoginBody) {
    const { email, password } = loginBody;
    const owner = new RestaurantOwner({ email, password });

    const exsitingOwner = await this.findOwnerByEmail(owner.email);
    if (!exsitingOwner) this.WrongCredentialsException();

    const isPasswordCorrect = await this.isPasswordCorrect(owner.password, exsitingOwner.password);
    if (!isPasswordCorrect) this.WrongCredentialsException();

    return this.generateToken(exsitingOwner.ownerId);
  }

  private findOwnerByEmail(email: string) {
    return this.ownersGateway.getByEmail(email);
  }

  private isPasswordCorrect(passwordFromUser: string, savedPassword: string) {
    return this.passwordManager.isMatch(passwordFromUser, savedPassword);
  }

  private generateToken(ownerId: string) {
    return this.tokenManager.generateToken(ownerId);
  }

  private WrongCredentialsException(): never {
    throw { credentials: "wrong credentials" };
  }
}

export { LoginFactory };
