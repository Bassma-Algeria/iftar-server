import "chai-exclude";
import Sinon from "sinon";
import { expect } from "chai";

import { ownersPersistence } from "../../../src/Ports/DrivenPorts/Persistence/RestaurantOwnersGateway/RestaurantOwnersGateway";
import { cloudGateway } from "../../../src/Ports/DrivenPorts/CloudGateway/CloudGateway";
import { restaurantsPersistence } from "../../../src/Ports/DrivenPorts/Persistence/RestaurantsGateway/RestaurantsGateway";
import { tokenManager } from "../../../src/Ports/DrivenPorts/TokenManager/TokenManager";

import { authService } from "../../../src/Ports/DriverPorts/AuthService";
import { restaurantsService } from "../../../src/Ports/DriverPorts/RestaurantsService";

import { getRestaurantInfo } from "../../_Fakes_/RestaurantInfo";
import { getResturantOwnerInfo } from "../../_Fakes_/RestaurantOwnerInfo";

describe("Adding Restaurants", () => {
  let restaurantInfo = getRestaurantInfo();

  let authToken: string;

  beforeEach(async () => {
    restaurantInfo = getRestaurantInfo();

    const ownerInfo = getResturantOwnerInfo();
    const confirmPassword = ownerInfo.password;
    authToken = await authService.register({ ...ownerInfo, confirmPassword });
  });

  afterEach(() => {
    ownersPersistence.deleteAll();
    restaurantsPersistence.deleteAll();
  });

  it("should not be able to register a restaurant with an invalid token", async () => {
    await expect(restaurantsService.registerRestaurant({ authToken: "", restaurantInfo })).to.be
      .rejected;
    await expect(restaurantsService.registerRestaurant({ authToken: "invalid", restaurantInfo })).to
      .be.rejected;
  });

  it("should not be able to register with invalid values", async () => {
    let info = { ...restaurantInfo, name: "" };
    await expect(restaurantsService.registerRestaurant({ authToken, restaurantInfo: info })).to.be
      .rejected;

    info = { ...restaurantInfo, locationName: "" };
    await expect(restaurantsService.registerRestaurant({ authToken, restaurantInfo: info })).to.be
      .rejected;
  });

  it("should not be able to register a restaurant with wrong working time", async () => {
    let info = {
      ...restaurantInfo,
      workingTime: { opening: { hour: 10, minute: 0 }, closing: { hour: 9, minute: 0 } },
    };

    await expect(restaurantsService.registerRestaurant({ authToken, restaurantInfo: info })).to.be
      .rejected;
  });

  it("Should register the restaurent when everything is ok", async () => {
    const { restaurantId } = await restaurantsService.registerRestaurant({
      authToken,
      restaurantInfo,
    });

    const { ownerNumber, ...searchResultRestaurant } = await restaurantsService.getRestaurantById(
      restaurantId
    );
    expect(searchResultRestaurant)
      .excluding("pictures")
      .to.deep.equal({ ...restaurantInfo, ownerId: tokenManager.decode(authToken) });
  });

  it("Should upload the pictures of the restaurent", async () => {
    const uploadSpy = Sinon.spy(cloudGateway, "uploadImage");

    const { restaurantId } = await restaurantsService.registerRestaurant({
      authToken,
      restaurantInfo,
    });

    const searchResultRestaurant = await restaurantsService.getRestaurantById(restaurantId);

    expect(searchResultRestaurant.pictures).to.have.lengthOf(restaurantInfo.pictures.length);
    expect(uploadSpy.callCount).to.equal(searchResultRestaurant.pictures.length);
  });
});
