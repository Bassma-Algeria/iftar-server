import Sinon from "sinon";
import { expect } from "chai";

import { cloudGateway } from "../../../src/Ports/DrivenPorts/CloudGateway/CloudGateway";
import { ownersPersistence } from "../../../src/Ports/DrivenPorts/Persistence/RestaurantOwnersGateway/RestaurantOwnersGateway";
import { restaurantsPersistence } from "../../../src/Ports/DrivenPorts/Persistence/RestaurantsGateway/RestaurantsGateway";

import { getRestaurantInfo } from "../../_Fakes_/RestaurantInfo";
import { getResturantOwnerInfo } from "../../_Fakes_/RestaurantOwnerInfo";

import { authService } from "../../../src/Ports/DriverPorts/AuthService";
import { restaurantsService } from "../../../src/Ports/DriverPorts/RestaurantsService";

describe("Editing Restaurants", () => {
  let authToken: string;
  let restaurantInfo = getRestaurantInfo();

  beforeEach(async () => {
    restaurantInfo = getRestaurantInfo();

    const ownerInfo = getResturantOwnerInfo();
    const confirmPassword = ownerInfo.password;
    authToken = await authService.register({ ...ownerInfo, confirmPassword });
  });

  afterEach(() => {
    restaurantsPersistence.deleteAll();
    ownersPersistence.deleteAll();
  });

  it("should not be able to edit a restaurant with an invalid token", async () => {
    const authToken = "invalidToken";
    await expect(
      restaurantsService.updateRestaurant({ authToken, newRestaurantInfo: restaurantInfo })
    ).to.be.rejected;
  });

  it("only the owner of the restaurant can edit it", async () => {
    const anotherOwner = getResturantOwnerInfo();
    const confirmPassword = anotherOwner.password;
    const anotherToken = await authService.register({ ...anotherOwner, confirmPassword });

    const restaurant = await restaurantsService.registerRestaurant({ authToken, restaurantInfo });
    restaurant.name = "anothername";

    await expect(
      restaurantsService.updateRestaurant({
        authToken: anotherToken,
        newRestaurantInfo: restaurant,
      })
    ).to.be.rejected;
  });

  it("should not be able to edit a non exsiting restaurant", async () => {
    await expect(
      restaurantsService.updateRestaurant({ authToken, newRestaurantInfo: restaurantInfo })
    ).to.be.rejected;
  });

  it("should update the restaurant info when everythink is ok", async () => {
    const restaurant = await restaurantsService.registerRestaurant({ authToken, restaurantInfo });

    const newRestaurantInfo = { ...restaurant };
    newRestaurantInfo.name = "anotherName";
    newRestaurantInfo.workingTime = {
      opening: { hour: 18, minute: 0 },
      closing: { hour: 20, minute: 0 },
    };

    await restaurantsService.updateRestaurant({ authToken, newRestaurantInfo });
    const { ownerNumber, ...updateRestaurantdRestaurant } =
      await restaurantsService.getRestaurantById(restaurant.restaurantId);

    expect(updateRestaurantdRestaurant).to.deep.equal(newRestaurantInfo);
  });

  it("should not have the old restaurant pictures when no one of them exist in the upadated restaurant information", async () => {
    const restaurant = await restaurantsService.registerRestaurant({ authToken, restaurantInfo });

    const newRestaurantInfo = { ...restaurant };
    newRestaurantInfo.pictures = [];

    await restaurantsService.updateRestaurant({ authToken, newRestaurantInfo });
    const updateRestaurantdRestaurant = await restaurantsService.getRestaurantById(
      restaurant.restaurantId
    );

    expect(updateRestaurantdRestaurant?.pictures).be.an.empty("array");
  });

  it("should upload and save the new pictures when they are provided", async () => {
    const restaurant = await restaurantsService.registerRestaurant({ authToken, restaurantInfo });

    const newRestaurantInfo: any = { ...restaurant };
    newRestaurantInfo.pictures = [{}, {}];

    await restaurantsService.updateRestaurant({ authToken, newRestaurantInfo });
    const updateRestaurantdRestaurant = await restaurantsService.getRestaurantById(
      restaurant.restaurantId
    );

    expect(updateRestaurantdRestaurant?.pictures)
      .be.an("array")
      .and.have.lengthOf(2)
      .and.not.deep.equal(restaurant.pictures);
  });

  it("should merge the picture when reg.registerRestauranting new once and keeping some of the old ones", async () => {
    const restaurant = await restaurantsService.registerRestaurant({ authToken, restaurantInfo });

    const newRestaurantInfo: any = { ...restaurant };
    newRestaurantInfo.pictures = [...restaurant.pictures.slice(0, 2), {}, {}];

    await restaurantsService.updateRestaurant({ authToken, newRestaurantInfo });
    const updateRestaurantdRestaurant = await restaurantsService.getRestaurantById(
      restaurant.restaurantId
    );

    expect(updateRestaurantdRestaurant?.pictures).be.an("array").and.have.lengthOf(4);
    expect(updateRestaurantdRestaurant?.pictures).to.not.deep.equal(restaurant.pictures);
    expect(updateRestaurantdRestaurant?.pictures).to.include(restaurant.pictures[0]);
    expect(updateRestaurantdRestaurant?.pictures).to.include(restaurant.pictures[1]);
  });

  it("should delete the pictures from the cloud we don't need anymore", async () => {
    const deletePicSpy = Sinon.spy(cloudGateway, "deleteImageWithUrl");

    const restaurant = await restaurantsService.registerRestaurant({ authToken, restaurantInfo });

    const newRestaurantInfo: any = { ...restaurant };
    newRestaurantInfo.pictures = [restaurant.pictures[0]];

    await restaurantsService.updateRestaurant({ authToken, newRestaurantInfo });
    const updateRestaurantdRestaurant = await restaurantsService.getRestaurantById(
      restaurant.restaurantId
    );

    expect(updateRestaurantdRestaurant?.pictures).be.an("array").and.have.lengthOf(1);
    expect(deletePicSpy.callCount).to.equal(restaurantInfo.pictures.length - 1);

    restaurant.pictures.forEach((url, index) => {
      if (index == 0) return;
      expect(deletePicSpy.calledWith(url)).to.be.true;
    });
  });
});
