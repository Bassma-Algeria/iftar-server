import { RestaurantOwnerModel } from "../../_SETUP_/MongoDB";
import type { OwnerInfo } from "../@types/Helpers";
import { IRestaurantOwnersPersistenceFacade } from "../RestaurantOwnerGateway";

class MongoRestaurantOwnersPersistenceFacade implements IRestaurantOwnersPersistenceFacade {
  async getById(ownerId: string) {
    try {
      const info = await RestaurantOwnerModel.findOne({ ownerId });
      if (!info) return undefined;

      return info;
    } catch (error) {
      throw new Error(`MongoDB : ${error}`);
    }
  }

  async save(info: OwnerInfo): Promise<OwnerInfo> {
    try {
      return await RestaurantOwnerModel.create(info);
    } catch (error) {
      throw new Error(`MongoDB : ${error}`);
    }
  }

  async getByEmail(email: string): Promise<OwnerInfo | undefined> {
    try {
      const info = await RestaurantOwnerModel.findOne({ email });
      if (!info) return undefined;

      return info;
    } catch (error) {
      throw new Error(`MongoDB : ${error}`);
    }
  }

  async getByPhone(phoneNumber: string): Promise<OwnerInfo | undefined> {
    try {
      const info = await RestaurantOwnerModel.findOne({ phoneNumber });
      if (!info) return undefined;

      return info;
    } catch (error) {
      throw new Error(`MongoDB : ${error}`);
    }
  }

  async deleteAll(): Promise<void> {
    try {
      await RestaurantOwnerModel.deleteMany();
    } catch (error) {
      throw new Error(`MongoDB : ${error}`);
    }
  }
}

export { MongoRestaurantOwnersPersistenceFacade };
