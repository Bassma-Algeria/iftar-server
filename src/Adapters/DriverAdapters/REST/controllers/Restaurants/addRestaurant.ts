import { restaurantsService } from "../../../../../Ports/DriverPorts/RestaurantsService";
import { ControllerFunction } from "../../@types/RequestResponse.interfaces";
import { makeRestController } from "../RestControllerFactory";

const addRestaurant: ControllerFunction = makeRestController(({ body, headers }) => {
  const { authorization: authToken } = headers;
  if (!authToken) throw { authorization: "not authorized" };

  return restaurantsService.registerRestaurant({ authToken, restaurantInfo: body });
});

export { addRestaurant };
