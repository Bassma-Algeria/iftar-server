import { IRestaurantsGateway } from '../../../Ports/DrivenPorts/Persistence/RestaurantsGateway/RestaurantsGateway.interface';

class SearchForRestaurantsUseCase {
    constructor(private readonly restaurantsGateway: IRestaurantsGateway) {}

    async searchFor(keyword: string) {
        keyword = keyword.trim();
        if (!keyword) return [];

        const restaurants = await this.restaurantsGateway.searchFor(keyword);

        return restaurants.map(restaurant => restaurant.info());
    }
}

export { SearchForRestaurantsUseCase };
