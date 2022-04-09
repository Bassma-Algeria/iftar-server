import faker from "faker";
import { NonFunctionProperties } from "../../src/@types/helperTypes";
import { IRestaurantOwner } from "../../src/Domain/RestaurantOwner/RestaurantOwnerFactory";

const getResturantOwnerInfo = (): NonFunctionProperties<IRestaurantOwner> => {
  return {
    createdAt: faker.date.past(),
    email: faker.internet.email().toLocaleLowerCase(),
    ownerId: faker.datatype.uuid(),
    password: faker.internet.password(),
    phoneNumber: faker.phone.phoneNumber("05 ## ## ## ##"),
  };
};

export { getResturantOwnerInfo };
