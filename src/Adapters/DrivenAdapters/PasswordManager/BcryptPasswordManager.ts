import bcrypt from "bcrypt";
import { IPasswordManager } from "../../../Ports/DrivenPorts/PasswordManager/PasswordManager.interface";

class BcryptPasswordManager implements IPasswordManager {
  async hash(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  async isMatch(literal: string, hash: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(literal, hash);
    return isMatch;
  }
}

export { BcryptPasswordManager };
