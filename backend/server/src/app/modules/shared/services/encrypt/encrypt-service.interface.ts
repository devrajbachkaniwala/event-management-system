export const encryptServiceToken = Symbol('encryptServiceToken');
export interface IEncryptService {
  hash(password: string, saltRounds): Promise<string>;
  compare(password: string, hashedPassword): Promise<boolean>;
}
