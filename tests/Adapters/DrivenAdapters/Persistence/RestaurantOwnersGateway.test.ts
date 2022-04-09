import { expect } from "chai";

import { RestaurantOwnersGateway } from "../../../../src/Adapters/DrivenAdapters/Persistence/RestaurantOwnersGateway/RestaurantOwnerGateway";
import { FakeRestaurantOwnersPersistenceFacade } from "../../../../src/Adapters/DrivenAdapters/Persistence/RestaurantOwnersGateway/RestaurantOwnersPersistenceFacade/FakeRestaurantOwnersPersistenceFacade";

import { RestaurantOwner } from "../../../../src/Domain/RestaurantOwner/RestaurantOwner";
import { IRestaurantOwner } from "../../../../src/Domain/RestaurantOwner/RestaurantOwnerFactory";

import { getResturantOwnerInfo } from "../../../_Fakes_/RestaurantOwnerInfo";

describe("Fake RestaurantOwnersGateway", () => {
  const ownersPersistence = new FakeRestaurantOwnersPersistenceFacade();
  const ownersGateway = new RestaurantOwnersGateway(ownersPersistence);

  let owner: IRestaurantOwner;

  beforeEach(() => {
    owner = new RestaurantOwner(getResturantOwnerInfo());
  });

  afterEach(async () => {
    await ownersPersistence.deleteAll();
  });

  it("should return undefined when tryig to get an owner with an email not exist", async () => {
    const saved = await ownersGateway.getByEmail(owner.email);

    expect(saved).to.be.undefined;
  });

  it("should add an owner and get him per id", async () => {
    await ownersGateway.save(owner);
    const returnedOwner = await ownersGateway.getById(owner.ownerId);

    expect(returnedOwner?.info()).to.deep.equal(owner.info());
  });

  it("should add an owner and get him per email", async () => {
    await ownersGateway.save(owner);
    const returnedOwner = await ownersGateway.getByEmail(owner.email);

    expect(returnedOwner?.info()).to.deep.equal(owner.info());
  });

  it("should add an owner and get him per phone number", async () => {
    await ownersGateway.save(owner);
    const returnedOwner = await ownersGateway.getByPhone(owner.phoneNumber);

    expect(returnedOwner?.info()).to.deep.equal(owner.info());
  });
});
