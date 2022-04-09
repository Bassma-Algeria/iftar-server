import { Restaurant } from "../../../../Domain/Restaurant/Restaurant";
import { IRestaurant } from "../../../../Domain/Restaurant/RestaurantFactory";
import { IRestaurantsGateway } from "../../../../Ports/DrivenPorts/Persistence/RestaurantsGateway/RestaurantsGateway.interface";

import { RestaurantInfo } from "./@types/Helpers";

export interface IRestaurantsPersistanceFacade {
  searchFor(keyword: string): Promise<RestaurantInfo[]>;
  save(restaurant: RestaurantInfo): Promise<RestaurantInfo>;
  getAll(): Promise<RestaurantInfo[]>;
  getById(restaurantId: string): Promise<RestaurantInfo | undefined>;
  update(newRestaurentInfo: RestaurantInfo): Promise<RestaurantInfo>;
  deleteAll(): Promise<void>;
  findAllByOwnerId(ownerId: string): Promise<RestaurantInfo[]>;
}

class RestaurantsGateway implements IRestaurantsGateway {
  constructor(private readonly restaurantPersistence: IRestaurantsPersistanceFacade) {}

  async findAllByOwnerId(ownerId: string): Promise<IRestaurant[]> {
    const restaurants = await this.restaurantPersistence.findAllByOwnerId(ownerId);
    return restaurants.map((restaurant) => new Restaurant(restaurant));
  }

  async update(restaurant: IRestaurant): Promise<IRestaurant> {
    const updatedRestaurant = await this.restaurantPersistence.update(restaurant.info());
    return new Restaurant(updatedRestaurant);
  }

  async searchFor(keyword: string): Promise<IRestaurant[]> {
    const restaurants = await this.restaurantPersistence.searchFor(keyword);
    return restaurants.map((restaurant) => new Restaurant(restaurant));
  }

  async save(restaurant: IRestaurant): Promise<IRestaurant> {
    const savedRestaurant = await this.restaurantPersistence.save(restaurant.info());
    return new Restaurant(savedRestaurant);
  }

  async getAll(): Promise<IRestaurant[]> {
    const restaurants = await this.restaurantPersistence.getAll();
    return restaurants.map((restaurant) => new Restaurant(restaurant));
  }

  async getById(restaurantId: string): Promise<IRestaurant | undefined> {
    const restaurant = await this.restaurantPersistence.getById(restaurantId);
    if (!restaurant) return undefined;

    return new Restaurant(restaurant);
  }
}
export { RestaurantsGateway };
