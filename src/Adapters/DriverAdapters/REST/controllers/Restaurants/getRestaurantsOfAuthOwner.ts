import { ControllerFunction, STATUS_CODES } from "../../@types/RequestResponse.interfaces";
import { restaurantsService } from "../../../../../Ports/DriverPorts/RestaurantsService";
import { makeRestController } from "../RestControllerFactory";

const getRestaurantsOfAuthOwner: ControllerFunction = makeRestController(({ headers }) => {
  const { authorization: authToken } = headers;
  if (!authToken) throw { authorization: "not authorize" };

  return restaurantsService.getRestaurantsOfAuthOwner(authToken);
});

export { getRestaurantsOfAuthOwner };
