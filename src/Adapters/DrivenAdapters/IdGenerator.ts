import { v4 as uuidv4 } from "uuid";

import type { IIdGenerator } from "../../Ports/DrivenPorts/IdGenerator/IdGenerator.interface";

class IdGenerator implements IIdGenerator {
  generate(): string {
    return uuidv4();
  }
}

export { IdGenerator };
