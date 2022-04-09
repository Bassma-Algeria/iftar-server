import { expect } from "chai";
import { TokenManager } from "../../../src/Adapters/DrivenAdapters/TokenManager";

describe("TokenManager", () => {
  const tokenManager = new TokenManager();

  it("should generate a unique Bearer token for each key", () => {
    expect(tokenManager.generateToken("hello"))
      .to.include("Bearer ")
      .to.not.equal(tokenManager.generateToken("hiiiooo"))
      .to.not.equal(tokenManager.generateToken("fooo"))
      .to.not.equal(tokenManager.generateToken("baar"))
      .to.not.equal(tokenManager.generateToken("world happy"))
      .to.not.equal(tokenManager.generateToken("so sad"));
  });

  it("should not decode an invalid token", () => {
    expect(() => tokenManager.decode("someInvalidToken"))
      .to.throw()
      .instanceOf(Error);
  });

  it("should decode the token and return his value", () => {
    for (let i = 0; i < 3; i++) {
      const value = Math.floor(Math.random() * 10 ** 5).toString();
      const token = tokenManager.generateToken(value);

      expect(tokenManager.decode(token)).to.equal(value);
    }
  });
});
