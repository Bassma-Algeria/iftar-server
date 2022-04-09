import { expect } from "chai";

import { ownersPersistence } from "../../../src/Ports/DrivenPorts/Persistence/RestaurantOwnersGateway/RestaurantOwnersGateway";
import { authService } from "../../../src/Ports/DriverPorts/AuthService";
import { getResturantOwnerInfo } from "../../_Fakes_/RestaurantOwnerInfo";

describe("Registration & Login Use cases", () => {
  let userInfo = getResturantOwnerInfo();
  let registrationBody = { ...userInfo, confirmPassword: userInfo.password };

  beforeEach(() => {
    userInfo = getResturantOwnerInfo();
    registrationBody = { ...userInfo, confirmPassword: userInfo.password };
  });

  afterEach(() => {
    ownersPersistence.deleteAll();
  });

  it("Restaurant Owner cannot register with an invalid email", async () => {
    await expect(
      authService.register({ ...registrationBody, email: "invalidEmail" })
    ).to.eventually.be.rejected.and.have.property("email");
  });

  it("Restaurant Owner cannot register with an empty password", async () => {
    await expect(
      authService.register({ ...registrationBody, password: "" })
    ).to.eventually.be.rejected.and.have.property("password");
  });

  it("The confirmPassword should equal the Password", async () => {
    await expect(
      authService.register({
        ...registrationBody,
        confirmPassword: "anotherPassword",
      })
    ).to.eventually.be.rejected.and.have.property("confirmPassword");
  });

  it("Restaurant Owner cannot register with an invalid phone number", async () => {
    await expect(
      authService.register({ ...registrationBody, phoneNumber: "invalid" })
    ).to.eventually.be.rejected.and.have.property("phoneNumber");
  });

  it("new Restaurnt Owner should not be able to register with an existing email", async () => {
    await authService.register(registrationBody);
    await expect(
      authService.register(registrationBody)
    ).to.eventually.be.rejected.and.have.property("email");
  });

  it("new Restaurnt Owner should not be able to register with an existing phoneNumber", async () => {
    await authService.register(registrationBody);
    await expect(
      authService.register({ ...registrationBody, email: "another@email.com" })
    ).to.eventually.be.rejected.and.have.property("phoneNumber");
  });

  it("should hash the password before saving the owner", async () => {
    await authService.register(registrationBody);
    const savedOwner = await ownersPersistence.getByEmail(registrationBody.email);

    expect(savedOwner?.password).to.not.equal(registrationBody.password);
  });

  it("should return a unique token when everything is ok", async () => {
    const firstOwner = { email: "first@gmail.com", phoneNumber: "0798 98 09 75" };
    const secondOwner = { email: "second@gmail.com", phoneNumber: "0598 98 09 75" };

    const token1 = await authService.register({ ...registrationBody, ...firstOwner });
    const token2 = await authService.register({ ...registrationBody, ...secondOwner });

    expect(token1).to.include("Bearer ").and.not.equal(token2);
  });

  it("should not be able to login with an invalid email or empty password", async () => {
    await expect(
      authService.login({ ...registrationBody, email: "invalid" })
    ).to.eventually.be.rejected.and.have.property("email");

    await expect(
      authService.login({ ...registrationBody, password: "" })
    ).to.eventually.be.rejected.and.have.property("password");
  });

  it("should not be able to login with none exsisting email", async () => {
    await expect(authService.login(registrationBody)).to.eventually.be.rejected.and.have.property(
      "credentials"
    );
  });

  it("should not be able to login with wrong password", async () => {
    await authService.register(registrationBody);

    await expect(
      authService.login({ ...registrationBody, password: "wrongPassword" })
    ).to.eventually.be.rejected.and.have.property("credentials");
  });

  it("should get a Bearer token when the credentials are correct", async () => {
    await authService.register(registrationBody);
    await expect(authService.login(registrationBody)).to.eventually.include("Bearer ");
  });

  it("should get the same Bearer token when register and login with same credentials", async () => {
    const tokenFromRegister = await authService.register(registrationBody);
    const tokenFromLogin = await authService.login(registrationBody);

    expect(tokenFromLogin).to.equal(tokenFromRegister);
  });

  it("should login normally when trying with an email with uppercased letters, or with some spaces in the left and right", async () => {
    await authService.register(registrationBody);

    await expect(
      authService.login({ ...registrationBody, email: registrationBody.email.toUpperCase() })
    ).to.eventually.include("Bearer ");

    await expect(
      authService.login({ ...registrationBody, email: `  ${registrationBody.email}` })
    ).to.eventually.include("Bearer ");

    await expect(
      authService.login({ ...registrationBody, password: `  ${registrationBody.password}  ` })
    ).to.eventually.include("Bearer ");
  });

  it("should not be able to login just with the correct password literrally", async () => {
    await authService.register(registrationBody);

    await expect(
      authService.login({ ...registrationBody, password: registrationBody.password.toUpperCase() })
    ).to.eventually.be.rejected.have.property("credentials");
  });
});
