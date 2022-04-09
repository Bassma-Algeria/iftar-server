import { AuthServiceFacade } from "../../UseCases/AuthService/AuthServiceFacade";

import { tokenManager } from "../DrivenPorts/TokenManager/TokenManager";
import { passwordManager } from "../DrivenPorts/PasswordManager/PasswordManager";
import { restaurantOwnersGateway } from "../DrivenPorts/Persistence/RestaurantOwnersGateway/RestaurantOwnersGateway";

const authService = new AuthServiceFacade(restaurantOwnersGateway, tokenManager, passwordManager);

export { authService };
