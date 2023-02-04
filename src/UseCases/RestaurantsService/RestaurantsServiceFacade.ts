import type { ICloudGateway } from '../../Ports/DrivenPorts/CloudGateway/CloudGateway.interface';
import type { ITokenManager } from '../../Ports/DrivenPorts/TokenManager/TokenManager.interface';
import type { IRestaurantsGateway } from '../../Ports/DrivenPorts/Persistence/RestaurantsGateway/RestaurantsGateway.interface';
import type { IRestaurantOwnersGateway } from '../../Ports/DrivenPorts/Persistence/RestaurantOwnersGateway/RestaurantOwnersGateway.interface';

import { AddRestaurantUseCase } from './UseCases/AddRestaurant/AddRestaurantUseCase';
import type { RegisterRestaurantArgs } from './UseCases/AddRestaurant/AddRestaurantUseCase.types';

import { EditRestaurantsUseCase } from './UseCases/EditRestaurant/EditRestaurantUseCase';
import type { UpdateArgs } from './UseCases/EditRestaurant/EditRestaurantUseCase.types';

import { GetRestaurantsUseCase } from './UseCases/GetRestaurantsUseCase';
import { SearchForRestaurantsUseCase } from './UseCases/SearchForRestaurantsUseCase';

class RestaurantsServiceFacade {
    constructor(
        private readonly restaurantsGateway: IRestaurantsGateway,
        private readonly ownersGateway: IRestaurantOwnersGateway,
        private readonly tokenManager: ITokenManager,
        private readonly cloudGateway: ICloudGateway,
    ) {}

    async getRestaurantById(id: string) {
        return new GetRestaurantsUseCase(
            this.restaurantsGateway,
            this.ownersGateway,
            this.tokenManager,
        ).getById(id);
    }

    async getAllRestaurants() {
        return new GetRestaurantsUseCase(
            this.restaurantsGateway,
            this.ownersGateway,
            this.tokenManager,
        ).getAll();
    }

    async getRestaurantsOfAuthOwner(authToken: string) {
        return new GetRestaurantsUseCase(
            this.restaurantsGateway,
            this.ownersGateway,
            this.tokenManager,
        ).getRestaurantsOfAuthOwner(authToken);
    }

    async searchFor(keyword: string) {
        return new SearchForRestaurantsUseCase(this.restaurantsGateway).searchFor(keyword);
    }

    async registerRestaurant(registrationArgs: RegisterRestaurantArgs) {
        return new AddRestaurantUseCase(
            this.tokenManager,
            this.restaurantsGateway,
            this.cloudGateway,
        ).add(registrationArgs);
    }

    async updateRestaurant(updateArgs: UpdateArgs) {
        return new EditRestaurantsUseCase(
            this.restaurantsGateway,
            this.cloudGateway,
            this.tokenManager,
        ).update(updateArgs);
    }
}

export { RestaurantsServiceFacade };
