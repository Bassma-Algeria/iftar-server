import { Schema } from "mongoose";

import { RestaurantInfo } from "../../../RestaurantsGateway/@types/Helpers";

const restaurantSchema = new Schema<RestaurantInfo>({
  restaurantId: { type: String, unique: true, required: true },
  ownerId: { type: String, required: true },
  name: { type: String, required: true, index: true },
  locationName: { type: String, required: true },
  pictures: { type: [String], required: true },
  createdAt: { type: Date, required: true },

  locationCoords: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  workingTime: {
    opening: { hour: { type: Number, required: true }, minute: { type: Number, required: true } },
    closing: { hour: { type: Number, required: true }, minute: { type: Number, required: true } },
  },
});

export { restaurantSchema };
