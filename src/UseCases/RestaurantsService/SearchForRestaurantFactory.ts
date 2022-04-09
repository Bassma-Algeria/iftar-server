import { IRestaurantsGateway } from "../../Ports/DrivenPorts/Persistence/RestaurantsGateway/RestaurantsGateway.interface";

class SearchForRestaurantFactory {
  constructor(private readonly restaurantsGateway: IRestaurantsGateway) {}

  async searchFor(keyword: string) {
    keyword = keyword.trim();
    if (!keyword) return [];

    const restaurants = await this.restaurantsGateway.searchFor(keyword);

    return restaurants.map((restaurant) => restaurant.info());
  }
}

export { SearchForRestaurantFactory };
