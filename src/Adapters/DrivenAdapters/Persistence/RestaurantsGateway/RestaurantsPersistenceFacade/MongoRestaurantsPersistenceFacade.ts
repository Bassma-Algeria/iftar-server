import { RestaurantModel } from "../../_SETUP_/MongoDB";
import type { RestaurantInfo } from "../@types/Helpers";
import type { IRestaurantsPersistanceFacade } from "../RestaurantsGateway";

class MongoRestaurantsPersistenceFacade implements IRestaurantsPersistanceFacade {
  async save(restaurant: RestaurantInfo): Promise<RestaurantInfo> {
    try {
      return await RestaurantModel.create(restaurant);
    } catch (error) {
      throw new Error(`MongoDB: ${error}`);
    }
  }

  async getAll(): Promise<RestaurantInfo[]> {
    try {
      return await RestaurantModel.find();
    } catch (error) {
      throw new Error(`MongoDB: ${error}`);
    }
  }

  async getById(restaurantId: string): Promise<RestaurantInfo | undefined> {
    try {
      const info = await RestaurantModel.findOne({ restaurantId });
      if (!info) return undefined;

      return info;
    } catch (error) {
      throw new Error(`MongoDB: ${error}`);
    }
  }

  async findAllByOwnerId(ownerId: string): Promise<RestaurantInfo[]> {
    try {
      return await RestaurantModel.find({ ownerId });
    } catch (error) {
      throw new Error(`MongoDB: ${error}`);
    }
  }

  async searchFor(keyword: string): Promise<RestaurantInfo[]> {
    try {
      return await RestaurantModel.find({ name: new RegExp(keyword, "i") });
    } catch (error) {
      throw new Error(`MongoDB: ${error}`);
    }
  }

  async update(newRestaurentInfo: RestaurantInfo): Promise<RestaurantInfo> {
    try {
      const { restaurantId } = newRestaurentInfo;

      const info = await RestaurantModel.findOneAndUpdate({ restaurantId }, newRestaurentInfo);
      if (!info) throw new Error(`restaurant with id ${restaurantId} not found`);

      return info;
    } catch (error) {
      throw new Error(`MongoDB: ${error}`);
    }
  }

  async deleteAll(): Promise<void> {
    try {
      await RestaurantModel.deleteMany();
    } catch (error) {
      throw new Error(`MongoDB: ${error}`);
    }
  }
}

export { MongoRestaurantsPersistenceFacade };
