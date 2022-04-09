import { expect } from "chai";
import { BcryptPasswordManager } from "../../../src/Adapters/DrivenAdapters/PasswordManager/BcryptPasswordManager";
import { FakePasswordManager } from "../../../src/Adapters/DrivenAdapters/PasswordManager/FakePasswordManager";

import { IPasswordManager } from "../../../src/Ports/DrivenPorts/PasswordManager/PasswordManager.interface";

const testHandler = (passwordManager: IPasswordManager) => () => {
  it("should hash the given password", async () => {
    const password = "somePassword";
    await expect(passwordManager.hash(password)).to.eventually.not.equal(password);
  });

  it("should check if the hashed password match the literal or not", async () => {
    const literalPassword = "somePassword";
    const hash = await passwordManager.hash(literalPassword);

    await expect(passwordManager.isMatch(literalPassword, hash)).to.eventually.be.true;
    await expect(passwordManager.isMatch("anotherPass", hash)).to.eventually.be.false;
  });
};

describe("PasswordManager", () => {
  describe("Fake Password Manager", testHandler(new FakePasswordManager()));
  describe("Bcrypt Password Manager", testHandler(new BcryptPasswordManager()));
});
