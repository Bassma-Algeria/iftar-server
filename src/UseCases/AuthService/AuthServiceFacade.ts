import { ITokenManager } from '../../Ports/DrivenPorts/TokenManager/TokenManager.interface';
import { IPasswordManager } from '../../Ports/DrivenPorts/PasswordManager/PasswordManager.interface';
import { IRestaurantOwnersGateway } from '../../Ports/DrivenPorts/Persistence/RestaurantOwnersGateway/RestaurantOwnersGateway.interface';

import { LoginBody, LoginUseCase } from './Usecases/LoginUseCase';
import { RegisterUseCase, RegistrationBody } from './Usecases/RegisterUseCase';

class AuthServiceFacade {
    constructor(
        private readonly ownersGateway: IRestaurantOwnersGateway,
        private readonly tokenManager: ITokenManager,
        private readonly passwordManager: IPasswordManager,
    ) {}

    async login(loginBody: LoginBody): Promise<string> {
        return new LoginUseCase(this.ownersGateway, this.tokenManager, this.passwordManager).login(
            loginBody,
        );
    }

    async register(registrationBody: RegistrationBody): Promise<string> {
        return new RegisterUseCase(
            this.ownersGateway,
            this.passwordManager,
            this.tokenManager,
        ).register(registrationBody);
    }
}

export { AuthServiceFacade };
