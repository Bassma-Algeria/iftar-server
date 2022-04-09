import type { RestaurantInfo } from "../@types/Helpers";
import { IRestaurantsPersistanceFacade } from "../RestaurantsGateway";

class FakeRestaurantPersistenceFacade implements IRestaurantsPersistanceFacade {
  private store = new Map<string | undefined, RestaurantInfo>();

  findAllByOwnerId(ownerId: string): Promise<RestaurantInfo[]> {
    let results: RestaurantInfo[] = [];

    this.store.forEach((restaurant) => {
      if (restaurant.ownerId === ownerId) results.push(restaurant);
    });

    return Promise.resolve(results);
  }

  async update(info: RestaurantInfo): Promise<RestaurantInfo> {
    this.store.set(info.restaurantId, info);
    return info;
  }

  save(restaurant: RestaurantInfo) {
    this.store.set(restaurant.restaurantId, restaurant);
    return Promise.resolve(restaurant);
  }

  async searchFor(keyword: string): Promise<RestaurantInfo[]> {
    let results: RestaurantInfo[] = [];

    this.store.forEach((restaurant) => {
      if (restaurant.name.includes(keyword)) results.push(restaurant);
    });

    return results;
  }

  async getAll(): Promise<RestaurantInfo[]> {
    return Array.from(this.store.values());
  }

  async getById(restaurantId: string): Promise<RestaurantInfo | undefined> {
    return this.store.get(restaurantId);
  }

  async deleteAll(): Promise<void> {
    this.store.clear();
  }
}

export { FakeRestaurantPersistenceFacade };
