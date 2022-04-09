import faker, { fake } from "faker";

import { NonFunctionProperties } from "../../src/@types/helperTypes";
import { IRestaurant } from "../../src/Domain/Restaurant/RestaurantFactory";

const getRestaurantInfo = (): NonFunctionProperties<IRestaurant> => {
  return {
    restaurantId: faker.datatype.uuid(),
    ownerId: faker.datatype.uuid(),
    name: faker.name.findName(),
    workingTime: { opening: { hour: 10, minute: 0 }, closing: { hour: 20, minute: 0 } },
    locationName: faker.internet.userName(),
    locationCoords: { latitude: 10, longitude: 100 },
    pictures: [faker.image.imageUrl(), faker.image.imageUrl(), faker.image.imageUrl()],
    createdAt: faker.date.recent(),
  };
};

export { getRestaurantInfo };
