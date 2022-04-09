import { Coords, NonFunctionProperties, Time } from "../../@types/helperTypes";
import { IIdGenerator } from "../../Ports/DrivenPorts/IdGenerator/IdGenerator.interface";

export interface IRestaurant {
  restaurantId: string;
  ownerId: string;
  name: string;
  workingTime: { opening: Time; closing: Time };
  locationName: string;
  locationCoords: Coords;
  pictures: string[];
  createdAt: Date;
  info(): NonFunctionProperties<IRestaurant>;
}

interface ContstructorArgs
  extends Omit<NonFunctionProperties<IRestaurant>, "createdAt" | "restaurantId"> {
  restaurantId?: string;
  createdAt?: Date;
}

const makeRestaurant = (idGenerator: IIdGenerator) => {
  return class Restaurant implements IRestaurant {
    ownerId: string;
    restaurantId: string;
    locationCoords: Coords;
    createdAt: Date;
    private _name!: string;
    private _workingTime!: { opening: Time; closing: Time };
    private _locationName!: string;
    private _pictures!: string[];

    constructor(restaurantInfo: ContstructorArgs) {
      this.restaurantId = restaurantInfo.restaurantId || idGenerator.generate();
      this.ownerId = restaurantInfo.ownerId;
      this.name = restaurantInfo.name;
      this.locationName = restaurantInfo.locationName;
      this.locationCoords = restaurantInfo.locationCoords;
      this.workingTime = restaurantInfo.workingTime;
      this.pictures = restaurantInfo.pictures;
      this.createdAt = restaurantInfo.createdAt || new Date();
    }

    public set name(value: string) {
      if (!value) throw new Error("Name should not be empty");
      this._name = value;
    }

    public set locationName(value: string) {
      if (!value) throw new Error("locationName should not be empty");
      this._locationName = value;
    }

    public get pictures() {
      return this._pictures;
    }

    public set pictures(picsUrls: string[]) {
      if (!picsUrls.every(this.isValidUrl)) throw new Error("picture url not valid");
      this._pictures = picsUrls;
    }

    public get workingTime() {
      return this._workingTime;
    }

    public set workingTime(time: { opening: Time; closing: Time }) {
      if (!this.isValidWorkingTime(time)) throw new Error("invalid working time");
      this._workingTime = time;
    }

    public info(): NonFunctionProperties<IRestaurant> {
      return {
        ownerId: this.ownerId,
        restaurantId: this.restaurantId,
        name: this._name,
        workingTime: this._workingTime,
        locationName: this._locationName,
        locationCoords: this.locationCoords,
        pictures: this._pictures,
        createdAt: this.createdAt,
      };
    }

    private isValidWorkingTime(time: { opening: Time; closing: Time }) {
      return (
        time.opening.hour < time.closing.hour ||
        (time.opening.hour === time.closing.hour && time.opening.minute < time.closing.minute)
      );
    }

    private isValidUrl(url: string) {
      return URL_PATTERN.test(url);
    }
  };
};

const URL_PATTERN =
  /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

export { makeRestaurant };
