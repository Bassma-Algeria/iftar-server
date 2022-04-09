import { IPasswordManager } from "../../Ports/DrivenPorts/PasswordManager/PasswordManager.interface";
import { IRestaurantOwnersGateway } from "../../Ports/DrivenPorts/Persistence/RestaurantOwnersGateway/RestaurantOwnersGateway.interface";
import { ITokenManager } from "../../Ports/DrivenPorts/TokenManager/TokenManager.interface";
import { LoginBody, LoginFactory } from "./LoginFactory";
import { RegisterFactory, RegistrationBody } from "./RegisterFactory";

class AuthServiceFacade {
  constructor(
    private readonly ownersGateway: IRestaurantOwnersGateway,
    private readonly tokenManager: ITokenManager,
    private readonly passwordManager: IPasswordManager
  ) {}

  async login(loginBody: LoginBody): Promise<string> {
    const loginFactory = new LoginFactory(
      this.ownersGateway,
      this.tokenManager,
      this.passwordManager
    );

    return loginFactory.login(loginBody);
  }

  async register(registrationBody: RegistrationBody): Promise<string> {
    const registerFactory = new RegisterFactory(
      this.ownersGateway,
      this.passwordManager,
      this.tokenManager
    );

    return registerFactory.register(registrationBody);
  }
}

export { AuthServiceFacade };
