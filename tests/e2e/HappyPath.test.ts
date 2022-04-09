import "chai-http";
import chai, { expect } from "chai";

import { getResturantOwnerInfo } from "../_Fakes_/RestaurantOwnerInfo";
import { getRestaurantInfo } from "../_Fakes_/RestaurantInfo";

import { restaurantsPersistence } from "../../src/Ports/DrivenPorts/Persistence/RestaurantsGateway/RestaurantsGateway";
import { ownersPersistence } from "../../src/Ports/DrivenPorts/Persistence/RestaurantOwnersGateway/RestaurantOwnersGateway";

import { startApp } from "../../src/Adapters/DriverAdapters/REST";

describe("Happy Path", () => {
  let userToken: string;
  let restaurantId: string;
  let restaurantName: string;

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

  it("new restaurant owner register and get a token", (done) => {
    const registrationBody = { ...ownerInfo, confirmPassword: ownerInfo.password };

    chai
      .request(server)
      .post("/api/auth/register")
      .send(registrationBody)
      .end((err, res) => {
        if (err) done(err);

        expect(res).to.have.status(200);
        expect(res.body).to.have.property("success", true);
        expect(res.body).to.have.property("data").to.include("Bearer ");

        userToken = res.body.data;

        done();
      });
  });

  it("the registred restaurant owner login in with his account", (done) => {
    chai
      .request(server)
      .post("/api/auth/login")
      .send({ email: ownerInfo.email, password: ownerInfo.password })
      .end((err, res) => {
        if (err) done(err);

        expect(res).to.have.status(200);
        expect(res.body).to.have.property("success", true);
        expect(res.body).to.have.property("data").to.include("Bearer ").to.equal(userToken);

        done();
      });
  });

  it("the restaurant owner add a restaurant", (done) => {
    chai
      .request(server)
      .post("/api/restaurants/add")
      .send(restaurantInfo)
      .set("authorization", userToken)
      .end((err, res) => {
        if (err) done(err);

        expect(res).to.have.status(200);
        expect(res.body).to.have.property("success", true);

        done();
      });
  });

  it("the restaurant owner get a list of all the restaurants he have", (done) => {
    chai
      .request(server)
      .get("/api/restaurants/myRestaurants")
      .set("authorization", userToken)
      .end((err, res) => {
        if (err) done(err);

        expect(res).to.have.status(200);
        expect(res.body).to.have.property("success", true);
        expect(res.body).to.have.property("data").to.have.lengthOf(1);
        expect(res.body.data[0].locationCoords).to.deep.equal(restaurantInfo.locationCoords);
        expect(res.body.data[0].name).to.deep.equal(restaurantInfo.name);

        restaurantId = res.body.data[0].restaurantId;

        done();
      });
  });

  it("the restaurant owner decide to update some info of one of the restaurants he have", (done) => {
    chai
      .request(server)
      .put(`/api/restaurants/${restaurantId}`)
      .send({ ...restaurantInfo, name: "another name", pictures: [] })
      .set("authorization", userToken)
      .end((err, res) => {
        if (err) done(err);

        expect(res).to.have.status(200);
        expect(res.body).to.have.property("success", true);

        done();
      });
  });

  it("the restaurant info get updated", (done) => {
    chai
      .request(server)
      .get(`/api/restaurants/${restaurantId}`)
      .end((err, res) => {
        if (err) done(err);

        expect(res).to.have.status(200);
        expect(res.body).to.have.property("success", true);
        expect(res.body.data).to.have.property("name", "another name");
        expect(res.body.data).to.have.property("pictures").to.be.empty;

        done();
      });
  });

  it("another restaurant owner register and add 3 restaurants", (done) => {
    const anotherOwner = getResturantOwnerInfo();
    const registrationBody = { ...anotherOwner, confirmPassword: anotherOwner.password };

    let token: string = "";

    chai
      .request(server)
      .post("/api/auth/register")
      .send(registrationBody)
      .end((err, res) => {
        if (err) done(err);

        token = res.body.data;

        for (let i = 0; i < 3; i++)
          chai
            .request(server)
            .post("/api/restaurants/add")
            .send(getRestaurantInfo())
            .set("authorization", token)
            .end((err, res) => {
              if (err) done(err);

              if (i === 2) done();
            });
      });
  });

  it("a normal user came and open the app, and he found 4 restaurants", (done) => {
    chai
      .request(server)
      .get("/api/restaurants")
      .end((err, res) => {
        if (err) done(err);

        expect(res).to.have.status(200);
        expect(res.body).to.have.property("success", true);
        expect(res.body.data).to.have.lengthOf(4);

        restaurantId = res.body.data[3].restaurantId;

        done();
      });
  });

  it("that user like a restaurants and he get his information", (done) => {
    chai
      .request(server)
      .get(`/api/restaurants/${restaurantId}`)
      .end((err, res) => {
        if (err) done(err);

        expect(res).to.have.status(200);
        expect(res.body).to.have.property("success", true);
        expect(res.body.data).to.have.property("name");
        expect(res.body.data).to.have.property("locationName");
        expect(res.body.data).to.have.property("locationCoords");

        restaurantName = res.body.data.name;

        done();
      });
  });

  it("the user came again to the app, and he want to find the last restaurnt he eat at, so he search for it and found it", (done) => {
    chai
      .request(server)
      .get(`/api/restaurants/search/${restaurantName.slice(0, 3)}`)
      .end((err, res) => {
        if (err) done(err);

        expect(res).to.have.status(200);
        expect(res.body).to.have.property("success", true);
        expect(res.body.data[0]).to.have.property("restaurantId", restaurantId);
        expect(res.body.data[0]).to.have.property("name", restaurantName);

        done();
      });
  });
});
