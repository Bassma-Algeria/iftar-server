import "chai-http";
import chai, { expect } from "chai";

import { getResturantOwnerInfo } from "../_Fakes_/RestaurantOwnerInfo";
import { getRestaurantInfo } from "../_Fakes_/RestaurantInfo";

import { restaurantsPersistence } from "../../src/Ports/DrivenPorts/Persistence/RestaurantsGateway/RestaurantsGateway";
import { ownersPersistence } from "../../src/Ports/DrivenPorts/Persistence/RestaurantOwnersGateway/RestaurantOwnersGateway";

import { startApp } from "../../src/Adapters/DriverAdapters/REST";

describe("Happy Path", () => {
  let userToken: string;

  const ownerInfo = getResturantOwnerInfo();
  const restaurantInfo = getRestaurantInfo();

  let server: any;

  before(async () => {
    server = await startApp();
  });

  after(async () => {
    await restaurantsPersistence.deleteAll();
    await ownersPersistence.deleteAll();
    await server.close();
  });

  it("new restaurant owner try to open an account with a used email, or a used phone number and get an error message", (done) => {
    const registrationBody = { ...ownerInfo, confirmPassword: ownerInfo.password };

    chai
      .request(server)
      .post("/api/auth/register")
      .send(registrationBody)
      .end((err, res) => {
        if (err) done(err);

        userToken = res.body.data;

        chai
          .request(server)
          .post("/api/auth/register")
          .send({ ...registrationBody, phoneNumber: "0798986865" })
          .end((err, res) => {
            if (err) done(err);

            expect(res).to.have.status(400);
            expect(res.body.error).to.have.property("email");
          });

        chai
          .request(server)
          .post("/api/auth/register")
          .send({ ...registrationBody, email: "another@email.com" })
          .end((err, res) => {
            if (err) done(err);

            expect(res).to.have.status(400);
            expect(res.body.error).to.have.property("phoneNumber");

            done();
          });
      });
  });

  it("new restaurant owner try to login with wrong credentails and get an error message", (done) => {
    chai
      .request(server)
      .post("/api/auth/login")
      .send({ email: ownerInfo.email, password: "wrong" })
      .end((err, res) => {
        if (err) done(err);

        expect(res).to.have.status(400);
        expect(res.body.error).to.have.property("credentials");
      });

    chai
      .request(server)
      .post("/api/auth/login")
      .send({ email: "notExist@gmail.com", password: ownerInfo.password })
      .end((err, res) => {
        if (err) done(err);

        expect(res).to.have.status(400);
        expect(res.body.error).to.have.property("credentials");

        done();
      });
  });

  it("new restaurant owner try to update a restaurant that he didn't own", (done) => {
    let anotherToken: string = "";
    const anotherOwner = getResturantOwnerInfo();

    chai
      .request(server)
      .post("/api/auth/register")
      .send({ ...anotherOwner, confirmPassword: anotherOwner.password })
      .end((err, res) => {
        if (err) done(err);
        anotherToken = res.body.data;
      });

    chai
      .request(server)
      .post("/api/restaurants/add")
      .send(restaurantInfo)
      .set("authorization", userToken)
      .end((err, res) => {
        if (err) done(err);
        restaurantInfo.restaurantId = res.body.data.restaurantId;
      });

    chai
      .request(server)
      .put(`/api/restaurants/${restaurantInfo.restaurantId}`)
      .send({ ...restaurantInfo, name: "somename" })
      .set("autorization", anotherToken)
      .end((err, res) => {
        if (err) done(err);

        expect(res).to.have.status(401);
        expect(res.body.success).to.be.false;

        done();
      });
  });
});
