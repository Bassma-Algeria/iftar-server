import { RestaurantOwner } from "../../../../Domain/RestaurantOwner/RestaurantOwner";

import type { IRestaurantOwner } from "../../../../Domain/RestaurantOwner/RestaurantOwnerFactory";
import type { IRestaurantOwnersGateway } from "../../../../Ports/DrivenPorts/Persistence/RestaurantOwnersGateway/RestaurantOwnersGateway.interface";

import { OwnerInfo } from "./@types/Helpers";

export interface IRestaurantOwnersPersistenceFacade {
  getByEmail(email: string): Promise<OwnerInfo | undefined>;
  getByPhone(phone: string): Promise<OwnerInfo | undefined>;
  getById(id: string): Promise<OwnerInfo | undefined>;
  save(info: OwnerInfo): Promise<OwnerInfo>;
  deleteAll(): Promise<void>;
}

class RestaurantOwnersGateway implements IRestaurantOwnersGateway {
  constructor(private readonly restaurantOwnersPersistence: IRestaurantOwnersPersistenceFacade) {}

  async getById(id: string): Promise<IRestaurantOwner | undefined> {
    const ownerInfo = await this.restaurantOwnersPersistence.getById(id);
    if (!ownerInfo) return undefined;

    return new RestaurantOwner(ownerInfo);
  }

  async save(owner: IRestaurantOwner): Promise<IRestaurantOwner> {
    const ownerInfo = await this.restaurantOwnersPersistence.save(owner.info());

    return new RestaurantOwner(ownerInfo);
  }

  async getByEmail(email: string): Promise<IRestaurantOwner | undefined> {
    const ownerInfo = await this.restaurantOwnersPersistence.getByEmail(email);
    if (!ownerInfo) return undefined;

    return new RestaurantOwner(ownerInfo);
  }

  async getByPhone(email: string): Promise<IRestaurantOwner | undefined> {
    const ownerInfo = await this.restaurantOwnersPersistence.getByPhone(email);
    if (!ownerInfo) return undefined;

    return new RestaurantOwner(ownerInfo);
  }
}

export { RestaurantOwnersGateway };
