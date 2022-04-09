import mongoose, { model } from "mongoose";

import { restaurantOwnerSchema } from "./Schemas/RestaurantOwner.schema";
import { restaurantSchema } from "./Schemas/Restaurant.schema";

const connectToMongo = () => {
  const uri = process.env.MONGO_DB_URI;
  if (!uri) throw new Error("must have the MONGO_DB_URI in your envirement");

  return mongoose.connect(uri);
};

const RestaurantOwnerModel = model("restaurant_owners", restaurantOwnerSchema);
const RestaurantModel = model("restaurants", restaurantSchema);

export { RestaurantOwnerModel, RestaurantModel, connectToMongo };
