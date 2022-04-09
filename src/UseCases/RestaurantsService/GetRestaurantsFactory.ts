import { IRestaurantOwnersGateway } from "../../Ports/DrivenPorts/Persistence/RestaurantOwnersGateway/RestaurantOwnersGateway.interface";
import { IRestaurantsGateway } from "../../Ports/DrivenPorts/Persistence/RestaurantsGateway/RestaurantsGateway.interface";
import { ITokenManager } from "../../Ports/DrivenPorts/TokenManager/TokenManager.interface";

class GetRestaurentsFactory {
  constructor(
    private readonly restaurantGateway: IRestaurantsGateway,
    private readonly ownersGateway: IRestaurantOwnersGateway,
    private readonly tokenManager: ITokenManager
  ) {}

  async getAll() {
    const restaurants = await this.restaurantGateway.getAll();

    return restaurants.map((restaurant) => restaurant.info());
  }

  async getById(restaurantId: string) {
    const restaurant = await this.restaurantGateway.getById(restaurantId);
    if (!restaurant) throw new Error("restarant doesn't exist");

    const owner = await this.ownersGateway.getById(restaurant.ownerId);
    const ownerNumber = owner?.phoneNumber || "";

    return { ...restaurant.info(), ownerNumber };
  }

  async getRestaurantsOfAuthOwner(authToken: string) {
    const ownerId = this.tokenManager.decode(authToken);
    const restaurants = await this.restaurantGateway.findAllByOwnerId(ownerId);

    return restaurants.map((restaurant) => restaurant.info());
  }
}

export { GetRestaurentsFactory };
