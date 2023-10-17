export const uuidServiceToken = Symbol('uuidServiceToken');
export interface IUuidService {
  generate(): string;
}
