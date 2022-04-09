import { expect } from "chai";

import { IdGenerator } from "../../../src/Adapters/DrivenAdapters/IdGenerator";

describe("IdGenerator", () => {
  const idGenerator = new IdGenerator();

  it("should generate a unique id every time", () => {
    expect(idGenerator.generate())
      .to.be.a("string")
      .to.not.equal(idGenerator.generate())
      .to.not.equal(idGenerator.generate())
      .to.not.equal(idGenerator.generate())
      .to.not.equal(idGenerator.generate())
      .to.not.equal(idGenerator.generate());
  });
});
