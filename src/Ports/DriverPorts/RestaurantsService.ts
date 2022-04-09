import { RestaurantsServiceFacade } from "../../UseCases/RestaurantsService/RestaurantsServiceFacade";

import { cloudGateway } from "../DrivenPorts/CloudGateway/CloudGateway";
import { restaurantOwnersGateway } from "../DrivenPorts/Persistence/RestaurantOwnersGateway/RestaurantOwnersGateway";
import { restaurantsGateway } from "../DrivenPorts/Persistence/RestaurantsGateway/RestaurantsGateway";
import { tokenManager } from "../DrivenPorts/TokenManager/TokenManager";

const restaurantsService = new RestaurantsServiceFacade(
  restaurantsGateway,
  restaurantOwnersGateway,
  tokenManager,
  cloudGateway
);

export { restaurantsService };
