import { IPasswordManager } from "../../../Ports/DrivenPorts/PasswordManager/PasswordManager.interface";

class FakePasswordManager implements IPasswordManager {
  async hash(password: string): Promise<string> {
    return `${password}hash`;
  }

  async isMatch(literal: string, hash: string): Promise<boolean> {
    const [password] = hash.split("hash");
    return password === literal;
  }
}

export { FakePasswordManager };
