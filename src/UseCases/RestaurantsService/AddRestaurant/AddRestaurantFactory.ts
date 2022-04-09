import type { ITokenManager } from "../../../Ports/DrivenPorts/TokenManager/TokenManager.interface";
import type { IRestaurantsGateway } from "../../../Ports/DrivenPorts/Persistence/RestaurantsGateway/RestaurantsGateway.interface";
import type { ICloudGateway } from "../../../Ports/DrivenPorts/CloudGateway/CloudGateway.interface";

import { Restaurant } from "../../../Domain/Restaurant/Restaurant";
import type { IRestaurant } from "../../../Domain/Restaurant/RestaurantFactory";

import type { RegisterRestaurantArgs } from "./AddRestaurantFactory.types";

class AddRestaurantFactory {
  constructor(
    private readonly tokenManager: ITokenManager,
    private readonly restaurantsGateway: IRestaurantsGateway,
    private readonly cloudGateway: ICloudGateway
  ) {}

  async add({ authToken, restaurantInfo }: RegisterRestaurantArgs) {
    const ownerId = this.decodeToken(authToken);

    const { pictures, ...rest } = restaurantInfo;
    const restaurant = new Restaurant({ ...rest, pictures: [], ownerId });

    const picturesUrls = await this.uploadPicsAndGetUrls(pictures);
    restaurant.pictures = picturesUrls;

    const savedRestaurant = await this.saveRestaurant(restaurant);
    return savedRestaurant.info();
  }

  private decodeToken(token: string) {
    return this.tokenManager.decode(token);
  }

  private async uploadPicsAndGetUrls(pics: string[]) {
    let picsUrls: string[] = [];

    for (const pic of pics) {
      const url = await this.cloudGateway.uploadImage(pic);
      picsUrls.push(url);
    }

    return picsUrls;
  }

  private saveRestaurant(restaurant: IRestaurant) {
    return this.restaurantsGateway.save(restaurant);
  }
}

export { AddRestaurantFactory };
