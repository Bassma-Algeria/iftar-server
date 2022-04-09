import { NonFunctionProperties } from "../../../../../@types/helperTypes";
import { IRestaurantOwner } from "../../../../../Domain/RestaurantOwner/RestaurantOwnerFactory";
import { OwnerInfo } from "../@types/Helpers";

import { IRestaurantOwnersPersistenceFacade } from "../RestaurantOwnerGateway";

class FakeRestaurantOwnersPersistenceFacade implements IRestaurantOwnersPersistenceFacade {
  private store = new Map<string, OwnerInfo>();

  async getById(id: string) {
    const owner = this.store.get(id);
    if (!owner) return undefined;

    return owner;
  }

  async save(ownerInfo: OwnerInfo) {
    this.store.set(ownerInfo.ownerId, ownerInfo);
    return ownerInfo;
  }

  async getByEmail(email: string) {
    let targetOwner: OwnerInfo | undefined;

    this.store.forEach((ownerInfo) => {
      if (ownerInfo.email === email) targetOwner = ownerInfo;
    });

    return targetOwner;
  }

  async getByPhone(phone: string) {
    let targetOwner: OwnerInfo | undefined;

    this.store.forEach((ownerInfo) => {
      if (ownerInfo.phoneNumber === phone) targetOwner = ownerInfo;
    });

    return targetOwner;
  }

  async deleteAll() {
    this.store.clear();
  }
}

export { FakeRestaurantOwnersPersistenceFacade };
