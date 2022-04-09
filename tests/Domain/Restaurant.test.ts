import { expect } from "chai";

import { Restaurant } from "../../src/Domain/Restaurant/Restaurant";

import { getRestaurantInfo } from "../_Fakes_/RestaurantInfo";

describe("Restaurant Entity", () => {
  const restaurantInfo = getRestaurantInfo();

  it("should not have a restaurant with an empty name or locationName", () => {
    expect(() => new Restaurant({ ...restaurantInfo, name: "" })).to.throw();
    expect(() => new Restaurant({ ...restaurantInfo, locationName: "" })).to.throw();
  });

  it("should identify the resturant when no id is provided", () => {
    const restaurant1 = new Restaurant({ ...restaurantInfo, restaurantId: undefined });
    const restaurant2 = new Restaurant({ ...restaurantInfo, restaurantId: undefined });
    expect(restaurant1.restaurantId).to.be.a("string").and.to.not.equal(restaurant2.restaurantId);

    const restaurant3 = new Restaurant(restaurantInfo);
    expect(restaurant3.restaurantId).to.equal(restaurantInfo.restaurantId);
  });

  it("when no creation time is provided, generate one", () => {
    const restaurant1 = new Restaurant({ ...restaurantInfo, createdAt: undefined });
    expect(restaurant1.createdAt).to.be.a("Date");

    const restaurant2 = new Restaurant(restaurantInfo);
    expect(restaurant2.createdAt).to.equal(restaurantInfo.createdAt);
  });

  it("should not have a restaurant with an opening time bigger than the closing time", () => {
    let info = {
      ...restaurantInfo,
      workingTime: { opening: { hour: 10, minute: 0 }, closing: { hour: 9, minute: 0 } },
    };
    expect(() => new Restaurant(info)).to.throw();

    info.workingTime.opening.hour = 9;
    info.workingTime.closing.minute = 20;
    info.workingTime.closing.hour = 9;
    info.workingTime.closing.minute = 0;

    expect(() => new Restaurant(info)).to.throw();
  });

  it("when the pictures are provided, they should be some valid pictures urls", () => {
    expect(() => new Restaurant({ ...restaurantInfo, pictures: ["invalid"] })).to.throw();
  });
});
