export interface IPasswordManager {
  hash(password: string): Promise<string>;
  isMatch(literal: string, hash: string): Promise<boolean>;
}
