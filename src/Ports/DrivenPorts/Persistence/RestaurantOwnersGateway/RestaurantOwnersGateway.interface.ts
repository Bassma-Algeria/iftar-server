import { IRestaurantOwner } from "../../../../Domain/RestaurantOwner/RestaurantOwnerFactory";

export interface IRestaurantOwnersGateway {
  getByEmail(email: string): Promise<IRestaurantOwner | undefined>;
  getByPhone(phoneNumber: string): Promise<IRestaurantOwner | undefined>;
  getById(id: string): Promise<IRestaurantOwner | undefined>;
  save(owner: IRestaurantOwner): Promise<IRestaurantOwner>;
}
