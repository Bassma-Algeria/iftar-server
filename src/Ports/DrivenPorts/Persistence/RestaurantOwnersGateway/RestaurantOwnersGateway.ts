import type { IRestaurantOwnersGateway } from "./RestaurantOwnersGateway.interface";

import { FakeRestaurantOwnersPersistenceFacade } from "../../../../Adapters/DrivenAdapters/Persistence/RestaurantOwnersGateway/RestaurantOwnersPersistenceFacade/FakeRestaurantOwnersPersistenceFacade";
import { MongoRestaurantOwnersPersistenceFacade } from "../../../../Adapters/DrivenAdapters/Persistence/RestaurantOwnersGateway/RestaurantOwnersPersistenceFacade/MongoRestaurantOwnersPersistenceFacade";

import {
  IRestaurantOwnersPersistenceFacade,
  RestaurantOwnersGateway,
} from "../../../../Adapters/DrivenAdapters/Persistence/RestaurantOwnersGateway/RestaurantOwnerGateway";

let ownersPersistence: IRestaurantOwnersPersistenceFacade;

if (process.env.NODE_ENV === "TEST") {
  ownersPersistence = new FakeRestaurantOwnersPersistenceFacade();
} else {
  ownersPersistence = new MongoRestaurantOwnersPersistenceFacade();
}

const restaurantOwnersGateway: IRestaurantOwnersGateway = new RestaurantOwnersGateway(
  ownersPersistence
);

export { restaurantOwnersGateway, ownersPersistence };
