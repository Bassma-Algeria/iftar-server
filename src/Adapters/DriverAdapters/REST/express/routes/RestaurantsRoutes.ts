import { Router } from "express";

import { makeExpressController } from "../ExpressControllerFactory";

import { getAllRestaurants } from "../../controllers/Restaurants/getAllRestaurants";
import { getRestaurant } from "../../controllers/Restaurants/getRestaurant";
import { addRestaurant } from "../../controllers/Restaurants/addRestaurant";
import { getRestaurantsOfAuthOwner } from "../../controllers/Restaurants/getRestaurantsOfAuthOwner";
import { updateRestaurant } from "../../controllers/Restaurants/updateRestaurant";
import { searchForRestaurants } from "../../controllers/Restaurants/searchForRestaurants";

const restaurantsRoutes: Router = Router();

restaurantsRoutes.get("/", makeExpressController(getAllRestaurants));
restaurantsRoutes.post("/add", makeExpressController(addRestaurant));
restaurantsRoutes.get("/myRestaurants", makeExpressController(getRestaurantsOfAuthOwner));
restaurantsRoutes.get("/search/:keyword", makeExpressController(searchForRestaurants));
restaurantsRoutes.get("/:restaurantId", makeExpressController(getRestaurant));
restaurantsRoutes.put("/:restaurantId", makeExpressController(updateRestaurant));

export { restaurantsRoutes };
