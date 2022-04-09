import type { ICloudGateway } from "../../Ports/DrivenPorts/CloudGateway/CloudGateway.interface";
import type { IRestaurantOwnersGateway } from "../../Ports/DrivenPorts/Persistence/RestaurantOwnersGateway/RestaurantOwnersGateway.interface";
import type { IRestaurantsGateway } from "../../Ports/DrivenPorts/Persistence/RestaurantsGateway/RestaurantsGateway.interface";
import type { ITokenManager } from "../../Ports/DrivenPorts/TokenManager/TokenManager.interface";

import { AddRestaurantFactory } from "./AddRestaurant/AddRestaurantFactory";
import type { RegisterRestaurantArgs } from "./AddRestaurant/AddRestaurantFactory.types";

import { EditRestaurentsFactory } from "./EditRestaurant/EditRestaurantFactory";
import type { UpdateArgs } from "./EditRestaurant/EditRestaurantFactory.types";

import { GetRestaurentsFactory } from "./GetRestaurantsFactory";
import { SearchForRestaurantFactory } from "./SearchForRestaurantFactory";

class RestaurantsServiceFacade {
  constructor(
    private readonly restaurantsGateway: IRestaurantsGateway,
    private readonly ownersGateway: IRestaurantOwnersGateway,
    private readonly tokenManager: ITokenManager,
    private readonly cloudGateway: ICloudGateway
  ) {}

  async getRestaurantById(id: string) {
    const getRestaurantFactory = new GetRestaurentsFactory(
      this.restaurantsGateway,
      this.ownersGateway,
      this.tokenManager
    );

    return getRestaurantFactory.getById(id);
  }

  async getAllRestaurants() {
    const getRestaurantFactory = new GetRestaurentsFactory(
      this.restaurantsGateway,
      this.ownersGateway,
      this.tokenManager
    );

    return getRestaurantFactory.getAll();
  }

  async getRestaurantsOfAuthOwner(authToken: string) {
    const getRestaurantFactory = new GetRestaurentsFactory(
      this.restaurantsGateway,
      this.ownersGateway,
      this.tokenManager
    );

    return getRestaurantFactory.getRestaurantsOfAuthOwner(authToken);
  }

  async searchFor(keyword: string) {
    const searchForRestaurantFactory = new SearchForRestaurantFactory(this.restaurantsGateway);

    return searchForRestaurantFactory.searchFor(keyword);
  }

  async registerRestaurant(registrationArgs: RegisterRestaurantArgs) {
    const addRestaurantFactory = new AddRestaurantFactory(
      this.tokenManager,
      this.restaurantsGateway,
      this.cloudGateway
    );

    return addRestaurantFactory.add(registrationArgs);
  }

  async updateRestaurant(updateArgs: UpdateArgs) {
    const editRestaurantFactory = new EditRestaurentsFactory(
      this.restaurantsGateway,
      this.cloudGateway,
      this.tokenManager
    );

    return editRestaurantFactory.update(updateArgs);
  }
}

export { RestaurantsServiceFacade };
