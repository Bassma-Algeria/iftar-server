import type { ITokenManager } from "../../../Ports/DrivenPorts/TokenManager/TokenManager.interface";
import type { IRestaurantsGateway } from "../../../Ports/DrivenPorts/Persistence/RestaurantsGateway/RestaurantsGateway.interface";
import type { ICloudGateway } from "../../../Ports/DrivenPorts/CloudGateway/CloudGateway.interface";

import type { UpdateArgs } from "./EditRestaurantFactory.types";
import type { IRestaurant } from "../../../Domain/Restaurant/RestaurantFactory";

export class EditRestaurentsFactory {
  constructor(
    private readonly restaurantGateway: IRestaurantsGateway,
    private readonly cloudGateway: ICloudGateway,
    private readonly tokenManager: ITokenManager
  ) {}

  async update({ authToken, newRestaurantInfo }: UpdateArgs) {
    const ownerId = this.decodeToken(authToken);

    const restaurant = await this.findRestaurantById(newRestaurantInfo.restaurantId);
    if (ownerId !== restaurant?.ownerId) this.NotAuthorizeException();

    restaurant.name = newRestaurantInfo.name;
    restaurant.locationName = newRestaurantInfo.locationName;
    restaurant.locationCoords = newRestaurantInfo.locationCoords;
    restaurant.workingTime = newRestaurantInfo.workingTime;

    const { commonPics, picsToDelete, picsToUpload } = this.filterOldAndNewPictures(
      restaurant.pictures,
      newRestaurantInfo.pictures
    );

    await this.deletePictures(picsToDelete);
    const newPicsUrls = await this.uploadPicturesAndGetUrls(picsToUpload);

    restaurant.pictures = [...commonPics, ...newPicsUrls];
    const updatedRestaurant = await this.updateRestaurant(restaurant);

    return updatedRestaurant.info();
  }

  private NotAuthorizeException(): never {
    throw { authorization: "Only the restaurant Owner can edit it" };
  }

  private decodeToken(authToken: string) {
    return this.tokenManager.decode(authToken);
  }

  private findRestaurantById(id: string) {
    return this.restaurantGateway.getById(id);
  }

  private filterOldAndNewPictures(oldPicsUrls: string[], newPics: any[]) {
    const commonPics = newPics.filter((pic) => oldPicsUrls.includes(pic));
    const picsToUpload = newPics.filter((url) => !oldPicsUrls.includes(url));
    const picsToDelete = oldPicsUrls.filter((url) => !newPics.includes(url));

    return { commonPics, picsToDelete, picsToUpload };
  }

  private async deletePictures(picsUrls: string[]) {
    for (const url of picsUrls) {
      await this.cloudGateway.deleteImageWithUrl(url);
    }
  }

  private async uploadPicturesAndGetUrls(pics: any[]) {
    let urls: string[] = [];

    for (const pic of pics) {
      const url = await this.cloudGateway.uploadImage(pic);
      urls.push(url);
    }

    return urls;
  }

  private updateRestaurant(restaurant: IRestaurant) {
    return this.restaurantGateway.update(restaurant);
  }
}
