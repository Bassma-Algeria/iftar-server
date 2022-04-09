import { restaurantsService } from "../../../../../Ports/DriverPorts/RestaurantsService";
import { ControllerFunction } from "../../@types/RequestResponse.interfaces";
import { makeRestController } from "../RestControllerFactory";

const updateRestaurant: ControllerFunction = makeRestController(({ body, headers, params }) => {
  const { authorization: authToken } = headers;
  if (!authToken) throw { authorization: "not authorized" };

  const { restaurantId } = params;

  return restaurantsService.updateRestaurant({
    authToken,
    newRestaurantInfo: { ...body, restaurantId },
  });
});

export { updateRestaurant };
