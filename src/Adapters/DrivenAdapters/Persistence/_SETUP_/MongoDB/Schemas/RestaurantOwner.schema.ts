import { Schema } from "mongoose";
import { OwnerInfo } from "../../../RestaurantOwnersGateway/@types/Helpers";

const restaurantOwnerSchema = new Schema<OwnerInfo>({
  ownerId: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  phoneNumber: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, required: true },
});

export { restaurantOwnerSchema };
