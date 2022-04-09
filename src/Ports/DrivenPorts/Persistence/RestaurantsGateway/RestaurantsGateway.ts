import {
  IRestaurantsPersistanceFacade,
  RestaurantsGateway,
} from "../../../../Adapters/DrivenAdapters/Persistence/RestaurantsGateway/RestaurantsGateway";
import { FakeRestaurantPersistenceFacade } from "../../../../Adapters/DrivenAdapters/Persistence/RestaurantsGateway/RestaurantsPersistenceFacade/FakeRestaurantsPersistanceFacade";
import { MongoRestaurantsPersistenceFacade } from "../../../../Adapters/DrivenAdapters/Persistence/RestaurantsGateway/RestaurantsPersistenceFacade/MongoRestaurantsPersistenceFacade";

import { IRestaurantsGateway } from "./RestaurantsGateway.interface";

let restaurantsPersistence: IRestaurantsPersistanceFacade;

if (process.env.NODE_ENV === "TEST") {
  restaurantsPersistence = new FakeRestaurantPersistenceFacade();
} else {
  restaurantsPersistence = new MongoRestaurantsPersistenceFacade();
}

const restaurantsGateway: IRestaurantsGateway = new RestaurantsGateway(restaurantsPersistence);

export { restaurantsGateway, restaurantsPersistence };
