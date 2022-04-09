import { makeRestaurant } from "./RestaurantFactory";
import { idGenerator } from "../../Ports/DrivenPorts/IdGenerator/IdGenerator";

const Restaurant = makeRestaurant(idGenerator);

export { Restaurant };
