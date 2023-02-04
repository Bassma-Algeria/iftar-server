import 'deep-equal-in-any-order';
import { expect } from 'chai';

import { RestaurantsGateway } from '../../../../src/Adapters/DrivenAdapters/Persistence/RestaurantsGateway/RestaurantsGateway';
import { FakeRestaurantPersistenceFacade } from '../../../../src/Adapters/DrivenAdapters/Persistence/RestaurantsGateway/RestaurantsPersistenceFacade/FakeRestaurantsPersistanceFacade';

import { IRestaurant } from '../../../../src/Domain/Restaurant/RestaurantFactory';
import { Restaurant } from '../../../../src/Domain/Restaurant/Restaurant';

import { getRestaurantInfo } from '../../../_Fakes_/RestaurantInfo';

describe('Fake RestaurantsGateway', () => {
    const restaurantsPersistence = new FakeRestaurantPersistenceFacade();
    const restaurantsGateway = new RestaurantsGateway(restaurantsPersistence);

    let restaurant: IRestaurant;

    beforeEach(async () => {
        restaurant = new Restaurant(getRestaurantInfo());
    });

    afterEach(() => {
        restaurantsPersistence.deleteAll();
    });

    it('should return undefined when trying to get a non existing restaurant', async () => {
        const restaurant = await restaurantsGateway.getById('nonExistingUserId');
        expect(restaurant).to.be.equal(undefined);
    });

    it('should save restaurant and get it by id', async () => {
        await restaurantsGateway.save(restaurant);
        const savedRestaurant = await restaurantsGateway.getById(restaurant.restaurantId);

        expect(savedRestaurant?.info()).to.deep.equalInAnyOrder(restaurant.info());
    });

    it('should get all the saved restaurants', async () => {
        for (let i = 0; i < 10; i++) {
            const restaurant = new Restaurant(getRestaurantInfo());
            await restaurantsGateway.save(restaurant);
        }

        const result = await restaurantsGateway.getAll();
        expect(result).to.have.lengthOf(10);
    });

    it('should get all the restaurant of a specific owner', async () => {
        await restaurantsGateway.save(new Restaurant(getRestaurantInfo()));

        const ownerId = restaurant.ownerId;
        for (let i = 0; i < 5; i++) {
            const restaurant = new Restaurant({ ...getRestaurantInfo(), ownerId });
            await restaurantsGateway.save(restaurant);
        }

        const result = await restaurantsGateway.findAllByOwnerId(ownerId);
        expect(result).to.have.lengthOf(5);
    });

    it('should update a saved restaurant', async () => {
        const restaurantId = restaurant.restaurantId;

        await restaurantsGateway.save(restaurant);

        const updated = new Restaurant({ ...getRestaurantInfo(), restaurantId });
        await restaurantsGateway.update(updated);

        const saved = await restaurantsGateway.getById(restaurantId);
        expect(saved?.info()).to.deep.equalInAnyOrder(updated.info());
    });

    it('should search for restaurants by name', async () => {
        let restaurant = new Restaurant(getRestaurantInfo());
        await restaurantsGateway.save(restaurant);

        restaurant = new Restaurant({ ...getRestaurantInfo(), name: 'ra7ma' });
        await restaurantsGateway.save(restaurant);

        restaurant = new Restaurant({ ...getRestaurantInfo(), name: 'ra7ma food' });
        await restaurantsGateway.save(restaurant);

        restaurant = new Restaurant({ ...getRestaurantInfo(), name: 'mat3am ra7ma' });
        await restaurantsGateway.save(restaurant);

        const result = await restaurantsGateway.searchFor('ra7ma');
        expect(result).to.have.lengthOf(3);
    });
});
