import { idGenerator } from "../../Ports/DrivenPorts/IdGenerator/IdGenerator";
import { makeRestaurantOwner } from "./RestaurantOwnerFactory";

const RestaurantOwner = makeRestaurantOwner(idGenerator);

export { RestaurantOwner };
