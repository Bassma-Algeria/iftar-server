import { restaurantsService } from "../../../../../Ports/DriverPorts/RestaurantsService";
import { ControllerFunction } from "../../@types/RequestResponse.interfaces";
import { makeRestController } from "../RestControllerFactory";

const searchForRestaurants: ControllerFunction = makeRestController(({ params }) => {
  const { keyword } = params;
  return restaurantsService.searchFor(keyword);
});

export { searchForRestaurants };
