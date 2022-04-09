import { IRestaurant } from "../../../../Domain/Restaurant/RestaurantFactory";

export interface IRestaurantsGateway {
  getById(restaurantId: string): Promise<IRestaurant | undefined>;
  searchFor(name: string): Promise<IRestaurant[]>;
  save(owner: IRestaurant): Promise<IRestaurant>;
  getAll(): Promise<IRestaurant[]>;
  update(restaurant: IRestaurant): Promise<IRestaurant>;
  findAllByOwnerId(ownerId: string): Promise<IRestaurant[]>;
}
