import { IPasswordManager } from "./PasswordManager.interface";

import { BcryptPasswordManager } from "../../../Adapters/DrivenAdapters/PasswordManager/BcryptPasswordManager";
import { FakePasswordManager } from "../../../Adapters/DrivenAdapters/PasswordManager/FakePasswordManager";

let passwordManager: IPasswordManager;

if (process.env.NODE_ENV === "TEST") {
  passwordManager = new FakePasswordManager();
} else {
  passwordManager = new BcryptPasswordManager();
}

export { passwordManager };
