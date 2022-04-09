import { expect } from "chai";

import { restaurantsPersistence } from "../../../src/Ports/DrivenPorts/Persistence/RestaurantsGateway/RestaurantsGateway";

import { authService } from "../../../src/Ports/DriverPorts/AuthService";
import { restaurantsService } from "../../../src/Ports/DriverPorts/RestaurantsService";

import { getRestaurantInfo } from "../../_Fakes_/RestaurantInfo";
import { getResturantOwnerInfo } from "../../_Fakes_/RestaurantOwnerInfo";

describe("Getting Restaurants", () => {
  let restaurantInfo = getRestaurantInfo();
  let ownerInfo = getResturantOwnerInfo();
  let authToken: string;

  beforeEach(async () => {
    restaurantInfo = getRestaurantInfo();
    ownerInfo = getResturantOwnerInfo();

    const confirmPassword = ownerInfo.password;
    authToken = await authService.register({ ...ownerInfo, confirmPassword });
  });

  afterEach(() => {
    restaurantsPersistence.deleteAll();
  });

  it("should not be able to get a restaurant with a non existing id", async () => {
    await expect(restaurantsService.getRestaurantById("not exsit")).to.be.rejected;
  });

  it("should get the restaurant inforation by its id + the restaurant owner phone number number", async () => {
    const { restaurantId } = await restaurantsService.registerRestaurant({
      authToken,
      restaurantInfo,
    });

    const { ownerNumber, ...info } = await restaurantsService.getRestaurantById(restaurantId);

    expect(ownerNumber).to.equal(ownerInfo.phoneNumber.replace(/ /g, ""));
    expect(info)
      .excluding(["pictures", "ownerId"])
      .to.deep.equal({ ...restaurantInfo, restaurantId });
  });

  it("should return an empty array when no restaurants exsit when getting all the restaurants", async () => {
    await expect(restaurantsService.getAllRestaurants()).to.eventually.be.empty;
  });

  it("should return not be able to get a non existig restaurant", async () => {
    await expect(restaurantsService.getRestaurantById("not exist")).to.be.rejected;
  });

  it("Should return all the existing restaurants", async () => {
    restaurantInfo.restaurantId = "";

    restaurantInfo.name = "restaurant1";
    await restaurantsService.registerRestaurant({ authToken, restaurantInfo });

    restaurantInfo.name = "restaurant2";
    await restaurantsService.registerRestaurant({ authToken, restaurantInfo });

    restaurantInfo.name = "restaurant3";
    await restaurantsService.registerRestaurant({ authToken, restaurantInfo });

    const result = await restaurantsService.getAllRestaurants();
    expect(result).to.have.lengthOf(3);
  });

  it("should return an empty array when the owner didn't register any restaurant", async () => {
    await expect(restaurantsService.getRestaurantsOfAuthOwner(authToken)).to.eventually.be.empty;
  });

  it("Should return all the restaurants that the owner have", async () => {
    restaurantInfo.restaurantId = "";

    await restaurantsService.registerRestaurant({ authToken, restaurantInfo });
    await restaurantsService.registerRestaurant({ authToken, restaurantInfo });
    await restaurantsService.registerRestaurant({ authToken, restaurantInfo });

    const result = await restaurantsService.getRestaurantsOfAuthOwner(authToken);
    expect(result).to.have.lengthOf(3);
  });

  it("should not get other restaurants rather than the restaurant that the owner have when getting his restaurants", async () => {
    const ownerInfo = getResturantOwnerInfo();
    const confirmPassword = ownerInfo.password;
    const anotherToken = await authService.register({ ...ownerInfo, confirmPassword });

    await restaurantsService.registerRestaurant({ authToken, restaurantInfo: getRestaurantInfo() });
    await restaurantsService.registerRestaurant({ authToken, restaurantInfo: getRestaurantInfo() });
    await restaurantsService.registerRestaurant({ authToken, restaurantInfo: getRestaurantInfo() });

    await restaurantsService.registerRestaurant({
      authToken: anotherToken,
      restaurantInfo: getRestaurantInfo(),
    });
    await restaurantsService.registerRestaurant({
      authToken: anotherToken,
      restaurantInfo: getRestaurantInfo(),
    });

    await expect(
      restaurantsService.getRestaurantsOfAuthOwner(authToken)
    ).to.eventually.have.lengthOf(3);

    await expect(
      restaurantsService.getRestaurantsOfAuthOwner(anotherToken)
    ).to.eventually.have.lengthOf(2);
  });

  it("should return empty array when no restaurant is found from the search", async () => {
    const result = await restaurantsService.searchFor("not exsit");
    expect(result).to.be.empty;
  });

  it("Should return restaurants that have a name match the search keyword", async () => {
    restaurantInfo.restaurantId = "";

    restaurantInfo.name = "ra7ma";
    await restaurantsService.registerRestaurant({ authToken, restaurantInfo });

    restaurantInfo.name = "mat3am ra7ma";
    await restaurantsService.registerRestaurant({ authToken, restaurantInfo });

    restaurantInfo.name = "association ra7ma food";
    await restaurantsService.registerRestaurant({ authToken, restaurantInfo });

    const result = await restaurantsService.searchFor("ra7ma");
    expect(result).to.have.lengthOf(3);
  });
});
